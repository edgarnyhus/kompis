<template>
    <div class="container">
        <div>
            <h4 class="g-title">Språk</h4>
            <p style="font-style: italic">Hvilke språk kan du snakke?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <label for="school"><strong>Språk</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="employer" type="text" v-model="form.language" required />
            </b-form-group>

            <b-form-group>
                <label for="place"><strong>Hvor godt snakker du språket?</strong></label>
                <b-form-select id="fromMonth" class="mb-3" :options="proficiency" v-model="form.proficiency" required />
            </b-form-group>

            <b-form-group class="g-group">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder=""
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <b-form-group>
                <p><strong>Dokumentasjon</strong></p>
                <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
                <div class="button-group">
                    <b-button class="button-span" variant="leight">Last opp</b-button>
                    <b-button variant="leight">Lenke</b-button>
                </div>
            </b-form-group>

            <div class="button-group">
                <b-button class="button-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="foreground-color: rgb(0,161,181)"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>

    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Education',
    data() {
        return {
            proficiency: [
                { value: null, text: 'Velg ferdighetsnivå' },
                { value: 'Elemetær', text: 'Elemetær' },
                { value: 'Begrenset', text: 'Begrenset' },
                { value: 'Profesjonelt', text: 'Profesjonelt' },
                { value: 'Innfødt og tospråklig', text: 'Innfødt og tospråklig' }
            ],
            form: {
                language: null,
                proficiency: null,
                description: null,
                userId: null,
                certId: null,
                timestamp: null
            },
            user: null
        }

    },
    components: {

    },
    methods: {
        cancel() {
            console.log("cancel")
            this.$router.go(-1)
        },
        update() {
            if (this.user) {
                this.form.userId = this.user.uid 
                this.form.certId = this.$route.params.id
                this.form.timestamp = Date.now()
                if (this.$route.params.id) {

                    db.collection('languages').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        conssole.log('Language updated')
                    })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                } else {
                    db.collection('languages').add(this.form)
                    .then (doc => {
                        conssole.log('Language added')
                     })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
            this.$router.go(-1)
        }
    },
    mounted() {
        this.user = firebase.auth().currentUser
        if (this.user && this.$route.params.id) {
            // get object
            ref = db.collection('languages').doc(this.$route.params.id)
            ref.get()
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
.g-title {
    margin-top: 2em;
    margin-bottom: 0em;
}
a {
    color: rgb(0,161,181);
}
b-button {
    margin-right: 2em;
}
.button-group {
    margin-top: 1.5em;
    margin-bottom: 2em;
}
.button-span {
    margin-right: 1em;
}
</style>
