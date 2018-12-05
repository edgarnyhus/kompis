<template>
    <div class="container">
        <div>
            <h4 style="margin-top: 2em; margin-bottom: 1em">Din Profil</h4>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="firstname"><strong>Fornavn</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="irstname" type="text" v-model="profile.firstname" required />
                    </div>
                    <div class="col">
                        <label for="surname"><strong>Etternavn</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="surname" placeholder="" v-model="profile.surname" required/>
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="address"><strong>Gateadresse</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="address" type="text" v-model="profile.address" />
            </b-form-group>

            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="postalcode"><strong>Postnummer</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="postalcode" type="text" v-model="profile.postal_code" />
                    </div>
                    <div class="col">
                        <label for="city"><strong>By</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="city" placeholder="" v-model="profile.city" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="mobile"><strong>Mobilnummer</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="mobile" type="text" v-model="profile.mobile" />
                    </div>
                    <div class="col">
                        <!-- <label for="email"><strong>Email</strong></label> -->
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="email" invisible placeholder="" v-model="email" />
                    </div>
                </div>
            </b-form-group>

            <div style="margin-top: 2em">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" class="gb-link" variant="info"><strong>Avbyt</strong></b-link>
            </div>
        </b-form>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {

    props: ['uid', 'cid', 'id'],
    data() {
        return {
            profile: {
                alias: null,
                firstname: null,
                surname: null,
                address: null,
                postal_code: null,
                city: null,
                mobile: null,
                timestamp: null
            },
            email: null,
            user_id: null,
            slug: null,
            reason: 'profileUpdated'
        }
    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        destroy() {
            this.$destroy();
        },    
        cancel() {
            this.$router.back()
            this.destroy()
        },
        update() {
            if (this.slug) {
                this.profile.timestamp = Date.now()
                db.collection("users").doc(this.slug).set(this.profile, {merge: true})
                .then(() => {
                    console.log("profile updated", this.slug);
                    this.$emit(this.reason)
                })
                .catch((error) => {
                    console.error("Error updating profile", error);
                    alert(error)
                })
            }
            else {
                console.info('slug not defined???')
            }
            this.cancel()
        },
        getProfile() {
            db.collection('users').where('user_id', '==', this.user.uid)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.slug = doc.id
                    this.profile = doc.data()
                    this.email = this.user.email
                    console.log('profile', this.profile)
                })
            })
            .catch(error=> {
                console.log('fetching user profile', error)
                alert(error)
            })
        }
    },
    mounted() {
        this.user = firebase.auth().currentUser
        if (this.user) {
            this.getProfile()
        }
    }
}
</script>

<style>

</style>

