<template>
    <div class="container">
        <div>
            <h4 class="page-title">Praktisk ferdighet</h4>
            <p style="font-style: italic">Hva er dine praktiske evner? Noe du har lært på skole eller i jobb?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <b-dropdown id="skill" text="Ferdighet" class="mr-sm-2 mb-sm-0">
                            <!-- <b-dropdown-item v-model="form.skill">Varepåfylling</b-dropdown-item>
                            <b-dropdown-item v-model="form.skill">Murerarbeid</b-dropdown-item> -->

                            <b-dropdown-item-button @click="setSkill('Varepåfylling')">Varepåfylling</b-dropdown-item-button>
                            <b-dropdown-item-button @click="setSkill('Murerarbeid')">Murerarbeid</b-dropdown-item-button>
                        </b-dropdown>
                    </div>
                    <input type="text" class="form-control" placeholder="Praktisk ferdighet (f.eks.Varepåfylling eller Murerarbeid)" v-model="form.skill" required>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder="Hvordan kommer denne ferdigheten til uttrykk?"
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
    name: 'PracticalSkill',
    data() {
        return {
            skills: [
                { value: null, text: 'Velg en praktisk ferdighet' },
                { value: 'Varepåfylling', text: 'Varepåfylling' },
                { value: 'Murerarbreid', text: 'Murerarbreid' }
            ],
            form: {
                skill: null,
                level: null,
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
        setSkill(value) {
            this.form.skill = value
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
                    db.collection('skills').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            conssole.log('Work experience updated')
                        })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                } else {
                    // db.collection('experiences').add(
                    db.collection('skills').add(
                        this.form)
                        .then (doc => {
                            conssole.log('Work experience added')
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
            ref = db.collection('skills').doc(this.$route.params.id)
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
</style>
