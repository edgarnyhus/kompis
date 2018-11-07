<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <h1 class="g-title">Min CV</h1>
            
            <b-progress class="mb-3" height="2em" :value="bar.value" variant="info" :max="max" show-progress></b-progress>

            <b-card class="g-practice">
                <h5 class="b-card-title">Har du vært i arbeidspraksis?</h5>
                <p class="b-card-text">Lag praksisattesten først, og dataene vil dukke opp i CVen din. Usikker på hvordan du skal gjære det, ta kontakt med veileder.</p>
                <b-button  class="btn btn-info" router-link :to="{ name: 'PracticeCertificate' }">Lag ny praksisattest</b-button>
            </b-card>

            <b-card no-body class="accordion mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion1 role="tab">
                    <h5 class="b-card-title">Arbeidserfaring
                        <!-- <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'WorkExperience' }">Legg til emne</b-button> -->
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'WorkExperience'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
                </b-card-header>

                <b-collapse id="accordion1" v-if="selectedComponent == 'WorkExperience'" accordion="my-accordion" role="tabpanel">
                    <!-- <component v-on:updtraining="onUpdatedTraining" :cid="cid" :id="id" :is="selectedComponent"></component> -->
                    <work-experience v-on:updtraining="onUpdatedTraining" :cid="cid" :id="id" ></work-experience>
                </b-collapse>

                <b-collapse id="accordion1" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each job training/experience -->
                    <work-experience-list v-on:edittraining="editTraining" :training="training"></work-experience-list>
                </b-collapse>
            </b-card>
            
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion2 role="tab">
                    <h5 class="b-card-title">Utdanning og kurs
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Education'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt nen kurs på skolen, jobb eller fritid?</p>
                </b-card-header>

                <b-collapse id="accordion2" v-if="selectedComponent == 'Education'" accordion="my-accordion" role="tabpanel">
                    <component v-on:updeducation="onUpdatedEducation" :cid="cid" :id="id" :is="selectedComponent"></component>
                </b-collapse>

                <b-collapse id="accordion2" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each exam -->
                    <b-card-group v-for="elem in education" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">{{ elem.school }}
                                    <b-link class="btn-floating float-right btn-sm" @click="updateEducation(elem)">Endre</b-link>
                                    <b-link class="button-span btn-floating float-right btn-sm" @click="removeEducation(elem)">Slett</b-link>
                                </h6>
                                <h5 class="card-subtitle text-muted">{{elem.study}}</h5>
                                <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}</p>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion3 role="tab">
                    <h5 class="b-card-title">Nøkkelkompetanse
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'KeyValue'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
                </b-card-header>

                <b-collapse id="accordion3" v-if="selectedComponent == 'KeyValue'" accordion="my-accordion" role="tabpanel">
                    <component v-on:updkey="onUpdatedKeyValue" :cid="cid" :id="id" :is="selectedComponent"></component>
                </b-collapse>

                <b-collapse id="accordion3" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each ekey competence -->
                    <b-card-group v-for="elem in key_values" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-subtitle text-muted">{{ elem.key_value }}
                                    <b-link class="btn-floating float-right btn-sm" @click="updateKeyValue(elem)">Endre</b-link>
                                    <b-link class="button-span btn-floating float-right btn-sm" @click="removeKeyValue(elem)">Slett</b-link>
                                </h5>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion4 role="tab">
                    <h5 class="b-card-title">Praktiske ferdigheter
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'PracticalSkill'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hva er dine praktiske evner? Npe du har lært på skolen eller i jobb?</p>
                </b-card-header>

                <b-collapse id="accordion4" v-if="selectedComponent == 'PracticalSkill'" accordion="my-accordion" role="tabpanel">
                    <component v-on:updskill="onUpdatedSkill" :cid="cid" :id="id" :is="selectedComponent"></component>
                </b-collapse>

                <b-collapse id="accordion4" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each practical skill -->
                    <b-card-group v-for="elem in skills" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-subtitle text-muted">{{ elem.skill }}
                                    <b-link class="btn-floating float-right btn-sm" @click="updateSkill(elem)">Endre</b-link>
                                    <b-link class="button-span btn-floating float-right btn-sm" @click="removeSkill(elem)">Slett</b-link>
                                </h5>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion5 role="tab">
                    <h5 class="b-card-title">Frivillig arbeid og verv
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Volunteering'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du tatt på deg frivillig arbeid eller verv? Hva?</p>
                </b-card-header>

                <b-collapse id="accordion5" v-if="selectedComponent == 'Volunteering'" accordion="my-accordion" role="tabpanel">
                    <component v-on:updvol="onUpdatedVolunteering" :cid="cid" :id="id" :is="selectedComponent"></component>
                </b-collapse>

                <b-collapse id="accordion5" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each  -->
                    <b-card-group v-for="elem in volunteering" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">{{ elem.org }}
                                    <b-link class="btn-floating float-right btn-sm"  @click="updateVolunteering(elem)">Endre</b-link>
                                    <b-link class="button-span btn-floating float-right btn-sm" @click="removeVolunteering(elem)">Slett</b-link>
                                </h6>
                                <h5 class="card-subtitle text-muted">{{elem.role}}</h5>
                                <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}<br>
                                    {{elem.location}}</P>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion6 role="tab">
                    <h5 class="b-card-title">Språk
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Language'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke språk kan du snakke?</p>
                </b-card-header>

                <b-collapse id="accordion6" v-if="selectedComponent == 'Language'" accordion="my-accordion" role="tabpanel">
                    <component v-on:updlang="onUpdatedLanguage" :cid="cid" :id="id" :is="selectedComponent"></component>
                </b-collapse>

                <b-collapse id="accordion6" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each language -->
                    <b-card-group v-for="elem in languages" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.language }}
                                    <b-link class="btn-floating float-right btn-sm" @click="updateLanguage(elem)">Endre</b-link>
                                    <b-link class="button-span btn-floating float-right btn-sm" @click="removeLanguage(elem)">Slett</b-link>
                                </h5>
                                <h6 class="card-subtitle text-muted">{{ elem.proficiency }}</h6>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion7 role="tab">
                    <h5 class="b-card-title">Referanser
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Reference'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke personer kan potensielle arbeidsgivere kontakte for å bli kjent med deg? Husk å be om tillatelse!</p>
                </b-card-header>

                <b-collapse id="accordion7" v-if="selectedComponent == 'Reference'" accordion="my-accordion" role="tabpanel">
                    <component v-on:updref="onUpdatedReference" :cid="cid" :id="id" :is="selectedComponent"></component>
                </b-collapse>

                <b-collapse id="accordion7" v-else accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each reference -->
                    <b-card-group v-for="elem in references" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.person }}
                                    <b-link class="btn-floating float-right btn-sm" @click="updateReference(elem)">Endre</b-link>
                                    <b-link class="button-span btn-floating float-right btn-sm" @click="removeReference(elem)">Slett</b-link>
                                </h5>
                                <h6 class="card-subtitle text-muted">{{ elem.about }}</h6>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
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
import Education from '@/components/views/Education'
import KeyValue from '@/components/views/KeyValue'
import PracticalSkill from '@/components/views/PracticalSkill'
import Volunteering from '@/components/views/Volunteering'
import Language from '@/components/views/Language'
import Reference from '@/components/views/Reference'
import WorkExperienceList from './WorkExperienceList'


