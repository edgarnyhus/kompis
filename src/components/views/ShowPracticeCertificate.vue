<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <b-form @submit.prevent="update">
                <h1 style="margin-top: 2em; margin-bottom: 0.2em">{{ employer }}
                    <b-button class="btn-floating btn-info float-right" router-link :to="{ name: 'PracticeCertificateView' }">Tilbake</b-button>
                </h1>
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

            <div style="margin-bottom: 2em"></div>
            <b-card class="shadow-none text-muted" title="Arbeidserfaring">
                <!-- present a card for each job experiences/experience -->
                <div v-for="elem in experience"  :key="elem.id">
                    <!-- <div class="card"> -->
                        <div class="card-body">
                            <h6 class="card-title">{{ elem.employer }}
                                <b-link class="info-color btn-floating float-right btn-sm info-color" @click="updateTraining(elem)">Endre</b-link>
                            </h6>
                            <h5 class="card-subtitle text-muted">{{elem.role}}</h5>
                            <!-- <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from.month}} {{elem.from.year}} - {{ elem.to.month }} {{elem.to.year}}<br> -->
                            <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}<br>
                                {{elem.place}}</P>
                            <p class="card-text">{{elem.description}}</p>
                        </div>
                    <!-- </div> -->
                </div>
            </b-card>

            <b-card class="shadow-none text-muted" title="Nøkkelkompetanse">
                <!-- present a card for each job experiences/experience -->
                <div v-for="elem in keyvalues"  :key="elem.id">
                    <div class="card-body">
                        <h5 class="card-subtitle text-muted">{{ elem.keyvalue }}
                            <b-link class="info-color btn-floating float-right btn-sm info-color" @click="updateKeyValue(elem)">Endre</b-link>
                            <!-- <b-link class="btn-floating float-right btn-sm" @click="id = elem.id; selectedComponent = 'KeyValue'">Endre</b-link> -->
                            <b-link class="info-color button-span btn-floating float-right btn-sm info-color" @click="removeKeyValue(elem)">Slett</b-link>
                        </h5>
                        <p class="card-text">{{elem.description}}</p>
                    </div>
                </div>
            </b-card>

            <b-card class="shadow-none text-muted" title="Praktiske ferdigheter">
                <!-- present a card for each job experiences/experience -->
                <div v-for="elem in skills" :key="elem.id">
                    <div class="card-body">
                        <h5 class="card-subtitle text-muted">{{ elem.skill }}
                            <b-link class="info-color btn-floating float-right btn-sm info-color" @click="updateSkill(elem)">Endre</b-link>
                            <b-link class="info-color button-span btn-floating float-right btn-sm info-color" @click="removeSkill(elem)">Slett</b-link>
                        </h5>
                        <p class="card-text">{{elem.description}}</p>
                    </div>
                </div>
            </b-card>

            <b-card class="shadow-none text-muted" title="Kontaktperson">
                <!-- present a card for each job experiences/experience -->
                <div v-for="elem in references"  :key="elem.id">
                    <div class="card-body">
                        <h5 class="card-subtitle text-muted">{{ elem.person }}
                            <b-link class="info-color btn-floating float-right btn-sm info-color" @click="updateSkill(elem)">Endre</b-link>
                            <b-link class="info-color button-span btn-floating float-right btn-sm info-color" @click="removeSkill(elem)">Slett</b-link>
                        </h5>
                        <p class="card-text">{{elem.description}}</p>
                    </div>
                </div>
            </b-card>

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


export default {
    name: 'ShowPracticeCertificate',
    components: {
        SubNavbar,
        WorkExperience,
        KeyValue,
        PracticalSkill,
        Reference
    },
    props: ['name', 'uid', 'cid'],
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
            experience: [],
            keyvalues: [],
            skills: [],
            references: [],
            selectedComponent: null,
            show: 'training',
            user_id: null,
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
        },
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        back() {
            this.$router.push({name: 'PracticeCertificateView'})
        },
        removeTraining(elem) {
            db.collection('experience').doc(elem.id).delete()
            .then(() => {
                // console.log("PC Document successfully deleted!");
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
                // console.log("PC Document successfully deleted!");
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
            // console.log('updateKeyValue', elem.id)
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
                // console.log("PC Document successfully deleted!");
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
                // console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.references.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.skills.splice(ix, 1)
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
            // console.log("PC removeColl", elem.id);
            db.collection(coll).doc(elem.id).delete()
            .then(() => {
                // console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = coll.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        coll.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing key value: ", error);
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
            // console.log('PC handleSumit, cert_id=',  this.cert_id)
            this.$refs.modal.hide()
            // this.user = firebase.auth().currentUser
            if (this.cert_id) {
                this.form.employer = this.employer
                this.form.user_id = this.user_id
                this.form.timestamp = Date.now()
                if (this.cert_id) {
                    db.collection("certs").doc(this.cert_id).set(this.form, {merge: true})
                    .then((doc) => {
                        // console.log("Document written/updated with ID: ", this.cert_id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("certs").add(this.form)
                    .then((doc) => {
                        // console.log("Document written with ID: ", doc.id);
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
                    // console.log('fetchCertificate ok,', doc.data() )
                    this.form = doc.data()
                    this.employer = this.form.employer
                })
                .catch(error => {
                    console.error('Fetching certificate failed', error)
                })
            }
        },
        fetchTraining() {
            if (this.user_id && this.cert_id) {
                this.experience = []
                db.collection('experience').where('cert_id', '==', this.cert_id)
                .where('user_id', '==', this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.experience.push(elem)
                    })
                })
                .catch(error => {
                    console.error('Fetching certificate failed', error)
                })
            }
        },
        fetchKeyValues() {
            if (this.user_id && this.cert_id) {
                db.collection('keyvalues').where('cert_id', '==', this.cert_id)
                .where('user_id', '==', this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.keyvalues.push(elem)
                    })
                })
                .catch(error => {
                    console.error('Fetching certificate failed', error)
                })
            }
        },
        fetchSkills() {
            if (this.user_id && this.cert_id) {
                db.collection('skills').where('cert_id', '==', this.cert_id)
                .where('user_id', '==', this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.skills.push(elem)
                    })
                })
                .catch(error => {
                    console.error('Fetching certificate failed', error)
                })
            }
        },
        fetchReferences() {
            if (this.user_id && this.cert_id) {
                db.collection('references').where('cert_id', '==', this.cert_id)
                .where('user_id', '==', this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.references.push(elem)
                    })
                })
                .catch(error => {
                    console.error('Fetching certificate failed', error)
                })
            }
        }
    },
    created() {
        this.cert_id = this.$route.params.cid
        this.user_id = this.$route.params.uid
        if (!this.user_id) {
            this.user_id = firebase.auth().currentUser.uid
        }
        // console.log('show certificate', this.user_id, this.cert_id)

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

</style>
