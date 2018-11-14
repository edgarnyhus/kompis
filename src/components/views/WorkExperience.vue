<template>
    <div class="component" style="margin: 1em">
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
            <upload-media :parent="'exp'" :uid="user_id" :cid="form.cert_id" :media="media" :links="links"> </upload-media>
 
            <media-list :media="media" :links="links"></media-list>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="color: info"><strong>Avbyt</strong></b-link>
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
                cert_id: null,
            },
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null
            },
            media: [],
            links: [],
            user: null,
            user_id: null,
            cert_id: null,
            we_id: null,
            disableWrite: false,
            file: null,
            reason: 'onUpdatedExperience'
        }

    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        cancel() {
            this.$emit(this.reason, null)
            this.$destroy()
        },
        update() {
            if (this.user_id) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_id 
                this.form.timestamp = Date.now()
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                    this.form.media = this.media
                    this.form.links = this.links
                } catch (error) {
                    console.error('update excception: ', error)
                }

                if (this.we_id) {
                    db.collection("experience").doc(this.we_id).set(this.form, {merge: true})
                    .then((docRef) => {
                        console.log("Document updated with ID: ", this.we_id);
                        this.$emit(this.reason, this.we_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("experience").add(this.form)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        this.we_id = docRef.id
                        this.$emit(this.reason, this.we_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            }
            else {
                console.info('User not logged in???')
            }
            // this.$destroy()
        },
        fetchData() {
            if (this.we_id) {
                console.log('we get object', this.we_id)
                // get object
                db.collection('experience').doc(this.we_id)
                .get()
                .then ((docRef) => {
                    if(docRef.exists) {
                        this.form = docRef.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        this.to.month = getMonth(this.form.to)
                        this.to.year = getYear(this.form.to)
                        this.media = this.form.media
                        this.links = this.form.links
                    }
                })
                .catch((error) => {
                    console.error("we error fetching document: ", error);
                });
            }
        }
    },
    mounted() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.cert_id  = this.cid
        this.we_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }

        this.fetchData()
        console.log('we created:', this.we_id)
    }
}
</script>

<style scoped>
a {
    color: rgb(0,161,181);
}
a:hover {
    color: rgb(0,161,181);
}
.g-title {
    margin-top: 0;
    margin-bottom: 0;
}
.g-header {
    margin-bottom: 0;
}
.g-group {
    margin-top: 2em;
}
.g-span {
    margin-right: 1em;
}
</style>
