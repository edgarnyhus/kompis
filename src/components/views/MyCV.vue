<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <h1 class="g-title">Min CV</h1>
            
            <!-- ARBEIDSERFARING -->
            <work-experience-card></work-experience-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" role="tab">
                    <h5 class="b-card-title">Arbeidserfaring
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'WorkExperience'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
                </b-card-header>


                <b-collapse id="accordion1" v-if="selectedComponent == 'WorkExperience'" accordion="my-accordion" role="tabpanel">
                    <!-- <component v-on:updtraining="onUpdatedExperience" :uid="user_id" :id="id" :is="selectedComponent"></component> -->
                    <work-experience v-on:onUpdatedExperience="onUpdatedExperience" :uid="user_id" :cid="cert_id" :id="id"></work-experience>
                </b-collapse>

                <b-collapse id="accordion1" v-else accordion="my-accordion" role="tabpanel">
                    <work-experience-list v-on:editExperience="editExperience" :experience="experience" :uid="user_id" :cid="cert_id" :id="id"></work-experience-list>
                </b-collapse>
            </b-card>
            
            <!-- UTDANNING OG KURS -->
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion2 role="tab">
                    <h5 class="b-card-title">Utdanning og kurs
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Education'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt nen kurs på skolen, jobb eller fritid?</p>
                </b-card-header>

                <b-collapse id="accordion2" v-if="selectedComponent == 'Education'" accordion="my-accordion" role="tabpanel">
                    <education v-on:onUpdatedEducation="onUpdatedEducation" :uid="user_id" :cid="cert_id" :id="id"></education>
                </b-collapse>

                <b-collapse id="accordion2" v-else accordion="my-accordion" role="tabpanel">
                    <education-list v-on:editEducation="editEducation" :education="education" :uid="user_id" :cid="cert_id" :id="id"></education-list>
                </b-collapse>
            </b-card>

            <!-- NØKKELKOMPETANSE -->
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion3 role="tab">
                    <h5 class="b-card-title">Nøkkelkompetanse
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'KeyValue'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
                </b-card-header>

                <b-collapse id="accordion3" v-if="selectedComponent == 'KeyValue'" accordion="my-accordion" role="tabpanel">
                    <key-value v-on:onUpdatedKeyValue="onUpdatedKeyValue" :uid="user_id" :cid="cert_id" :id="id" :is="selectedComponent"></key-value>
                </b-collapse>

                <b-collapse id="accordion3" v-else accordion="my-accordion" role="tabpanel">
                    <key-value-list v-on:editKeyValue="editKeyValue" :keyvalues="keyvalues" :uid="user_id" :cid="cert_id" :id="id"></key-value-list>
                </b-collapse>
            </b-card>

            <!-- PRAKTISKE FERDIGHETER -->
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion4 role="tab">
                    <h5 class="b-card-title">Praktiske ferdigheter
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'PracticalSkill'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hva er dine praktiske evner? Npe du har lært på skolen eller i jobb?</p>
                </b-card-header>

                <b-collapse id="accordion4" v-if="selectedComponent == 'PracticalSkill'" accordion="my-accordion" role="tabpanel">
                    <practical-skill v-on:onUpdatedSkill="onUpdatedSkill" :uid="user_id" :cid="cert_id" :id="id" :is="selectedComponent"></practical-skill>
                </b-collapse>

                <b-collapse id="accordion4" v-else accordion="my-accordion" role="tabpanel">
                    <practical-skill-list v-on:editExperience="editExperience" :skills="skills" :uid="user_id" :cid="cert_id" :id="id"></practical-skill-list>
                </b-collapse>
            </b-card>

            <!-- FRIVILLIG ARBEID OG VERV -->
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion5 role="tab">
                    <h5 class="b-card-title">Frivillig arbeid og verv
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Volunteering'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du tatt på deg frivillig arbeid eller verv? Hva?</p>
                </b-card-header>

                <b-collapse id="accordion5" v-if="selectedComponent == 'Volunteering'" accordion="my-accordion" role="tabpanel">
                    <volunteering v-on:onUpdatedVolunteering="onUpdatedVolunteering" :uid="user_id" :cid="cert_id" :id="id" :is="selectedComponent"></volunteering>
                </b-collapse>

                <b-collapse id="accordion5" v-else accordion="my-accordion" role="tabpanel">
                    <volunteering-list v-on:editExperience="editExperience" :volunteering="volunteering" :uid="user_id" :cid="cert_id" :id="id"></volunteering-list>
                </b-collapse>
            </b-card>

            <!-- SPRÅK -->
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion6 role="tab">
                    <h5 class="b-card-title">Språk
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Language'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke språk kan du snakke?</p>
                </b-card-header>

                <b-collapse id="accordion6" v-if="selectedComponent == 'Language'" accordion="my-accordion" role="tabpanel">
                    <language v-on:onUpdatedLanguage="onUpdatedLanguage" :uid="user_id" :cid="cert_id" :id="id"></language>
                </b-collapse>

                <b-collapse id="accordion6" v-else accordion="my-accordion" role="tabpanel">
                    <language-list v-on:editLanguage="editLanguage" :languages="languages" :uid="user_id" :cid="cert_id" :id="id"></language-list>
                </b-collapse>
            </b-card>

            <!-- REFERANSER -->
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion7 role="tab">
                    <h5 class="b-card-title">Referanser
                        <b-button class="btn-floating btn-secondary float-right" @click="selectedComponent = 'Reference'">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke personer kan potensielle arbeidsgivere kontakte for å bli kjent med deg? Husk å be om tillatelse!</p>
                </b-card-header>

                <b-collapse id="accordion7" v-if="selectedComponent == 'Reference'" accordion="my-accordion" role="tabpanel">
                    <reference v-on:onUpdatedReference="onUpdatedReference" :uid="user_id" :cid="cert_id" :id="id" :is="selectedComponent"></reference>
                </b-collapse>

                <b-collapse id="accordion7" v-else accordion="my-accordion" role="tabpanel">
                    <reference-list v-on:editExperience="editExperience" :references="references" :uid="user_id" :cid="cert_id" :id="id"></reference-list>
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
import EducationList from './EducationList'
import KeyValueList from './KeyValueList'
import PracticalSkillList from './PracticalSkillList'
import LanguageList from './LanguageList'
import ReferenceList from './ReferenceList'
import VolunteeringList from './VolunteeringList'
import WorkExperienceCard from '@/components/views/WorkExperienceCard'

