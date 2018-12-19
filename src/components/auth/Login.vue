<template>
    <div class="login g-frame container">
        <b-card>
            <h3>Logg inn</h3>
            <p  class="g-group">
                Har du ikke en konto? <router-link :to="{ name: 'Signup' }" style="font-size: 14px; color: rgb(0,161,181)">Registrer deg</router-link>
            </p>
            <b-form @submit.prevent="login">
                <b-form-group>
                    <label for="email">Email</label>
                    <b-form-input id="email" type="email" @change="feedback = ''" v-model="email"></b-form-input>
                </b-form-group>
                <b-form-group>
                    <label for="password">Password</label>
                    <b-form-input id="password" type="password" @change="feedback = ''" v-model="password"></b-form-input>
                </b-form-group>
                <b-form-group class="g-sec">
                    <b-btn class="" type="submit" align="center" variant="info" block>Logg inn</b-btn>
                </b-form-group>
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
                    this.$router.push({ name: 'MyCV', params: {uid: user.uid } })
                }).catch(error=> {
                    this.feedback = error.message
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

<style scoped>
b-card {
    border-color: rgb(0,160,161);
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
</style>
