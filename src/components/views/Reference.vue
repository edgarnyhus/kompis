<template>
    <div class="component" style="margin: 1em">
        <div v-if="this.$route.params.show == 'training'">
            <h4  class="g-title">Kontaktperson</h4>
            <p style="font-style: italic">Hvem var din kontaktperson på praksisstedet?</p>
        </div>
        <div v-else>
            <h4  class="g-title">Referanse</h4>
            <p style="font-style: italic">Hvilken person kan potensielle arbeidsgivere kontakte for å bli bedre kjent med deg? Husk å be om tilatelse!</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <label for="person"><strong>Referanseperson</strong> </label>
                <b-form-input id="person" v-model="form.person" />
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description"
                                placeholder="Hva gjelder denne referansen?" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <upload-media :parent="'skill'" :uid="user_id" :cid="form.cert_id"> </upload-media>
 
            <media-list :media="media" :links="links"></media-list>

            <b-form-group>
                <p class="g-header"><strong >Bekreftelse</strong></p>
                <p >Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <div class="button-group">
                    <b-button variant="light">Spør</b-button>
                </div>
            </b-form-group>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="foreground-color: rgb(0,161,181)"><strong>Avbyt</strong></b-link>
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
    name: 'Reference',
    components: {
        FromTo,
        UploadMedia,
        MediaList
    },
    props: ['uid', 'cid', 'id'],
    data() {
        return {
            competences: [
                { value: null, text: 'Velg en nøkkelkompetanse' },
                { value: 'Punktlig', text: 'Punktlig' },
                { value: 'Tar initiativ', text: 'Tar initiativ' },
                { value: 'Loyal', text: 'Loyal' },
                { value: 'Ansvarlig', text: 'Ansvarlig' }
            ],
            form: {
                person: null,
                description: null,
                confirmation: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            media: [],
            links: [],
            user: null,
            user_id: null,
            cert_d: null,
            ref_id: null,
            reason: 'onUpdatedReference'
        }

    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        cancel() {
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_id 
                this.form.timestamp = Date.now()
                if (this.$route.params.id) {
                    db.collection('references').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        console.log('Work experience updated')
                        this.$emit(this.reason, this.ref_id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    db.collection('references').add(
                        this.form)
                    .then (doc => {
                        console.log('Work experience added')
                        this.ref_id = doc.id
                        this.$emit(this.reason, this.ref_id)
                     })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
        }
    },
    mounted() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.cert_id  = this.cid
        this.ref_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        // this.fetchData()
        if (this.ref_id) {
            // get object
            db.collection('references').doc(this.ref_id)
            .get()
            .then (doc => {
                if(doc.exists) {
                    this.form = doc.data()
                }
            })
        }            
    }
}
</script>

<style>
a {
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
