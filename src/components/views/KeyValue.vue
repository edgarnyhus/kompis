<template>
    <div class="container">
        <div>
            <h4 class="page-title">Nøkkelkompetanse</h4>
            <p style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <b-dropdown id="skill" text="Nøkkelkompetanse" class="mr-sm-2 mb-sm-0">
                            <b-dropdown-item-button @click="setKey('Pålitelig')">Pålitelig</b-dropdown-item-button>
                            <b-dropdown-item-button @click="setKey('Tar initiativ')">Tar initiativ</b-dropdown-item-button>
                            <b-dropdown-item-button @click="setKey('Loyal')">Loyal</b-dropdown-item-button>
                            <b-dropdown-item-button @click="setKey('Ansvarlig')">Ansvarlig</b-dropdown-item-button>
                        </b-dropdown>
                    </div>
                    <input type="text" class="form-control" placeholder="Nøkkelkompetanse (f.eks. Pålitelig eller Tar initiativ)" v-model="form.key_value" required>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder="Hvordan kommer denne nøkkelkompetansen til uttrykk?"
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

            <b-form-group>
                <p><strong>Bekreftelse</strong></p>
                <p>Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <div class="button-group">
                    <b-button variant="leight">Spør</b-button>
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
    name: 'KeyValue',
    data() {
        return {
            values: [
                { value: null, text: 'Velg en nøkkelkompetanse' },
                { value: 'Punktlig', text: 'Punktlig' },
                { value: 'Tar initiativ', text: 'Tar initiativ' },
                { value: 'Loyal', text: 'Loyal' },
                { value: 'Ansvarlig', text: 'Ansvarlig' }
            ],
            form: {
                key_value: null,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            user: null
        }
    },
    components: {

    },
    methods: {
        setKey(value) {
            this.form.key_value = value
        },
        cancel() {
            this.$router.go(-1)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user.uid 
                this.form.cert_id = this.$route.params.id
                this.form.timestamp = Date.now()
                if (this.$route.params.id) {
                    db.collection('key_values').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            conssole.log('Work experience updated')
                        })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    db.collection('key_values').add(
                        this.form)
                    .then (doc => {
                        conssole.log('Work experience added')
                     })
                    .catch(err => {
                        console.log('Firestore error: ', err)
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
            let ref = db.collection('key_values').doc(this.$route.params.id)
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
.button-group-span {
    border-radius: 25px;
    margin-right: 0.3em;
}
</style>
