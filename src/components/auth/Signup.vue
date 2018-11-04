<template>
    <div class="login g-frame container">
        <b-card class="g-border">
            <h4 class="g-title">Registrer deg</h4>
            <b-form  @submit="signup">
                <b-form-group description="Vi vil aldri dele email adressen din med andre.">
                    <b-form-input id="email" type="email" v-model="form.email" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <label for="password">Ditt passord</label>
                    <b-form-input id="password"  type="password" v-model="form.password" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <label for="confirmPassword">Bekreft ditt passord</label>
                    <b-form-input id="confirmPassword" type="password" v-model="form.confirmPassword" required></b-form-input>
                </b-form-group>
                <div class="g-m2">
                    <b-button class="g-span" type="submit" variant="info">Registrer</b-button>
                    <b-link @click="login()" style="color: rgb(0,161,181)"><strong>Logg inn</strong></b-link>
                </div>

                <p v-if="feedback" style="margin/top> 1.5em color: red">{{ feedback }}</p>
            </b-form>
        </b-card>
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
            .then((user) => {
                this.$router.push({ name: 'MyCV' })
            })
            .catch(err => {
                this.feedback = err.message
            })
        },
        login() {
            this.$router.push({ name: 'Login' })
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
    border-color: rgb(0,160,161);
}
.g-m2 {
    margin-top: 1.5em;
}
.g-span {
    margin-right: 1em;
}
</style>
