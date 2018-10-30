<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <b-form @submit.prevent="update">
                <h1 style="margin-top: 2em; margin-bottom: 0.2em">{{ employer }}</h1>
                <!-- <b-link v-b-modal.modalPrevent variant="color: info"><strong>Endre</strong></b-link> -->
                <b-link v-b-modal.modalPrevent  variant="info" class="info-color"><strong>Endre</strong></b-link>

                <!-- Modal Component -->
                <b-modal id="modalPrevent"
                        ref="modal"
                        title="Navn på bedrift"
                        @cancel="handleCancel"
                        @ok="handleOk"
                        @shown="clearName">
                <form @submit.stop.prevent="handleSubmit">
                    <b-form-input type="text"
                                placeholder=""
                                v-model="employer"></b-form-input>
                </form>
                </b-modal>
            </b-form>

            <!-- <b-progress class="mb-3" height="2em" :value="bar.value" variant="info" :max="max" show-progress></b-progress> -->

            <fieldset :disabled="isDisabled">
                <div style="margin-bottom: 2em"></div>
                <b-card no-body class="accordion mb-1">
                    <b-card-header header-tag="header" v-b-toggle.accordion1 role="tab">
                        <h5 class="b-card-title">Praksisted
                            <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'WorkExperience'">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvor har du vært i praksis?</p>
                    </b-card-header>

                    <b-collapse id="accordion1" v-if="selectedComponent" :visible="false" accordion="my-accordion" role="tabpanel">
                        <component v-on:finished="onFinishedChild" :show="show" :employer="employer" :cid="cert_id" :id="id" :is="selectedComponent"></component>
                    </b-collapse>

                    <b-collapse id="accordion1" v-else :visible="false" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each job experiences/experience -->
                        <b-card-group v-for="elem in training" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">{{ elem.employer }}
                                        <!-- <md-button class="md-fab md-mini md-primary float-right" >
                                            <menu-icon>edit</menu-icon>
                                        </md-button>
                                        <md-button class="md-fab md-mini md-primary float-right" >
                                            <menu-icon>delete</menu-icon>
                                        </md-button> -->
                                    </h6>
                                    <h5 class="card-subtitle text-muted">{{elem.role}}</h5>
                                    <!-- <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from.month}} {{elem.from.year}} - {{ elem.to.month }} {{elem.to.year}}<br> -->
                                    <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}<br>
                                        {{elem.place}}</P>
                                    <p class="card-text">{{elem.description}}</p>
                                </div>
                            </div>
                        </b-card-group>
                    </b-collapse>
                </b-card>
            </fieldset>

            <fieldset :disabled="isDisabled">
                <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" v-b-toggle.accordion3 role="tab">
                        <h5 class="b-card-title">Nøkkelkompetanse
                        <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'KeyValue', params: { show: 'experiences', id: this.id } }">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper er bekreftet gjennom arbeidet på dette praksisstedet?</p>
                    </b-card-header>
                    <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each key values -->
                        <b-card-group v-for="elem in key_values" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-subtitle text-muted">{{ elem.key_value}}</h5>
                                    <p class="card-text">{{elem.description}}</p>
                                </div>
                            </div>
                        </b-card-group>
                    </b-collapse>
                </b-card>
            </fieldset>

            <fieldset :disabled="isDisabled">
                <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" v-b-toggle.accordion4 role="tab">
                        <h5 class="b-card-title">Praktiske ferdigheter
                        <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'PracticalSkill', params: { show: 'experiences', id: this.id } }">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvilke praktiske feredigheter er lært eller bekreftet gjennom arbeid  ved dette parksisstedet?</p>
                    </b-card-header>
                    <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each practical skill -->
                        <b-card-group v-for="elem in skills" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-subtitle text-muted">{{ elem.skill }}</h5>
                                    <p class="card-text">{{elem.description}}</p>
                                </div>
                            </div>
                        </b-card-group>
                    </b-collapse>
                </b-card>
            </fieldset>

            <fieldset :disabled="isDisabled">
                <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" v-b-toggle.accordion7 role="tab">
                        <h5 class="b-card-title">Kontaktperson
                        <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'Reference', params: { show: 'experiences', id: this.id } }">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvem er din kontaktperson ved dette praksisstedet?</p>
                    </b-card-header>
                    <b-collapse id="accordion7" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each reference -->
                        <b-card-group v-for="elem in references" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">{{ elem.person }}</h5>
                                    <h6 class="card-subtitle text-muted">{{ elem.about }}</h6>
                                    <p class="card-text">{{elem.description}}</p>
                                </div>
                            </div>
                        </b-card-group>
                    </b-collapse>
                </b-card>
            </fieldset>
        </div>
        <div class="g-bottom"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import SubNavbar from '@/components/layout/SubNavbar'