export default {
    name: 'MyCV',
    components: {
        SubNavbar,
        'work-experience': WorkExperience,
        Education,
        KeyValue,
        PracticalSkill,
        Volunteering,
        Language,
        Reference,
        'work-experience-list': WorkExperienceList

    },
    data () {
        return {
            home: 'yes',
            text: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon',
            max: 100,
            value: 33.333333333,
            bar: {
                variant: 'success', 
                value: 25
            },
            user: null,
            profile: null,
            training: [],
            education: [],
            key_values: [],
            skills: [],
            volunteering: [],
            languages: [],
            references: [],
            selectedComponent: null,
            cid: null,
            id: null
        }
    },
    filters: {

    },
    computed: {

    },
    methods: {
        editTraining(id) {
            console.log('edit event from child, ID=', id)
            if (id) {
                this.id = id
                this.selectedComponent = 'WorkExperience'
            }
        },
        onUpdatedTraining(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            this.selectedComponent = null
            if (id) {
                this.fetchTraining()
            }
        },
        removeEducation(elem) {
            db.collection('education').doc(elem.id).delete()
            .then(() => {
                if (elem) {
                    let ix = this.training.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.training.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing praksissted: ", error);
            })
        },
        updateEducation(elem) {
            this.id = elem.id
            this.selectedComponent = 'Education'            
        },
        onUpdatedEducation(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            this.selectedComponent = null
            if (id) {
                this.fetchEducation()
            }
        },
        removeKeyValue(elem) {
            db.collection('key_values').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.key_values.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.key_values.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing key value: ", error);
            })
        },
        updateKeyValue(elem) {
            console.log('updateKeyValue')
            this.id = elem.id
            this.selectedComponent = 'KeyValue'            
        },
        onUpdatedKeyValue(id) {
            // child component (slot) signaled finished
            console.log('onUpdatedKeyValue', id)
            this.selectedComponent = null
            if (id) {
                this.fetchKeyValues()
            }
        },
        removeSkill(elem) {
            db.collection('skills').doc(elem.id).delete()
            .then(() => {
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
            console.log('onUpdatedSkill', id)
            this.selectedComponent = null
            if (id) {
                this.fetchSkills()
            }
        },
        removeVolunteering(elem) {
            db.collection('volunteering').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.volunteering.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.training.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing praksissted: ", error);
            })
        },
        updateVolunteering(elem) {
            this.id = elem.id
            this.selectedComponent = 'Volunteering'            
        },
        onUpdatedVolunteering(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            this.selectedComponent = null
            if (id) {
                this.fetchVolunteering()
            }
        },
        removeLanguage(elem) {
            db.collection('languages').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.languages.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.skills.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing skill,", error);
            })
        },
        updateLanguage(elem) {
            this.id = elem.id
            this.selectedComponent = 'Language'            
        },
        onUpdatedLanguage(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchLanguages()
            }
        },
        removeReference(elem) {
            db.collection('references').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                // this.fetchTraining()
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
            this.id = elem.id; this.selectedComponent = 'Reference'            
        },
        onUpdatedReference(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchReferences()
            }
        },
    
        fetchTraining() {
            if (this.user) {
                db.collection('training').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.training.push(elem)
                    })
                })
                .catch(err => {
                    console.log('FMCetching training failed', err)
                })
            }
        },
        fetchEducation() {
            if (this.user) {
                db.collection('education').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.education.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching education failed', err)
                })
            }
        },
        fetchKeyValues() {
            if (this.user) {
                db.collection('key_values').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.key_values.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching key values failed', err)
                })
            }
        },
        fetchSkills() {
            if (this.user) {
                db.collection('skills').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.skills.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching skills failed', err)
                })
            }
        },
        fetchVolunteering() {
            if (this.user) {
                db.collection('volunteering').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.volunteering.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching volunteering failed', err)
                })
            }
        },
        fetchLanguages() {
            if (this.user) {
                db.collection('languages').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.languages.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching languages failed', err)
                })
            }
        },
        fetchReferences() {
            if (this.user) {
                db.collection('references').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.references.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching references  failed', err)
                })
            }
        }
    },
    mounted() {

    },
    created() {
        // current user
        this.user = firebase.auth().currentUser.uid
        db.collection('users').doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
            this.profile = doc.data()
        })
        .catch(error => {
            console.error('Firebase error: ', error)
        })

        // fetch work experience/training
        this.fetchTraining()

        // fetch key values
        this.fetchEducation()

        // fetch key values
        this.fetchKeyValues()

        // fetch practical skills
        this.fetchSkills()

        // fetch practical skills
        this.fetchVolunteering()

        // fetch practical skills
        this.fetchLanguages()

        // fetch references
        this.fetchReferences()
    }
}
</script>

<style>
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
