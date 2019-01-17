<template>
    <div class="component">
        <div v-if="this.show == 'training'">
            <h4  class="g-title">Praksissted</h4>
            <p style="font-style: italic">Hvor har du vært i praksis?</p>
        </div>
        <div v-else>
            <h4  class="g-title">Arbeidserfaring</h4>
            <p style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group v-if="show == 'training'" style="font-weight: 650" label="Type arbeid">
                <b-form-radio-group style="font-weight: 400" v-model="form.job_type"
                                    :options="job_types" stacked name="where">
                </b-form-radio-group>
            </b-form-group>

            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="employer"><strong>Arbeidsgiver</strong></label>
                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0" :disabled="disableWrite" id="employer" placeholder="" v-model="form.employer" />
                    </div>
                    <div class="col">
                        <label for="place"><strong>Sted</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="place" placeholder="" v-model="form.location" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group >
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
            </b-form-group>


            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <from-to :from="from" :to="to" :ongoing="form.ongoing" :ongoingText="'Jeg jobber her nå'"></from-to>
            
            <upload-media :parent="'exp'" :uid="user_id" :cid="cert_id" :media="media" :links="links"> </upload-media>
 
            <!-- <media-list :media="media" :links="links"></media-list> -->
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id" style="margin-top: 1em"></media-list>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" class="gb-link"><strong>Avbyt</strong></b-link>
            </div>

            <div v-if="feedback">
                <p style="color: red; margin-top: 0.6em; margin-bottom: 0">{{ feedback }}</p>
            </div>
        </b-form>

        <b-modal  class="g-modal" ref="showmodal" size="lg" hide-footer title="Kompis">
            <embed v-if="file" :src="file.url" frameborder="0" width="100%" height="900px">        
        </b-modal>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import UploadMedia from '@/components/common/UploadMedia'
import FromTo from '@/components/common/FromTo'
import { wait } from '@/components/utils/utils';
import MediaList from '@/components/common/MediaList'


export default {
    name: 'WorkExperience',
    components: {
        'from-to': FromTo,
        'upload-media': UploadMedia,
        'media-list': MediaList

    },
    props: ['show', 'uid', 'cid', 'id'],
    data() {
        return {
            job_types: [
                { text: 'Bedrift', value: 'Bedrift' },
                { text: 'Frivillig organisasjon', value: 'Frivillig organisasjon' }
            ],
            form: {
                employer: null,
                location: null,
                job_type: null,
                role: null,
                ongoing: false,
                from: null,
                to: null,
                description: null,
                timestamp: null,
                user_id: null,
                cert_id: null
            },
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null,
                ongoing: false
            },
            media: [],
            links: [],
            user_id: null,
            cert_id: null,
            e_id: null,
            disableWrite: false,
            file: null,
            feedback: null,
            reason: 'onUpdatedExperience'
        }

    },
    watch: {
        id: {
            handler(newId, oldId) {
                // console.log('work watch', this.id, newId, oldId)
                this.e_id = this.id
                this.init()
            },
            deep: true
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
            this.media = []
            this.links = []
        },
        destroy() {
            // this.reset()
            // this.$destroy();
        },    
        cancel() {
            this.destroy()
            this.$emit(this.reason, null)
        },
        update() {
            this.form.timestamp = Date.now()
            try {
                this.form.from = toTimestamp(this.from.month, this.from.year)
                if (this.to.month && this.to.year) {
                    this.form.to = toTimestamp(this.to.month, this.to.year)
                }
                this.form.ongoing = this.to.ongoing
            } catch (error) {
                this.feedback = error
            }

            if (this.e_id) {
                db.collection("experience").doc(this.e_id).set(this.form, {merge: true})
                .then(() => {
                    this.updateMedia()
                    this.updateLinks()
                    this.$emit(this.reason, this.e_id)
                })
                .catch((error) => {
                    this.feedback = error
                    this.cancel()
                });
            } else {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_id 
                db.collection("experience").add(this.form)
                .then((doc) => {
                    this.e_id = doc.id
                    this.updateMedia()
                    this.updateLinks()
                    this.$emit(this.reason, this.e_id)
                })
                .catch((error) => {
                    this.feedback = error
                    this.cancel()
                });
            }
            this.destroy()
        },
        updateMedia() {
            this.media.forEach(element => {
                let item = {filename: element.filename, url: element.url, type: element.type, description: element.description,
                        user_id: this.user_id, cert_id: this.cert_id, parent_id: this.e_id, timestamp: Date.now()}
                try {
                    this.$store.state.database.updateMedia('media', element.id, item)
                } catch(error) {
                    this.feedback = error
                }
            });
        },
        updateLinks() {
            this.links.forEach(element => {
                let item = {name: element.name, url: element.url, description: element.description,
                        user_id: this.user_id, cert_id: this.cert_id, parent_id: this.e_id, timestamp: Date.now()}
                try {
                    this.$store.state.database.updateMedia('links', element.id, item)
                } catch(error) {
                    this.feedback = error
                }
            });
        },
        fetchData() {
            if (this.e_id) {
                db.collection('experience').doc(this.e_id)
                .get()
                .then ((doc) => {
                    if(doc.exists) {
                        this.form = doc.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        if (this.form.to) {
                            this.to.month = getMonth(this.form.to)
                            this.to.year = getYear(this.form.to)
                        }
                        this.to.ongoing = this.form.ongoing
                        this.user_id = this.form.user_id
                        this.cert_id = this.form.cert_id
                        this.media = this.$store.state.database.fetchMedia('media', this.e_id)
                        this.links = this.$store.state.database.fetchMedia('links', this.e_id)
                    }
                })
                .catch((error) => {
                    this.feedback = 'Henting av data feilet. ' + error
                })
            }
        },
        init() {
            this.reset()
            if (this.cid != undefined) 
                this.cert_id  = this.cid
            if (!this.cert_id && this.$route.params.cid)
                this.cert_id = this.$route.params.cid
            if (this.id != undefined) 
                this.e_id  = this.id
            if (!this.e_id && this.$route.params.id)
                this.e_id = this.$route.params.id
            if (this.uid != undefined)
                this.user_id = this.uid
            if (!this.user_id && this.$route.params.uid)
                this.user_id = this.$route.params.uid
            if (!this.user_id)
                this.user_id = firebase.auth().currentUser.uid
            this.fetchData()
        }
    },
    created() {
        this.init()
    }
}
</script>

<style>

</style>