const EXPR=0, EDU=1, KV=2, SKIL=3, LAN=4, VOL=5, REF=6

export default {
    name: 'MyCV',
    components: {
        SubNavbar,
        WorkExperience,
        WorkExperienceList,
        Education,
        EducationList,
        KeyValue,
        KeyValueList,
        PracticalSkill,
        PracticalSkillList,
        Volunteering,
        VolunteeringList,
        Language,
        LanguageList,
        Reference,
        ReferenceList,
        WorkExperienceCard,
    },
    props: ['uid'],
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
            showList: [REF+1],
            user: null,
            profile: null,
            experience: [],
            education: [],
            keyvalues: [],
            skills: [],
            volunteering: [],
            languages: [],
            references: [],
            selectedComponent: null,
            user_id: null,
            cert_id: null,
            id: null,
            show: ''
        }
    },
    filters: {

    },
    computed: {
        hasExperience() {
            return (experience.length > 0)
        }
    },
    methods: {
        editExperience(id) {
            console.log('edit event from child, ID=', id)
            if (id) {
                this.id = id
                this.selectedComponent = 'WorkExperience'
            }
        },
        onUpdatedExperience(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            this.selectedComponent = null
            if (id) {
                this.fetchExperience()
            }
        },
        editEducation(id) {
            this.id = id
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
        editKeyValue(id) {
            this.id = id
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
        editSkill(id) {
            this.id = id
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
        editVolunteering(id) {
            this.id = id
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
        editLanguage(id) {
            this.id = id
            this.selectedComponent = 'Language'            
        },
        onUpdatedLanguage(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchLanguages()
            }
        },
        editReference(id) {
            this.id = id
            this.selectedComponent = 'Reference'            
        },
        onUpdatedReference(id) {
            // child component (slot) signaled finished
            this.selectedComponent = null
            if (id) {
                this.fetchReferences()
            }
        },
    
        fetchExperience() {
            if (this.user_id) {
                db.collection('experience').where('user_id', '==',this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.experience.push(elem)
                    })
                })
                .catch(err => {
                    console.log('mc fetching experience failed', err)
                })
            }
        },
        fetchEducation() {
            console.log('user_id=' + this.user_id)
            if (this.user_id) {
                this.education = []
                db.collection('education').where('user_id', '==',this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.education.push(elem)
                        console.log('education elem added', elem)
                    })
                })
                .catch(err => {
                    console.log('mc fetching education failed', err)
                })
                console.log('fetchEducaiton finished', this.education.length)
            }
        },
        fetchKeyValues() {
            if (this.user_id) {
                db.collection('keyvalues').where('user_id', '==',this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.keyvalues.push(elem)
                    })
                })
                .catch(err => {
                    console.log('MC Fetching key values failed', err)
                })
            }
        },
        fetchSkills() {
            if (this.user_id) {
                db.collection('skills').where('user_id', '==',this.user_id)
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
            if (this.user_id) {
                db.collection('volunteering').where('user_id', '==',this.user_id)
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
            if (this.user_id) {
                db.collection('languages').where('user_id', '==',this.user_id)
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
            if (this.user_id) {
                db.collection('references').where('user_id', '==',this.user_id)
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
        this.user = firebase.auth().currentUser
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user_id) {
            db.collection('users').doc(this.user_id)
            .get()
            .then(doc => {
                this.profile = doc.data()
            })
            .catch(error => {
                console.error('Firebase error: ', error)
            })

            // fetch work experience/training
            this.fetchExperience()

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
}
</script>

<style>
small {
    display: block;
}
a {
    color: rgb(0,161,181);
}
a:hover {
    color: rgb(0,161,181);
}
.g-title {
    margin-top: 1em;
    margin-bottom: 1em;
}
.g-header {
    margin-bottom: 0;
}
.g-group {
    margin-top: 2em;
}
.g-span {
    margin-right: 1em;
}
.g-link {
    color: rgb(62,65,67);
    font-size: 16px;
}
.g-link:hover {
    color: rgb(70,72,74);
    font-size: 16px;
}
</style>
