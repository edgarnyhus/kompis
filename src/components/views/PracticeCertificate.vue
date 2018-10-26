<template>
    <div role="tablist">
        <!-- <SubNavbar /> -->

        <div class="container">
            <b-form @submit.prevent="update" style="margin-top: 70px">
                <b-form-input 
                    @change="reset"
                    v-model="form.company"
                    type="text"
                    placeholder="Navn på bedrift"
                    style="height: 80px; font-size: 40px; border: none; margin-left: 0; padding left: 0; [read-only]: rgb(0,160,161)"
                    v-bind:readonly="form.readonly"
                    ref="companyField"
                    >
                    {{ form.employer }}
                </b-form-input>
                <div style="margin-top: 20px"></div>
                <a v-on:click="enable" href="#" style="color: rgb(0,160,161)"><strong>Endre</strong></a>
            </b-form>

            <!-- <b-progress class="g-m2 mb-3" height="2em" :value="bars[0].value" :variant="this.bars[1].variant" :max="max" show-progress></b-progress> -->

            <div style="margin-top: 40px"></div>
            <b-card no-body class="disabled-div accordion mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion1 role="tab">
                    <h5 class="b-card-title">Praksissted
                    <!-- <a v-b-toggle.accordion1  class="btn-floating float-right"><i class="fa fa-chevron-down"></i></a> -->
                    <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'JobTraining', params: { show: 'jobTraining', id: null } }">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvor har du vært i praksis?</p>
                </b-card-header>
                <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
                    <li v-for="(elem, index) in training" :key="index">
                        <b-card title="elem.employer"
                                sub-title="elem.from.month elem.year - elem.role">
                            <p class="card-text">
                                {{ elem.desciption}}
                            </p>
                        </b-card>

                    </li>

                    <!-- <div>
                        <b-card title="Card title"
                                sub-title="Card subtitle">
                            <p class="card-text">
                                Some quick example text to build on the <em>card title</em> and make up the bulk of the card's content.
                            </p>
                            <a href="#"
                            class="card-link">Card link</a>
                            <b-link href="#"
                                    class="card-link">Another link</b-link>
                        </b-card>
                    </div> -->
'                </b-collapse>
            </b-card>

<fieldset :disabled="isdisabled">

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion3>
                    <h5 class="b-card-title">Nøkkelkompetanse
                    <b-button class="btn-floating btn-secondary float-right" @click="addKeyCompetence()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper er bekreftet gjennom arbeidet på dette praksisstedet?</p>
                </b-card-header>
                <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <p class="card-text">
                            {{ text }}
                        </p>
                    </b-card-body>
                </b-collapse>
            </b-card>
</fieldset>

            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" v-b-toggle.accordion4 role="tab">
                    <h5 class="b-card-title">Praktiske ferdigheter
                    <b-button class="btn-floating btn-secondary float-right" @click="addPracticalSkill()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvilke praktiske feredigheter er lært eller bekreftet gjennom arbeid  ved dette parksisstedet?</p>
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
                    <h5 class="b-card-title">Kontaktperson
                    <b-button class="btn-floating btn-secondary float-right" @click="addVolunteering()">Legg til emne</b-button>
                    </h5>
                    <p class="b-card-text" style="font-style: italic">Hvem er din kontktperson ved dette praksisstedet?</p>
                </b-card-header>
                <b-collapse id="accordion5" v-if="form.references" accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                        <p class="card-text">
                            {{ text }}
                        </p>
                    </b-card-body>
                </b-collapse>
            </b-card>

        </div>
        <div style="margin-bottom: 40px"></div>
    </div>
</template>

<script>
import SubNavbar from '@/components/layout/SubNavbar'
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'PracticeCertificate',
    components: {
        SubNavbar
    },
    computed: {
        isdisabled() {
            return true;
        }

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
                readonly: true,
                trainings: [],
                keyCompetences: [],
                practicalSkills: [],
                refererence: []
            },
            step: 1,
            dis: '',
            user: null
        }
    },
    directives: {
        // focus: {
        //     // directive definition
        //     inserted: function (el) {
        //     el.focus()
        //     }
        // }
    },
    methods: {
        addKeyCompetence() {
            console.log('addKeyCompetence')
            // this.$router.push({ name: 'JobTraining', params: { show: 'jobTraining' }})
            this.$router.push({ name: 'KeyCompetence' })
        },
        addPracticalSkill() {
            console.log('addPracticalSkill')
            this.$router.push({ name: 'PracticalSkill' })
        },
        addReference() {
            console.log('addReference')
        },
        enable() {
            this.form.readonly = false
            this.$refs.companyField.focus();
        },
        reset() {
            this.form.readonly = true
        },
        update() {
            console.log('update')
        }
    },
    created() {
        this.user = firebase.auth().currentUser

        db.collection('training').where('userId', '==', this.user.uid)
        .onSnapshot((snapshot) => {
        snapshot.docChanges.forEach(change => {
            if(change.type == 'added'){
            this.trainings.unshift({
                from: change.doc.data().from,
                content: change.doc.data().content
            })
            }
        })
        })
    }
}
</script>

<style>
.disabled-div {
    pointer-events: none;
    opacity: 0.5;
}
b-form-input[read-only] {
  background-color: rgb(0,160,151);
}
g-m2 {
    margin-top: 2em;
    margin-bottom: 0.5em;
}
.accordion {
    margin-top: 1em;
    margin-bottom: 5em;
}
</style>
