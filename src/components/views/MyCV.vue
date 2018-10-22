<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <h1 class="g-title">Min CV</h1>
            
            <b-progress class="mb-3" height="2em" :value="bars[0].value" :variant="this.bars[1].variant" :max="max" show-progress></b-progress>

            <b-card class="g-practice">
                <h5 class="b-card-title">Har du vært i arberidspraksis?</h5>
                <p class="b-card-text">Lag praksisattesten først, og dataene vil dukke opp i CVen din. Usikker på hvordan du skal gjære det, ta kontakt med veileder.</p>
                <button type="button" class="btn btn-info" @click="addPracticeCertificate">Lag ny praksisattest</button>
            </b-card>

            <b-card no-body class="accordion mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion1 role="tab">
                    <h5 class="b-card-title">Arbeidserfaring
                    <b-button class="btn-floating btn-secondary float-right" @click="addWorkExperience()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
                </b-card-header>
                <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <p class="card-text">
                            I start opened because <code>visible</code> is <code>true</code>
                        </p>
                        <p class="card-text">
                            {{ text }}
                        </p>
                    </b-card-body>
                </b-collapse>
            </b-card>
            
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion2 role="tab">
                    <h5 class="b-card-title">Utdanning og kurs
                    <b-button class="btn-floating btn-secondary float-right" @click="addEducation()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt nen kurs på skolen, jobb eller fritid?</p>
                </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <p class="card-text">
                    {{ text }}
                </p>
                </b-card-body>
            </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion3 role="tab">
                    <h5 class="b-card-title">Nøkkelkompetanse
                    <b-button class="btn-floating btn-secondary float-right" @click="addKeyCompetence()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
                </b-card-header>
            <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <p class="card-text">
                    {{ text }}
                </p>
                </b-card-body>
            </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion4 role="tab">
                    <h5 class="b-card-title">Praktiske ferdigheter
                    <b-button class="btn-floating btn-secondary float-right" @click="addPracticalSkill()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hva er dine praktiske evner? Npe du har lært på skolen eller i jobb?</p>
                </b-card-header>
            <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <p class="card-text">
                    {{ text }}
                </p>
                </b-card-body>
            </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion5 role="tab">
                    <h5 class="b-card-title">Frivillig arbeid og verv
                    <b-button class="btn-floating btn-secondary float-right" @click="addVolunteering()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du tatt på deg frivillig arbeid eller verv? Hva?</p>
                </b-card-header>
            <b-collapse id="accordion5" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <p class="card-text">
                    {{ text }}
                </p>
                </b-card-body>
            </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion6 role="tab">
                    <h5 class="b-card-title">Språk
                    <b-button class="btn-floating btn-secondary float-right" @click="addLanguage()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke språk kan du snakke?</p>
                </b-card-header>
            <b-collapse id="accordion6" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <p class="card-text">
                    {{ text }}
                </p>
                </b-card-body>
            </b-collapse>
            </b-card>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion7 role="tab">
                    <h5 class="b-card-title">Referanser
                    <b-button class="btn-floating btn-secondary float-right" @click="addReference()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke personer kan potensielle arbeidsgivere kontakte for å bli kjent med deg? Husk å be om tillatelse!</p>
                </b-card-header>
            <b-collapse id="accordion7" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <p class="card-text">
                    {{ text }}
                </p>
                </b-card-body>
            </b-collapse>
            </b-card>
        </div>
        <div class="g-bottom"></div>
    </div>
</template>

<script>
import SubNavbar from '@/components/layout/SubNavbar'

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
        bars: [
            {variant: 'success', value: 25},
            {variant: 'info', value: 25},
            {variant: 'warning', value: 25},
            {variant: 'danger', value: 25},
            {variant: 'primary', value: 25},
            {variant: 'secondary', value: 25},
            {variant: 'dark', value: 25}
        ]
        }
    },
    methods: {
        addWorkExperience() {
            this.$router.push({ name: 'WorkExperience' })
        },
        addEducation() {
            this.$router.push({ name: 'Education' })
        },
        addKeyCompetence() {
            this.$router.push({ name: 'KeyCompetence' })
        },
        addPracticalSkill() {
            this.$router.push({ name: 'PracticalSkill' })
        },
        addVolunteering() {
            console.log('addVolunteering')
        },
        addLanguage() {
            console.log('addLanguage')
        },
        addReference() {
            console.log('addReference')
        },
        showPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificatView' })
        },
        addPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificate' })
        }
    }
}
</script>

<style>
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
