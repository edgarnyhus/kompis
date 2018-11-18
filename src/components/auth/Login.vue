<template>
    <div class="login g-frame container">
        <b-card>
            <h3>Logg inn</h3>
            <b-form @submit.prevent="login">
                <b-form-group>
                    <label for="email">Email</label>
                    <b-form-input id="email" type="email" @change="feedback = ''" v-model="email"></b-form-input>
                </b-form-group>
                <b-form-group>
                    <label for="password">Password</label>
                    <b-form-input id="password" type="password" @change="feedback = ''" v-model="password"></b-form-input>
                </b-form-group>
                <div class="g-m2">
                    <b-button class="g-span" type="submit" variant="info">Logg inn</b-button>
                    <b-link @click="signup()" style="color: rgb(0,161,181)"><strong>Registrer deg</strong></b-link>
                </div>
            </b-form>

            <p v-if="feedback" style="margin-top: 1.5em; color: red">{{ feedback }}</p>
        </b-card>
    </div>
</template>

<script>
import db from '@/firebase/init'
// import slugify from 'slugify'
import firebase from 'firebase'

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            feedback: '',
            show: true
        }
    },
    methods: {
        reset() {
            console.log('reset..')
            this.feedback = null
        },
        login(){
            if (this.email && this.password) {
                this.feedback = null
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    //console.log(user)
                    this.$router.push({ name: 'MyCV' })
                }).catch(error=> {
                    this.feedback = err.message
                })
            } else {
                this.feedback = 'Vær vennlig og fyll ut begge feltene'
            }
        },
        signup() {
            this.$router.push({ name: 'Signup' })
        }
    }

}
</script>

<style>
b-card {
    border-color: rgb(0,160,161);
}
.g-frame {
    margin-top: 2em;
    /* width: 20%; */
    min-width: 400px;
    max-width: 480px;
    height: 480px;
    border-color: rgb(0,160,161);
    align-self: center; 
}
.g-m2 {
    margin-top: 1.5em;
}
.g-span {
    margin-right: 1em;
}
</style>
