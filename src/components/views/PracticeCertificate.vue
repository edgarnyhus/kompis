<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <b-form @submit.prevent="update">
                <!-- Modal Component -->
                <b-modal id="modalPrevent" ref="modal" title="Navn på bedrift" @cancel="handleCancel"
                        @ok="handleOk" @shown="clearName">
                    <form @submit.stop.prevent="handleSubmit">
                        <b-form-input type="text"  placeholder="" v-model="employer"></b-form-input>
                    </form>
                </b-modal>

                <h1 style="margin-top: 1em; margin-bottom: 0.2em">{{ employer }}
                    <b-button class="btn-floating btn-info float-right" @click="back">Tilbake</b-button>
                </h1>
                <!-- <b-link v-b-modal.modalPrevent variant="color: info"><strong>Endre</strong></b-link> -->
                <b-link v-b-modal.modalPrevent  variant="info" class="info-color btn-mr"><strong>Endre</strong></b-link>
            </b-form>

            <div v-if="cert_id"> 
                <!-- PRAKSISSTED -->
                <work-experience-card :show="show" :uid="user_id" :cid="cert_id"></work-experience-card>

                <!-- NØKKELKOMPETANSE -->
                <key-value-card :show="show" :uid="user_id" :cid="cert_id">></key-value-card>

                <!-- PRAKTISKE FERDIGHETER -->
                <practical-skill-card :show="show" :uid="user_id" :cid="cert_id">></practical-skill-card>

                <!-- REFERANSER -->
                <reference-card :show="show" :uid="user_id" :cid="cert_id"></reference-card>

                <div style="margin-bottom: 2em"></div>
                </div>
            </div>
        <div class="g-bottom"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import SubNavbar from '@/components/layout/SubNavbar'
import WorkExperienceCard from '@/components/views/WorkExperienceCard'
import KeyValueCard from '@/components/views/KeyValueCard'
import PracticalSkillCard from '@/components/views/PracticalSkillCard'
import ReferenceCard from '@/components/views/ReferenceCard'


export default {
    name: 'PracticeCertificate',
    components: {
        SubNavbar,
        WorkExperienceCard,
        KeyValueCard,
        PracticalSkillCard,
        ReferenceCard
    },
    props: ['name', 'cid'],
    data () {
        return {
            employer: "Navn på bedrift",
            form: {
                employer: null,
                location: null,
                user_id: null,
                timestamp: null
            },
            oldName: null,
            user: null,
            profile: null,
            experience: [],
            keyvalues: [],
            skills: [],
            references: [],
            show: 'training',
            user_id: null,
            cert_id: null,
            id: null
        }
    },
    methods: {
        back() {
            this.$router.back()
        },
        clearName () {
            this.oldName = this.employer
            if (this.employer.startsWith('Navn på')) {
                this.employer = ''
            }
        },
        handleCancel (evt) {
            // Prevent modal from closing
            evt.preventDefault()
            this.employer = this.oldName
            this.handleSubmit()
        },
        handleOk (evt) {
            // Prevent modal from closing
            evt.preventDefault()
            if (!this.employer) {
                this.employer = this.oldName
                // alert('Vær vennlig å oppgi navnet på bedriften')
            } else {
                this.handleSubmit()
            }
        },
        handleSubmit () {
            console.log('pc handleSumit, cert_id=',  this.cert_id)
            this.$refs.modal.hide()
            this.user = firebase.auth().currentUser
            if (this.user) {
                this.form.employer = this.employer
                this.form.user_id = this.user.uid
                this.form.timestamp = Date.now()
                if (this.cert_id) {
                    db.collection("certs").doc(this.cert_id).set(this.form, {merge: true})
                    .then((docRef) => {
                        console.log("Document written/updated with ID: ", this.cert_id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("certs").add(this.form)
                    .then((doc) => {
                        console.log("Document written with ID: ", doc.id);
                        this.cert_id = doc.id
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            }
            else {
                console.log('User not logged in???')
            }
        },
        fetchCertificate() {
            if (this.cert_id) {
                db.collection('certs').doc(this.cert_id)
                .get()
                .then(doc => {
                    console.log('fetchCertificate ok,', doc.data() )
                    this.form = doc.data()
                    this.employer = this.form.employer
                })
                .catch(err => {
                    console.log('Fetching certificate failed', err)
                })
            }
        },
    },
    created() {
        // current user
        this.user = firebase.auth().currentUser
        this.user_id = this.user.uid
        this.cert_id = this.$route.params.cid
        this.show = this.$route.params.show
        // if (this.cid != undefined) {
        //     this.cert_id = this.cid
        // if (this.uid != undefined) {
        //     this.user_id = this.uid
        // } else if (this.user) {
        //     this.user_id = this.user.uid
        // }
        console.log('created cert', this.user_id, this.cert_id)
        if (this.user_id) {
            db.collection('users').doc(this.user_id)
            .get()
            .then(doc => {
                this.profile = doc.data()
            })
            .catch(error => {
                console.error('Firebase error: ', error)
                alert(error)
            })
            if (this.cert_id) {
                this.fetchCertificate()
            } else {
                this.$refs.inputEmployer.show()
            }
        }
    }
}
</script>

<style scoped>
 .g-group {
    margin-bottom: 1em;
}
.g-bottom {
    margin-bottom: em;
}
.btn-outline-secondary {
    border-color: grey;
}
</style>
