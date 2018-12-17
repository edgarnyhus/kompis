<template>
    <div class="signup g-frame container">
        <b-card>
            <h3>Registrer deg</h3>
            <p class="g-group">
                Har du allerede en konto? <router-link :to="{ name: 'Login' }" style="font-size: 14px; color: rgb(0,161,181)">Logg inn</router-link>
            </p>
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
                    <label for="confirmPassword">Bekreft passordet</label>
                    <b-form-input id="confirmPassword" type="password" @change="feedback = null" v-model="confirmPassword" required></b-form-input>
                </b-form-group>
                <b-form-group class="g-sec">
                    <b-btn class="" variant="info" block :disabled="agreed" @click="signup()">Kom i gang!</b-btn>
                    <!-- <b-btn v-b-modal.consent class="g-span" variant="info">Registrer</b-btn> -->
                </b-form-group>
            </b-form>
            <p class="g-center">Ved å klikke her godtar du KOMPIS sine<br>
                <b-link v-b-modal.consent>Vilkår for Personvern</b-link>
            </p>
            <!-- <p-check color="info" v-model="accepted">Jeg godtar KOMPIS sine<b-link>Vilkår for Personvern</b-link></p-check> -->

            <p v-if="feedback" class="g-center" style="margin-top: 1.5em; color: red">{{ feedback }}</p>
        </b-card>

        <keep-alive>
            <b-modal id="consent" ref="agree" size="lg" hide-footer title="Vilkår for Personvern">
                <div>
                    <pdf v-for="i in numPages" :key="i" :src="src" :page="i" style="display: inline-block; width: 100%">
                        <hr>
                    </pdf>
                </div>
                <hr>
                <!-- <b-btn class="mt-3 float-right" variant="secondary" @click="agree()" style="margin-left: 1em">Jeg godtar</b-btn> -->
                <!-- <b-btn class="mt-3 float-right" variant="outline-secondary" @click="reject()">Jeg godtar ikke</b-btn> -->
            </b-modal>
        </keep-alive>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'
import slugify from 'slugify'
import pdf from 'vue-pdf'

var loadingTask = pdf.createLoadingTask('./static/Personvern_KOMPIS.pdf');

export default {
    components: {
        pdf
    },
    name: 'Signup',
    data() {
        return {
            alias: '',
            email: '',
            password: '',
            confirmPassword: '',
            src: loadingTask,
            numPages: 0,
            agreed: true,
            feedback: ''
        }
    },
    methods: {
        reset() {
            Object.assign(this.$data, this.$options.data.call(this));
            this.feedback = null
        },
        agree() {
            this.$refs.agree.show()
            this.agreed = false
        },
        reject() {
            console.log('reject')
            this.$refs.agree.hide()
            this.numPages = 2;
        },
        fieldsOk() {
            if (!this.alias || !this.email || !this.password) {
                this.feedback = 'Vær vennlig og fyll ut alle feltene'
                return false
            }
            if (this.password !== this.confirmPassword) {
                this.feedback = "Passordene er ikke like. Prøv igjen."
                return false
            } 
            return true
        },
        signup() {
            console.log('signup...')
            if (!this.fieldsOk())
                return
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
                            user_id: user.uid,
                            timestamp: Date.now()
                        })
                    }).then(() => {
                        console.log('signup ok')
                        this.$router.push({ name: 'MyCV' })
                    })
                    .catch(error => {
                        this.feedback = error.message
                    })
                }
            })
            .catch(error => {
                this.feedback = error.message
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
    },
    mounted() {
        this.loadingTask = pdf.createLoadingTask('./static/Personvern_KOMPIS.pdf')
        this.src = this.loadingTask
        this.src.then(pdf => {
            this.numPages = pdf.numPages
        })
    }
}
</script>

<style scoped>
.g-center {
    text-align: center;
}
.g-frame {
    margin-top: 2em;
    min-width: 400px;
    max-width: 480px;
    height: 480px;
    align-self: center; 
}
.g-m2 {
    margin-top: 1.5em;
}
.g-span {
    margin-left: 1em;
}
.g-check {
    color: rgb(0,160,161);
}
</style>
