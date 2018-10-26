<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <h1 class="g-title">Min CV</h1>
            
            <b-progress class="mb-3" height="2em" :value="bar.value" variant="info" :max="max" show-progress></b-progress>

            <b-card class="g-practice">
                <h5 class="b-card-title">Har du vært i arbeidspraksis?</h5>
                <p class="b-card-text">Lag praksisattesten først, og dataene vil dukke opp i CVen din. Usikker på hvordan du skal gjære det, ta kontakt med veileder.</p>
                <button type="button" class="btn btn-info" @click="addPracticeCertificate">Lag ny praksisattest</button>
            </b-card>

            <b-card no-body class="accordion mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion1 role="tab">
                    <h5 class="b-card-title">Arbeidserfaring
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'WorkExperience' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
                </b-card-header>
                <b-collapse id="accordion1" :visible="true" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each job training/experience -->
                    <b-card-group v-for="elem in workExperiences" :key="elem.id">
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
                                <p class="card-text text-muted" style="margin-bottom: 0.5em"><span>{{elem.from | formatDate}}</span><br>
                                    {{elem.place}}</P>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>
            
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion2 role="tab">
                    <h5 class="b-card-title">Utdanning og kurs
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'Education' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt nen kurs på skolen, jobb eller fritid?</p>
                </b-card-header>
                <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each exam -->
                    <b-card-group v-for="elem in education" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">{{ elem.school }}</h6>
                                <h5 class="card-subtitle text-muted">{{elem.study}}</h5>
                                <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from.month}} {{elem.from.year}} - {{ elem.to.month }} {{elem.to.year}}</p>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion3 role="tab">
                    <h5 class="b-card-title">Nøkkelkompetanse
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'KeyCompetence' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
                </b-card-header>
                <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each ekey competence -->
                    <b-card-group v-for="elem in keyCompetences" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.competence }}</h5>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion4 role="tab">
                    <h5 class="b-card-title">Praktiske ferdigheter
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'PracticalSkill' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hva er dine praktiske evner? Npe du har lært på skolen eller i jobb?</p>
                </b-card-header>
                <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each practical skill -->
                    <b-card-group v-for="elem in skills" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.skill }}</h5>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion5 role="tab">
                    <h5 class="b-card-title">Frivillig arbeid og verv
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'Volunteering' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du tatt på deg frivillig arbeid eller verv? Hva?</p>
                </b-card-header>
                <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each  -->
                    <b-card-group v-for="elem in volunteering" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.volunteering }}</h5>
                                <p class="card-text">{{elem.description}}</p>
                            </div>
                        </div>
                    </b-card-group>
                </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion6 role="tab">
                    <h5 class="b-card-title">Språk
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'Language' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke språk kan du snakke?</p>
                </b-card-header>
                <b-collapse id="accordion6" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each language -->
                    <b-card-group v-for="elem in languages" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.language }}</h5>
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
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'Reference' }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke personer kan potensielle arbeidsgivere kontakte for å bli kjent med deg? Husk å be om tillatelse!</p>
                </b-card-header>
                <b-collapse id="accordion7" accordion="my-accordion" role="tabpanel">
                    <!-- present a card for each reference -->
                    <b-card-group v-for="elem in references" :key="elem.id">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{{ elem.reference }}</h5>
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
import moment from 'moment'


export default {
    name: 'MyCV',
    components: {
        SubNavbar
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
            workExperiences: [],
            education: [],
            keyCompetences: [],
            skills: [],
            volunteering: [],
            languages: [],
            references: []
        }
    },
    filters: {
        formatDate(value) {
            if (value) {
                console.log('value: ' + value)
                return moment(value.timestamp).format('lll')
             }
            return ''
        }
    },
    computed: {

    },
    methods: {
        showPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificatView' })
        },
        addPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificate' })
        }
    },
    mounted() {

    },
    created() {
        // current user
        db.collection('users').doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
            this.profile = doc.data()
        })

        // fetch work experience
        db.collection('workExperience').where('userId', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.workExperiences.push(elem)
            })
        })

        // subscribe to changes to the 'messages' collection
        // let ref = db.collection('experience').orderBy('from')
        // ref.onSnapshot(snapshot => {
        //     snapshot.docChanges().forEach(change => {
        //         if (change.type == 'added') {
        //             let data = change.doc.date()
        //             data.id = doc.id,
        //             // data.from = moment(data.from).format('ll')
        //             this.messages.push(data)
        //         }
        //     })
        // })

        // fetch education
        db.collection('education').where('userId', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.education.push(elem)
            })
        })

        // fetch key competences
        db.collection('keyCompetance').where('userId', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.keyCompetances.push(elem)
            })
        })

        // fetch practical skills
        db.collection('practicalSkill').where('userId', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.skills.push(elem)
            })
        })

        // fetch volunteering
        db.collection('volunteering').where('userId', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.volunteering.push(elem)
            })
        })

        // fetch languages
        db.collection('language').where('userId', '==',firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let elem = doc.data()
                elem.id = doc.id
                this.languages.push(elem)
            })
        })

        // fetch references
        db.collection('reference').where('userId', '==',firebase.auth().currentUser.uid)
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
