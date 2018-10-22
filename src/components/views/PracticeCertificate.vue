<template>
    <div role="tablist">
        <!-- <SubNavbar /> -->

        <div class="container">
            <b-form style="margin-top: 70px">
                <b-form-input v-model="form.company"
                  type="text"
                  placeholder="Navn på bedrift"
                  style="height: 80px; font-size: 40px; border: none; margin-left: 0; padding left: 0"
                  v-bind:readonly="form.readonly"
                  >
                  {{ form.company }}
                </b-form-input>
                <a v-on:click="form.readonly = !form.readonly" href="#" style="color: rgb(0,160,161)"><strong>Endre</strong></a>
                <!-- <a v-on:click="enable" href="#" style="color: rgb(0,160,161)"><strong>Endre</strong></a> -->
            </b-form>
            <!-- <b-progress class="g-m2 mb-3" height="2em" :value="bars[0].value" :variant="this.bars[1].variant" :max="max" show-progress></b-progress> -->

            <b-card no-body class="accordion mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion1 role="tab">
                    <h5 class="b-card-title">Praksissted
                    <!-- <a v-b-toggle.accordion1  class="btn-floating float-right"><i class="fa fa-chevron-down"></i></a> -->
                    <b-button class="btn-floating btn-secondary float-right" @click="addWorkExperience()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
                </b-card-header>
                <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <!-- <font-awesome-icon img-left icon="coffee" style="font-size: 2rem; font-weight: 50"/> -->
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
                    <!-- <md-icon-button class="md-fab-top-right">add</md-icon-button> -->
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
        <div class="end-page">

        </div>
    </div>
</template>

<script>
import SubNavbar from '@/components/layout/SubNavbar'

export default {
    name: 'PracticeCertificate',
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
            ],
            form: {
                disabled: true,
                readonly: true,
                company: null
            }
        }
    },
    methods: {
        addWorkExperience() {
            console.log('addWorkExperience-->lauching page')
            this.$router.push({ name: 'WorkExperience' })
        },
        addEducation() {
            console.log('addEducation')
        },
        addKeyCompetence() {
            console.log('addKeyCompetence')
            this.$router.push({ name: 'KeyCompetence' })
        },
        addPracticalSkill() {
            console.log('addPracticalSkill')
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
        addPracticeCertificate() {
            this.$router.push({ name: 'PracticeCertificat' })
        },
        enable: function() {
            console.log('enable')
            this.form.disable = false
            this.form.readonly = false
        }
    }
}
</script>

<style>
.page-title {
    margin-top: 2em;
    margin-bottom: 1em;
}
g-m2 {
    margin-top: 2em;
    margin-bottom: 0.5em;
}
.accordion {
    margin-top: 1em;
    margin-bottom: 5em;
}
b-card-header {
  cursor: wait;
}
.end-page {
    margin-bottom: 3em;
}
</style>
