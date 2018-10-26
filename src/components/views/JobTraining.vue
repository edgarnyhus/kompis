<template>
    <div class="container">
        <div>
            <h4 class="g-m2">Praksissted</h4>
            <p style="font-style: italic">Hvor har du vært i praksis?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group v-if="this.$route.params.show == 'jobTraining'" style="font-weight: 650" label="Type arbeid">
                <b-form-radio-group style="font-weight: 400" v-model="form.jobType"
                                    :options="jobTypes"
                                    stacked
                                    name="where">
                </b-form-radio-group>
            </b-form-group>

            <b-form-group class="g-m2">
                <div class="form-row">
                    <div class="col">
                        <label for="employer"><strong>Arbeidsgiver</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="employer" placeholder="" v-model="form.employer" />
                    </div>
                    <div class="col">
                        <label for="place"><strong>Sted</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="place" placeholder="" v-model="form.place" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group class="g-m2">
                <div class="form-row">
                    <div class="col">
                        <label for="place"><strong>Min rolle</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="place" placeholder="" v-model="form.role" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <div class="g-m2 form-row">
                    <b-form-group class="col-md-3">
                        <label for="fromMonth"><strong>Fra</strong></label>
                        <b-form-select id="fromMonth" class="mb-3" :options="months" v-model="form.from.month" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="fromYear">(år) </label>
                        <b-form-input id="fromYear" type="number" placeholder="Fra hvilket år?" v-model="form.from.year" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toMonth"><strong>Til</strong></label>
                        <b-form-select class="mb-3" :options="months" v-model="form.to.month" />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toYear" style="color: white">(år) </label>
                        <b-form-input  type="number" id="toYear" placeholder="Til hvilket år?" v-model="form.to.year" />
                    </b-form-group>
                </div>
            </b-form-group>

            <b-form-group>
                <b-form-checkbox id="checkbox1"
                                v-model="form.currentEmployer"
                                value="true"
                                unchecked-value="false">
                    Jeg jobber her nå
                </b-form-checkbox>
                   </b-form-group>

            <b-form-group class="g-m2">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder=""
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <b-form-group>
                <p class="g-m2"><strong>Dokumentasjon</strong></p>
                <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
                <div class="g-m2">
                    <b-button class="g-span" variant="leight">Last opp</b-button>
                    <b-button variant="leight">Lenke</b-button>
                </div>
            </b-form-group>

            <div class="g-m3">
                <b-button  class="g-span" @click="update()" variant="info">Lagre</b-button>
                <!-- <b-link @click="cancel()" href="#" variant="color: info"><strong>Avbyt</strong></b-link> -->
                <b-link @click="getJobTraining()" href="#" variant="color: info"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>

    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'JobTraining',
    data() {
        return {
            months: [
                { value: null, text: 'Velg en måned' },
                { value: '01', text: 'januar' },
                { value: '02', text: 'februar' },
                { value: '03', text: 'mars' },
                { value: '04', text: 'april' },
                { value: '05', text: 'mai' },
                { value: '06', text: 'juni' },
                { value: '07', text: 'juli' },
                { value: '08', text: 'august' },
                { value: '09', text: 'september' },
                { value: '10', text: 'oktober' },
                { value: '11', text: 'november' },
                { value: '12', text: 'desember' }
            ],
            jobTypes: [
                { text: 'Bedrift', value: 'company' },
                { text: 'Frivillig organisasjon', value: 'volunteerOrganization' }
            ],
            form: {
                employer: null,
                place: null,
                jobType: null,
                role: null,
                from: {
                    month: null,
                    year: null
                },
                to: {
                    month: null,
                    year: null
                },
                currentEmployer: false,
                description: null,
                timestamp: null,
                userId: null
            },
            user: null,
            ref: null
        }

    },
    components: {

    },
    methods: {
        cancel() {
            console.log("cancel")
            this.$router.go(-1)
        },
        update() {
            console.log("update: " + this.form.employer  + "," + this.form.place + "," + this.form.type + "," + this.form.fromDate + "," + this.form.toDate + "," + this.form.stillThere + "," + this.form.description)
            if (this.user) {
                this.form.userId = this.user.uid 
                this.form.timestamp = Date.now()
                if (this.$route.params.id) {
                    db.collection('training').doc(this.$route.params.id).update(
                        this.form
                    )
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                } else {
                    db.collection('training').add(
                        this.form
                    )
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                }
            }
            else {
                // user not logged in
            }
            //this.$router.go(-1)
        },
        getJobTraining () {
            if (this.user) {
                if (this.ref) {

                } else {

                }
                let ref = db.collection("training").where('userId', "==", user.uid)
                .get()
                .then (doc => {
                    this.form = doc
                    console.log('get(): ' + form.employer)
                })
                .catch(err => {
                    console.log('Firestore error: ' + err)
                })
            }
            else {
                // user not logged in
            }
        }

    },
    mounted() {
        this.user = firebase.auth().currentUser
        if (this.user && this.$route.params.id) {
            // get object
            ref = db.collection('users').doc(this.$route.params.id)
            ref.get().
            then (doc => {
                if(doc.exists) {
                    this.form = doc
                }
            })
        }            
    }
}
</script>

<style>
.g-m2 {
    margin-top: 1.5em;
    margin-bottom: 0;
}
.g-m3 {
    margin-top: 2em;
    margin-bottom: 2em;
}
.g-span {
    margin-right: 1em;
}
</style>
