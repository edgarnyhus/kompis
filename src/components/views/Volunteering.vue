<template>
    <div class="component">
        <div>
            <h4 class="g-title">Frivillig arbeid</h4>
            <p style="font-style: italic">Hvilke frivillig verv har du tatt på deg?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="org"><strong>Navn på organisasjon</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="org" type="text" v-model="form.org" required />
                    </div>
                    <div class="col">
                        <label for="loc"><strong>Sted</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="loc" placeholder="" v-model="form.location" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
            </b-form-group>

            
            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description"
                                placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <from-to :from="from" :to="to" :ongoing="form.ongoing" :ongoingText="'Jeg har det vervet nå'"></from-to>

            <upload-media :parent="'vol'" :uid="user_id" :cid="cert_id" :media="media" :links="links" > </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id" style="margin-top: 1em"></media-list>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" class="gb-link"><strong>Avbyt</strong></b-link>
            </div>

            <div v-if="feedback">
                <p style="color: red; margin-top: 0.6em; margin-bottom: 0">{{ feedback }}</p>
            </div>
        </b-form>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import UploadMedia from '@/components/common/UploadMedia'
import FromTo from '@/components/common/FromTo'
import MediaList from '@/components/common/MediaList'

export default {
    name: 'Volunteering',
    components: {
        FromTo,
        UploadMedia,
        MediaList
    },
    props: ['uid', 'cid', 'id'],
    data() {
        return {
            form: {
                org: null,
                location: null,
                role: null,
                from: null,
                to: null,
                ongoing: false,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            media: [],
            links: [],
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null,
                ongoing: false
            },
            user_id: null,
            cert_id: null,
            e_id: null,
            feedback: null,
            reason: 'onUpdatedVolunteering'
        }
    },
    watch: {
        id: {
            handler(newId, oldId) {
                // console.log('volunteering watch', this.id, newId, oldId)
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
                db.collection("volunteering").doc(this.e_id).set(this.form, {merge: true})
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
                db.collection("volunteering").add(this.form)
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
                db.collection('volunteering').doc(this.e_id)
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
                        this.form.id = doc.id
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
