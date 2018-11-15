<template>
    <div class="component" style="margin: 1em">
        <div>
            <h4 class="g-title">Språk</h4>
            <p style="font-style: italic">Hvilke språk kan du snakke?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <label for="school"><strong>Språk</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="employer" type="text" v-model="form.language" required />
            </b-form-group>

            <b-form-group class="g-header">
                <label for="place"><strong>Hvor godt snakker du språket?</strong></label>
                <b-form-select id="fromMonth" class="mb-3" :options="proficiency" v-model="form.proficiency" required />
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" 
                    placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <upload-media :parent="'edu'" :uid="user_id" :cid="form.cert_id"> </upload-media>
 
            <media-list :media="media" :links="links"></media-list>

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
import MediaList from '@/components/common/MediaList'

export default {
    name: 'Education',
    components: {
        UploadMedia,
        MediaList
    },
    props: ['cid', 'id'],
    data() {
        return {
            proficiency: [
                { value: null, text: 'Velg ferdighetsnivå' },
                { value: 'Begrenset', text: 'Begrenset' },
                { value: 'Profesjonelt', text: 'Profesjonelt' },
                { value: 'Innfødt og tospråklig', text: 'Innfødt og tospråklig' }
            ],
            form: {
                language: null,
                proficiency: null,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            media: [],
            links: [],
            user: null,
            user_id: null,
            cert_id: null,
            l_id: null,
            reason: 'onUpdatedLanguage'
        }

    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        cancel() {
            console.log("cancel")
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_id 
                this.form.timestamp = Date.now()
                if (this.l_id) {
                    db.collection('languages').doc(this.l_id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        console.log('Language updated')
                        this.$emit(this.reason, this.l_id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    db.collection('languages').add(this.form)
                    .then (doc => {
                        console.log('Language added')
                        this.l_id = doc.id
                        this.$emit(this.reason, this.l_id)
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
    created() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.cert_id  = this.cid
        this.l_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        // this.fetchData()
        if (this.l_id) {
            // get object
            db.collection('languages').doc(this.l_id)
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
