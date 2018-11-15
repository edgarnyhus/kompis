<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <b-form @submit.prevent="update">
                <h1 style="margin-top: 1em; margin-bottom: 0.2em">{{ employer }}
                    <b-button class="btn-floating btn-info float-right" @click="back">Tilbake</b-button>
                </h1>
                <!-- <b-link v-b-modal.modalPrevent variant="color: info"><strong>Endre</strong></b-link> -->
                <b-link v-b-modal.modalPrevent  variant="info" class="info-color btn-mr"><strong>Endre</strong></b-link>
                <b-link class="info-color btn-mr" router-link :to="{ name: 'ShowPracticeCertificate', params: { cid: cert_id  } }"><strong>Vis</strong></b-link>

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
                            <b-button class="btn-floating btn-secondary float-right" v-show="training.length == 0"  @click="selectedComponent = 'WorkExperience'">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvor har du vært i praksis?</p>
                    </b-card-header>

                    <b-collapse id="accordion1" v-if="selectedComponent == 'WorkExperience'" accordion="my-accordion" role="tabpanel">
                        <component v-on:updtraining="onUpdatedTraining" :inline="true" :show="show" :employer="employer" :cid="cert_id" :id="id" :is="selectedComponent"></component>
                    </b-collapse>

                    <b-collapse id="accordion1" v-else accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each job experiences/experience -->
                        <b-card-group v-for="elem in training"  :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h6 class="card-title">{{ elem.employer }}
                                        <b-link class="btn-floating float-right btn-sm info-color" @click="updateTraining(elem)">Endre</b-link>
                                        <b-link class="button-span btn-floating float-right btn-sm info-color" @click="removeTraining(elem)">Slett</b-link>
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
                            <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'KeyValue'">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper er bekreftet gjennom arbeidet på dette praksisstedet?</p>
                    </b-card-header>

                    <b-collapse id="accordion3" v-if="selectedComponent == 'KeyValue'" accordion="my-accordion" role="tabpanel">
                        <component v-on:updkey="onUpdatedKeyValue" :cid="cert_id" :id="id" :is="selectedComponent"></component>
                    </b-collapse>

                    <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each key values -->
                        <b-card-group v-for="elem in keyvalues" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-subtitle text-muted">{{ elem.keyvalue }}
                                        <b-link class="btn-floating float-right btn-sm info-color" @click="updateKeyValue(elem)">Endre</b-link>
                                        <!-- <b-link class="btn-floating float-right btn-sm" @click="id = elem.id; selectedComponent = 'KeyValue'">Endre</b-link> -->
                                        <b-link class="button-span btn-floating float-right btn-sm info-color" @click="removeKeyValue(elem)">Slett</b-link>
                                    </h5>
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
                            <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'PracticalSkill'">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvilke praktiske feredigheter er lært eller bekreftet gjennom arbeid  ved dette parksisstedet?</p>
                    </b-card-header>

                    <b-collapse id="accordion4" v-if="selectedComponent == 'PracticalSkill'" accordion="my-accordion" role="tabpanel">
                        <component v-on:updskill="onUpdatedSkill" :show="show" :employer="employer" :cid="cert_id" :id="id" :is="selectedComponent"></component>
                    </b-collapse>

                    <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each practical skill -->
                        <b-card-group v-for="elem in skills" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-subtitle text-muted">{{ elem.skill }}
                                        <b-link class="btn-floating float-right btn-sm info-color" @click="updateSkill(elem)">Endre</b-link>
                                        <b-link class="button-span btn-floating float-right btn-sm info-color" @click="removeSkill(elem)">Slett</b-link>
                                    </h5>
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
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Reference'">Legg til emne</b-button>
                        </h5>
                        <p class="b-card-text" style="font-style: italic">Hvem er din kontaktperson ved dette praksisstedet?</p>
                    </b-card-header>

                    <b-collapse id="accordion7" v-if="selectedComponent == 'Reference'" accordion="my-accordion" role="tabpanel">
                        <component v-on:updref="onUpdatedReference" :show="show" :employer="employer" :cid="cert_id" :id="id" :is="selectedComponent"></component>
                    </b-collapse>

                    <b-collapse id="accordion7" accordion="my-accordion" role="tabpanel">
                        <!-- present a card for each reference -->
                        <b-card-group v-for="elem in references" :key="elem.id">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">{{ elem.person }}
                                        <b-link class="btn-floating float-right btn-sm info-color" @click="updateReference(elem)">Endre</b-link>
                                        <b-link class="button-span btn-floating float-right btn-sm info-color" @click="removeReference(elem)">Slett</b-link>
                                    </h5>
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
import KeyValue from '@/components/views/KeyValue'
import PracticalSkill from '@/components/views/PracticalSkill'
import Reference from '@/components/views/Reference'
import ShowPracticeCertificate from '@/components/views/ShowPracticeCertificate'