import WorkExperience from '@/components/views/WorkExperience'


export default {
    name: 'PracticeCertificate',
    components: {
        SubNavbar,
        WorkExperience
    },
    props: ['name', 'cid'],
    data () {
        return {
            employer: "Navn på bedrift",
            max: 100,
            bar: {
                variant: 'success', 
                value: 25
            },
            form: {
                employer: null,
                location: null,
                user_id: null,
                timestamp: null
            },
            oldName: null,
            user: null,
            profile: null,
            training: [],
            key_values: [],
            skills: [],
            references: [],
            selectedComponent: null,
            show: 'training',
            cert_id: null,
            id: null
        }
    },
    filters: {

    },
    computed: {
        isDisabled() {
            if (!this.employer || this.employer == 'Navn på bedrift') {
                return true
            }
            return false;
        }
    },
    methods: {
        onFinishedChild(value) {
            // child component (slot) signaled finished
            console.log('onFinishedChild: id=',  value)
            this.id = value
            this.selectedComponent = null
            this.fetchTraining()
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
            console.log('update: cert_id=',  this.cert_id)
            this.$refs.modal.hide()
            this.user = firebase.auth().currentUser
            if (this.user) {
                this.form.employer = this.employer
                this.form.user_id = this.user.uid
                this.form.timestamp = Date.now()
                if (this.cert_id) {
                    db.collection("certs").doc(this.cert_id).set(this.form, {merge: true})
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("certs").add(this.form)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        this.cert_id = docRef.id
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
        fetchTraining() {
            if (this.user && this.cert_id) {
                db.collection('training').where('cert_id', '==',this.cert_id)
                .where('user_id', '==',this.user.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.training.push(elem)
                    })
                })
            }
        }, 
        showPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificatView' })
        },
        addPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificate' })
        }
    },
    mounted() {
        this.cert_id = this.cid
    },
    created() {
        // current user
        db.collection('users').doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
            this.profile = doc.data()
        })

        if (this.cert_id) {
            db.collection('certs').doc(this.cert_id)
            .get()
            .then(doc => {
                this.form = doc.data()
            })
            .catch(err => {
                console.log('gFetching certificate with id = ' + this.$route.params.id + 'failed: ' + err)
            })
        }

        // fetch work experience/training
        fetchTraining()

        // fetch key values
        db.collection('key_values').where('cert_id', '==',this.cert_id)
        .where('user_id', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.key_values.push(elem)
            })
        })

        // fetch practical skills
        db.collection('skills').where('cert_id', '==',this.cert_id)
        .where('user_id', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.skills.push(elem)
            })
        })

        // fetch references
        db.collection('references').where('cert_id', '==',this.cert_id)
        .where('user_id', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.references.push(elem)
            })
        })

    }
}
</script>

<style>
.info-color {
    color: rgb(0,161,181);
}
  small {
    display: block;
  }
  .g-title {
    margin-top: 1em;
    margin-bottom: 1em;
}
.g-practice {
    margin-top: 3em;
    margin-bottom: 1em;
    background-color: rgb(242,242,242);
}
.accordion {
    margin-top: 1em;
    margin-bottom: 5em;
}
b-card-header {
  cursor: wait;
}
.g-bottom {
    margin-bottom: 2em;
}
</style>
