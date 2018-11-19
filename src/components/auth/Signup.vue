<template>
    <div class="signup g-frame container">
        <b-card>
            <h3>Registrer deg</h3>
            <b-form  @submit.prevent="signup">
                <b-form-group>
                    <label for="alias">Velg et brukernavn</label>
                    <b-form-input id="alias" type="text" @change="feedback = null" v-model="alias" required></b-form-input>
                </b-form-group>
                <b-form-group description="Vi vil aldri dele email adressen din med andre.">
                    <label for="email">Din email-adresse</label>
                    <b-form-input id="email" type="email"  @change="feedback = null" v-model="email" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <label for="password">Ditt passord</label>
                    <b-form-input id="password"  type="password" @change="feedback = null" v-model="password" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <label for="confirmPassword">Bekreft ditt passord</label>
                    <b-form-input id="confirmPassword" type="password" @change="feedback = null" v-model="confirmPassword" required></b-form-input>
                </b-form-group>
                <div class="g-m2">
                    <b-button class="g-span" type="submit" variant="info">Registrer</b-button>
                    <router-link :to="{ name: 'Login' }" style="color: rgb(0,161,181)"><strong>Logg inn</strong></router-link>
                </div>

                <p v-if="feedback" style="margin-top: 1.5em; color: red">{{ feedback }}</p>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import slugify from 'slugify'

export default {
    name: 'Signup',
    data() {
        return {
            alias: '',
            email: '',
            password: '',
            confirmPassword: '',
            feedback: ''
        }
    },
    methods: {
        reset() {
            this.feedback = null
        },
        signup() {
            console.log('signup...')

            if (!this.alias || !this.email || !this.password) {
                this.feedback = 'Vær vennlig og fyll ut alle feltene'
                return
            }
            if (this.password !== this.confirmPassword) {
                this.feedback = "Passordene er ikke like. Prøv igjen."
                return
            } 
            this.feedback = null
            let slug = slugify(this.alias, { replacement: '-', remove: /[$*_+~.()'"!\-:@]/g, lower: true })
            let ref = db.collection('users').doc(slug)
            ref.get()
            .then(doc => {
                if (doc.exists) {
                    this.feedback = 'Dette brukernavnet er allerede i bruk. Velg et annet.'
                } else {
                    let user = null;
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(cred => {
                        user = cred.user
                        return ref.set({
                            alias: this.alias,
                            user_id: user.uid
                        })
                    }).then(() => {
                        // db.collection("slugs").doc(user.uid).set({slug: slug})
                        // .then(() => {
                        //     console.log('signup ok')
                        //     this.$router.push({ name: 'MyCV' })
                        // })
                        console.log('signup ok')
                        this.$router.push({ name: 'MyCV' })
                    })
                    .catch(error=> {
                        this.feedback = err.message
                    })
                }
            })
            .catch(error=> {
                this.feedback = err.message
            })
        }
    }
}
</script>

<style scoped>
.g-frame {
    margin-top: 2em;
    /* width: 20%; */
    min-width: 400px;
    max-width: 480px;
    height: 480px;
    height: 480px;
    border-color: rgb(0,160,161);
}
.g-m2 {
    margin-top: 1.5em;
}
.g-span {
    margin-right: 1em;
}
</style>
