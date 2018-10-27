<template>
    <div class="container">
        <div>
            <h4 class="g-title">Arbeidserfaring</h4>
            <p style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group class="g-group">
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

            <b-form-group class="g-group">
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
            </b-form-group>

            <b-form-group>
                <!-- <div class="form-row">
                    <div class="form-group col-md-6">
                        <label><strong>Fra</strong></label>
                        <b-input type='date' :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></b-input>
                    </div>
                    <div class="form-group col-md-6">
                        <label><strong>Til</strong></label>
                        <b-input type='date' :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></b-input>
                    </div>
                </div> -->

                <div class="g-m2 form-row">
                    <b-form-group class="col-md-3">
                        <label for="fromMonth"><strong>Fra</strong></label>
                        <b-form-select id="fromMonth" class="mb-3" :options="months" v-model="from.month" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="fromYear" style="color: white">(år) </label>
                        <b-form-input id="fromYear" type="number" placeholder="Fra hvilket år?" v-model="from.year" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toMonth"><strong>Til</strong></label>
                        <b-form-select class="mb-3" :options="months" v-model="to.month" />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toYear" style="color: white">(år) </label>
                        <b-form-input  type="number" id="toYear" placeholder="Til hvilket år?" v-model="to.year" />
                    </b-form-group>
                </div>
            </b-form-group>

            <b-form-group class="g-group3">
                <b-form-checkbox v-model="form.ongoing">Jeg jobber her nå</b-form-checkbox>
            </b-form-group>

            <b-form-group class="g-group">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder=""
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <b-form-group>
                <p class="g-title2"><strong>Dokumentasjon</strong></p>
                <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
                <div class="g-group">
                    <b-button class="g-span" variant="leight">Last opp</b-button>
                    <b-button variant="leight">Lenke</b-button>
                </div>
            </b-form-group>

            <div class="g-group4">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="color: info"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>

    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'

export default {
    name: 'WorkExperience',
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
           form: {
                employer: null,
                place: null,
                jobType: null,
                role: null,
                from: null,
                to: null,
                ongoing: false,
                description: null,
                timestamp: null,
                userId: null
            },
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null
            },
            user: null
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
            if (this.user) {
                this.form.userId = this.user.uid 
                this.form.timestamp = Date.now()
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                } catch (error) {
                    console.log('update excception: ' + error)
                }
                if (this.$route.params.id) {
                    db.collection('training').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            conssole.log('Training updated')
                        })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                } else {
                    // db.collection('training').add(
                    db.collection('training').add(
                        this.form)
                        .then (doc => {
                            conssole.log('Training added')
                     })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
            this.$router.go(-1)
        }
    },
    mounted() {
        this.user = firebase.auth().currentUser
        if (this.user && this.$route.params.id) {
            // get object
            ref = db.collection('training').doc(this.$route.params.id)
            ref.get().
            then (doc => {
                if(doc.exists) {
                    this.form = doc.data()
                    this.from.month = this.form.from.getMonth()
                    this.from.year = this.form.from.getYear()
                    this.to.month = this.form.to.getMonth()
                    this.to.year = this.form.to.getYear()
                }
            })
        }            
    }

}
</script>

<style>
a {
    color: rgb(0,161,181);
}
.g-span {
    margin-right: 1em;
}
</style>
