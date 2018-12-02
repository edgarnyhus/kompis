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
                <b-form-group>
                    <!-- <b-form-checkbox id="accept" v-model="accepted" value="accepted" unchecked-value="not_accepted" variant="info">
                    Jeg godtar betingelsene
                    </b-form-checkbox> -->
                    <div class="pretty">
                        <input type="checkbox" id="accept" name="accept">
                        <div class="pretty-inner"><label for="accept">Jeg godtar betingelsene</label></div>
                    </div>
                </b-form-group>
                <b-form-group class="g-m2">
                    <b-button class="g-span" type="submit" variant="info">Registrer</b-button>
                </b-form-group>
                <p style="margin-top: 1.5em">
                    Hvis du allerede har en konto, kan du 
                    <router-link :to="{ name: 'Login' }" style="font-size: 14px; color: rgb(0,161,181)"><strong>logge inn</strong></router-link>
                    ved å bruke din email adresse og passord.
                </p>

                <p v-if="feedback" style="margin-top: 1.5em; color: red">{{ feedback }}</p>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'
import slugify from 'slugify'

export default {
    name: 'Signup',
    data() {
        return {
            alias: '',
            email: '',
            password: '',
            confirmPassword: '',
            accepted: 'not_accepted',
            options: ['Godtar'],
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

            // checkAlias(slug)
            // .then(result =>{
            //     if (!result.unique) {
            //         this.feedback = "Brukernavnet er opptatt! Velg et annet."
            //     } else {
            //         let user = null;
            //         firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            //         .then(cred => {
            //             user = cred.user
            //             db.collection('users').doc(slug).set({
            //                 alias: this.alias,
            //                 user_id: user.uid
            //             })
            //             }).then(() => {
            //                 console.log('signup ok')
            //                 this.$router.push({ name: 'MyCV' })
            //             })
            //         .catch(error=> {
            //             this.feedback = error.message
            //         })
            //     }
            // }, error => {
            //     this.feedback = error
            // })
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
.g-check {
    color: rgb(0,160,161);
}


.pretty {
  position: relative;
  /* margin: 1em; */
  margin-top: 1em;
}
.pretty input {
  position: absolute;
  left: 0;
  top: 0;
  min-width: 1em;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
.pretty-inner {
  box-sizing: border-box;
  position: relative;
}
.pretty-inner label {
  position: initial;
  display: inline-block;
  font-weight: 400;
  margin: 0;
  text-indent: 1.5em;
  min-width: calc(1em + 2px);
}
.pretty-inner label:after,
.pretty-inner label:before {
  content: '';
  width: calc(1em + 2px);
  height: calc(1em + 2px);
  display: block;
  box-sizing: border-box;
  border-radius: 0;
  border: 1px solid transparent;
  z-index: 0;
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
}
.pretty-inner label:before {
  border-color: #bdc3c7;
}
.pretty input:checked~.pretty-inner label:after {
  background-color: rgb(0,160,161);
  width: calc(1em - 6px);
  height: calc(1em - 6px);
  top: 4px;
  left: 4px;
}

/* Add checkmark character style */
.pretty input:checked~.pretty-inner.checkmark:after {
  content: '\2713';
  color: #fff;
  position: absolute;
  font-size: 0.65em;
  left: 6px;
  top: 3px;
}

/* body {
  font-size: 20px;
  font-family: sans-serif;
} */
</style>