export default {
    name: 'PracticeCertificate',
    components: {
        SubNavbar,
        WorkExperience,
        KeyValue,
        PracticalSkill,
        Reference
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
            experience: [],
            keyvalues: [],
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
        back() {
            this.$router.back()
        },
        removeTraining(elem) {
            db.collection('experience').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                // this.fetchTraining()
                if (elem) {
                    let ix = this.experience.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.experience.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing praksissted: ", error);
            })
        },
        updateTraining(elem) {
            this.id = elem.id
            this.selectedComponent = 'WorkExperience'            
        },
        onUpdatedTraining(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchTraining()
            }
        },
        removeKeyValue(elem) {
            db.collection('keyvalues').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.keyvalues.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.keyvalues.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing key value: ", error);
            })
        },
        updateKeyValue(elem) {
            console.log('updateKeyValue', elem.id)
            this.id = elem.id
            this.selectedComponent = 'KeyValue'            
        },
        onUpdatedKeyValue(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            // if (id) {
                this.fetchKeyValues()
            // }
        },
        removeSkill(elem) {
            db.collection('skills').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.skills.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.skills.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing skill,", error);
            })
        },
        updateSkill(elem) {
            this.id = elem.id
            this.selectedComponent = 'PracticalSkill'            
        },
        onUpdatedSkill(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchSkills()
            }
        },
        removeReference(elem) {
            db.collection('references').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.references.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.references.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing skill,", error);
            })
        },
        updateReference(elem) {
            this.id = elem.id
            this.selectedComponent = 'Reference'            
        },
        onUpdatedReference(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchReferences()
            }
        },
        removeColl(elem) {
            console.log("pc removeColl", elem.id);
            db.collection(coll).doc(elem.id).delete()
            .then(() => {
                console.log("pc document successfully deleted!");
                if (elem) {
                    let ix = coll.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        coll.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("pc error removing key value: ", error);
            })
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
        fetchTraining() {
            if (this.user && this.cert_id) {
                this.experience.length = 0
                db.collection('experience').where('cert_id', '==',this.cert_id)
                .where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.experience.push(elem)
                    })
                })
                .catch(err => {
                    console.log('Fetching certificate failed', err)
                })
            }
        },
        fetchKeyValues() {
            if (this.user && this.cert_id) {
                db.collection('keyvalues').where('cert_id', '==',this.cert_id)
                .where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.keyvalues.push(elem)
                    })
                })
                .catch(err => {
                    console.log('Fetching certificate failed', err)
                })
            }
        },
        fetchSkills() {
            if (this.user && this.cert_id) {
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
                .catch(err => {
                    console.log('Fetching certificate failed', err)
                })
            }
        },
        fetchReferences() {
            if (this.user && this.cert_id) {
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
                .catch(err => {
                    console.log('Fetching certificate failed', err)
                })
            }
        }
    },
    updated() {
        console.log('PC updated event, ID=', this.cert_id)
    },
    activated() {
        console.log('PC activated event, ID=', this.cert_id)
    },
    mounted() {
        console.log('PC mounted event, ID=', this.cert_id)
    },
    created() {
        this.user = firebase.auth().currentUser.uid
        this.cert_id = this.cid ? this.cid : this.$route.params.cid
        console.log('PC created event, ID=', this.cert_id )

        // current user
        if (this.user) {
            db.collection('users').doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc => {
                this.profile = doc.data()
            })
            .catch(err => {
                console.log('Fetching user failed', err)
            })
        }

        // fetch this practice certificate
        this.fetchCertificate()

        // fetch work experience/training
        this.fetchTraining()

        // fetch key values
        this.fetchKeyValues()

        // fetch practical skills
        this.fetchSkills()

        // fetch references
        this.fetchReferences()

    }
}
</script>

<style scoped>
.info-color {
    color: rgb(0,161,181);
}
.btn-mr {
    margin-right: 1em;
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
.btn-outline-secondary {
    border-color: grey;
}
</style>
