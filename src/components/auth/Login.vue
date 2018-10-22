<template>
    <div class="container">
        <b-container class="g-frame">
            <h4 class="g-title">Logg inn</h4>
        <b-form  @submit="login" v-if="show">
            <b-form-group id="email"
                    label="Din email adressse"
                    label-for="email"
                    description="">
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
            <b-form-group class="g-m2">
                <b-button class="g-span" type="submit" variant="info">Logg inn</b-button>
                <b-link @click="signup()" style="color: rgb(0,161,181)"><strong>Registrer deg</strong></b-link>
            </b-form-group>

            <p v-if="feedback" style="color: red">{{ feedback }}</p>
        </b-form>
        </b-container>
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
            form: {
                email: '',
                password: ''
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
        login (evt) {
            console.log('login...')
            if(this.form.email && this.form.password){
                this.feedback = null
                firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
                .then(user => {
                //console.log(user)
                this.$router.push({ name: 'MyCV' })
                }).catch(err => {
                this.feedback = err.message
                })
            } else {
                this.feedback = 'Vær så snill å fylle inn begge feltene'
            }
        },
        signup() {
            this.$router.push({ name: 'Signup' })
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
