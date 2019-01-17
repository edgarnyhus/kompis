<template>
    <div class="reset g-frame container">
        <div v-if="success === false">
            <h4 class="g-title">Glemt passordet ditt?</h4>
            <p>
                Skriv inn email adressen din for å tilbakestille passordet ditt. Det kan hende du må sjekke søppelposten din eller oppheve eventuell blokkering av noreply@cvue-bf9ec.firebaseapp.com.
            </p>
            <b-form-group>
                <label for="reset">Email</label>
                <b-form-input id="reset" type="email" v-model="email" @change="feedback = ''" required></b-form-input>
            </b-form-group>
            <b-btn class="mt-4" variant="info" block @click="send">Send</b-btn>

            <p v-if="feedback" style="margin-top: 1.5em; color: red">{{ feedback }}</p>
        </div>
    
        <div v-else class="g-box" style="border: none">
            <b-alert :show="dismissCountDown" dismissible @dismissed="ok()" @dismiss-count-down="countDownChanged" variant="success">
            <h4 class="alert-heading">Email sendt!</h4>
            <p>
                Sjekk email'en din! Det kan hende du må sjekke søppelposten din eller oppheve eventuell blokkering av noreply@cvue-bf9ec.firebaseapp.com.
            </p>
            <!-- <hr> -->
            <p class="mb-0">
                
            </p>
            </b-alert>
        </div>
    </div>

</template>

<script>
import firebase from 'firebase'

export default {
    name: 'ResetPassword',
    data() {
        return {
            email: '',
            feedback: '',
            success: false,
            dismissSecs: 30,
            dismissCount: 0,
            dismissCountDown: 0
        }
    },
    methods: {
        send() {
            let actionCodeSettings = {
                //url: 'https://www.example.com/?email=user@example.com',
                handleCodeInApp: true,
            }
            console.log('reset password', this.email)
            // firebase.auth().sendPasswordResetEmail(this.email, actionCodeSettings)
            firebase.auth().sendPasswordResetEmail(this.email)
            .then(() => {
                console.log('reset password mail sent')
                this.success = true
                this.dismissCountDown = this.dismissSecs
            })
            .catch((error) => {
                this.feedback = "Operasjonen feilet. " + error
            })
        },
        ok() {
            console.log('ok')
            this.$router.push({ name: 'Login'})
        },
        countDownChanged (dismissCountDown) {
            this.dismissCount++
            if (this.dismissCount == this.dismissSecs) {
                this.$router.push({ name: 'Login'})
            }
            this.dismissCountDown = dismissCountDown
        },
    }

}
</script>

<style>
.reset {
    margin-top: 2em;
    max-width: 480px;
}
</style>
