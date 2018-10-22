<template>
    <div class="container">
        <b-container class="g-frame">
            <h4 class="g-title">Registrer deg</h4>
        <b-form  @submit="signup" v-if="show">
            <b-form-group id="email"
                    label="Din email adressse"
                    label-for="email"
                    description="We'll never share your email with anyone else.">
                <b-form-input @change="reset()" id="email"
                    type="email"
                    v-model="form.email"
                    required
                    placeholder="">
                </b-form-input>
            </b-form-group>
            <b-form-group>
                <label for="password">Ditt passord</label>
                <b-form-input @change="reset()" id="password"
                    type="password"
                    v-model="form.password"
                    required
                    placeholder="">
                          
                </b-form-input>
            </b-form-group>
            <b-form-group>
                <label for="confirmPassword">Bekreft ditt passord</label>
                <b-form-input id="confirmPassword"
                            type="password"
                            v-model="form.confirmPassword"
                            required
                            placeholder="">
                </b-form-input>
            </b-form-group>
            <p v-if="feedback" style="color: red">{{ feedback }}</p>
            <b-form-group class="g-m2">
                <b-button class="g-span" type="submit" variant="info">Registrer</b-button>
                <b-link @click="login()" style="color: rgb(0,161,181)"><strong>Logg inn</strong></b-link>
            </b-form-group>

        </b-form>
        </b-container>
    </div>
</template>

<script>
import db from '@/firebase/init'
// import slugify from 'slugify'
import firebase from 'firebase'

export default {
    name: 'Signup',
    data() {
        return {
            form: {
                email: '',
                password: '',
                confirmPassword: ''
            },
            feedback: '',
            show: true
        }
    },
    methods: {
        reset() {
            console.log('reset..')
            this.feedback = null
        },
        signup (evt) {
            console.log('signup...')
            if (!this.form.email || !this.form.password) {
                this.feedback = 'Fyll ut alle feltene'
                return
            }
            if (this.form.password !== this.form.confirmPassword) {
                this.feedback = "Passordene er ikke like. Prøv igjen."
                return
            } 
            this.feedback = null
            firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
            .then(() => {
                this.$router.push({ name: 'MyCV' })
            })
            .catch(err => {
                this.feedback = err.message
            })
        },
        login() {

        }
    }

}
</script>

<style>
.g-title {
    margin-top: 1.2em;
    margin-bottom: 0.7em;
}
.g-frame {
    margin-top: 2em;
    width: 50%;
    min-width: 30px;
    height: 480px;
    border:5px solid;
    border-color: rgb(0,160,161);
}
.g-m2 {
    margin-top: 1.5em;
}
.g-span {
    margin-right: 1em;
}
</style>
