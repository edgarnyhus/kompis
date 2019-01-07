<template>
    <div class="container">
        <b-card style="border: none; masrgin: 0; padding: 0">
            <md-button v-if="mode=='list'" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0)" @click="form.email=null; mode='new'"><md-icon>share</md-icon></md-button>
        </b-card>
        <h2 style="margin-top: 0 margin-bottom: 0.7em">Deling</h2>
        <div v-if="mode=='list'">

            <h4 v-if="invitations[0]" style="margin-top: 0.7em; margin-bottom: 0.7em">Mine invitasjoner</h4>
            <b-card-group v-for="item in invitations" :key="item.id">
                <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" role="tab">
                        <b-link class="link-prop" href="#" @click="go(item)"><h5>{{ item.slug }}</h5></b-link>
                        <p class="b-card-text" style="font-style: normal">Invitasjon sendt {{item.timestamp | formatDateAndTime}}</p>
                    </b-card-header>
                </b-card>
            </b-card-group>

            <div class="g-group"></div>

            <h4 v-if="shares[0]" style="margin-top: 0.7em; margin-bottom: 0.7em">Mine delinger</h4>
            <b-card-group v-for="item in shares" :key="item.id">
                <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" role="tab">
                        <h5 class="">{{ item.invitee }}</h5>
                        <span><i class="material-icons md-light md-mini float float-right g-icon" style="color: #767676" @click="remove(item)">delete</i></span>
                        <p class="b-card-text" style="font-style: normal">Invitasjon sendt {{item.timestamp | formatDateAndTime}}</p>
                    </b-card-header>
                </b-card>
            </b-card-group>
        </div>
            
        <div v-else>
            <h4 style="margin-top: 0.7em; margin-bottom: 0.7em">Del dine data med andre. Send ny invitasjon.</h4>
            <b-form  @submit.prevent="add">
                <b-form-group id="group1"
                                label="Email adresse:"
                                label-for="email"
                                description=".">
                    <b-form-input id="email"
                                type="email"
                                v-model="form.email"
                                required
                                placeholder="Skriv inn email-adressen til mottaker">
                    </b-form-input>
                </b-form-group>
            </b-form>

            <b-button class="g-span" type="submit" @click="send()" variant="info">Send</b-button>
            <b-link @click="mode='list'" href="#" class="gb-link"><strong>Avbyt</strong></b-link>
        </div>

        <!--ENJDING-->
        <div v-if="isSending">
            <div style="margin-top: 1.5em">
                <b-progress :value="100" variant="info" striped :animated="animated" class="mb-2"></b-progress>
            </div>
        </div>

        <div class="g-bottom"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
// import nodemailer from 'nodemailer'
// import postmarkTransport from 'nodemailer-postmark-transport'

const APP_NAME = 'KOMPIS';

export default {
    name: 'ShareList',
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    // props: ['uid', 'mode'],
    data () {
        return {
            mode: 'list',
            invitations: [],
            shares: [],
            profile: null,
            form: {
                slug: null,
                email: null
            },
            user: null,
            progress: 20,
            animated: true,
            isSending: false
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        send() {
            this.form.timestamp = Date.now()

            const ref = db.collection('shares').where('slug', '==', this.form.slug)
            .where('invitee', '==', this.form.email)
            return ref.get()
            .then(snapshot => {
                if (snapshot.empty) {
                    // return admin.firestore().collection('shares').add({ slug: dats.slug, invitee: data.email, timestamp: Date.now() })
                    return db.collection('shares').add({ slug: this.form.slug, invitee: this.form.email, timestamp: this.form.timestamp })
                    .then((doc) => {
                        // Sends a email to the given user.
                        this.isSending = true
                        let inviteUser = firebase.functions().httpsCallable('inviteUser')
                        inviteUser(this.form)
                        .then((result) => {
                            console.log('inviteUser', result)
                            if (result.data.status === 'success' || result.data.status === 'ok') {
                                //
                            } else {
                                alert('Sending av email feilet. Vær vennlig å gi den du inviterer bsekjed på annen måte.')
                            }
                            this.isSending = false
                            this.mode = 'list'
                        })
                        .catch((error) => {
                            console.error('inviteUser failed', error)
                            alert('Sending av email feilet. Vær vennlig å gi den du inviterer bsekjed på annen måte.')
                            this.isSending = false
                            this.mode = 'list'
                        })
                    })
                    .catch((error) => {
                        alert('Deling feilet. Problemer med å aksessere databasen. ' + error)
                        this.mode = 'list'
                    })
                }
            })
            .catch((error) => {
                // throw new functions.https.HttpsError('failed to connect to database,' + error)
                alert(error)
            })
        },
        remove(item) {
            if (item.id) {
                db.collection('shares').doc(item.id)
                .delete()
                .then(() => {
                    // console.log('share deleted', item.id)
                })
                .catch(error=> {
                    console.log('deleting share failed', error)
                })
            }
        },
        go(item) {
            let uid = null            
            db.collection('users').doc(item.slug)
            .get()
            .then(doc => {
                this.$user = doc.data()
                uid = doc.data().user_id
                this.$router.push({ name: 'MyCV', params: {uid: uid } })
            })
        },
        fetchShares() {
            db.collection('shares').where('slug', '==', this.form.slug).orderBy('timestamp')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let item = change.doc.data()
                        item.id = change.doc.id
                        this.shares.unshift(item)
                    }
                    else if (change.type == 'removed') {
                        let item = change.doc.data()
                        item.id = change.doc.id
                        this.shares.shift(item)
                    }
                })
            })
        },
        fetchInvitations() {
            db.collection('shares').where('invitee', '==', this.user.email).orderBy('timestamp')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let item = change.doc.data()
                        item.id = change.doc.id
                        this.invitations.unshift(item)
                    }
                    else if (change.type == 'removed') {
                        let item = change.doc.data()
                        item.id = change.doc.id
                        this.invitations.shift(item)
                    }
                })
            })
        },
        fetchData() {
            this.user = firebase.auth().currentUser
            if (this.user) {
                db.collection('users').where('user_id', '==', this.user.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        this.form.slug = doc.id
                    })
                    this.fetchShares()
                    this.fetchInvitations()
                })
                .catch(error=> {
                    console.log('fetching user failed', error)
                })
            }
        }
    },
    mounted() {
        if (this.$route.params.mode !== undefined)
            this.mode = this.$route.params.mode
    },
    created() {
        this.$user = null
        this.fetchData()
    }
}
</script>

<style>

</style>
