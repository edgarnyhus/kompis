<template>
    <div class="container">
        <div>
            <h4 style="margin-top: 40px">Praksissted</h4>
            <p style="font-style: italic">Hvor har du vært i praksis?</p>
        </div>

        <b-form @submit.prevent="update">
        <b-form-group label="Stacked radios">
            <b-form-radio-group v-model="selected"
                                :options="options"
                                stacked
                                name="where">
        </b-form-radio-group>
        </b-form-group>
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

            <b-form-group class="g-group2">
                <!-- <div class="g-group form-row">
                    <div class="form-group col-md-3">
                        <label for="fromMonth"><strong>Fra</strong></label>
                        <b-form-select v-model="form.from.month" :options="months" class="mb-3" />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="fromYear">(år) </label>
                        <b-input id="fromYear" placeholder="Fra hvilket år?" v-model="form.to.year" />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="toMonth"><strong>Til</strong></label>
                        <b-form-select v-model="form.to.month" :options="months" class="mb-3" />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="toYear">(år) </label>
                        <b-input  id="toYear" placeholder="Til hvilket år?" v-model="form.to.year" />
                    </div>
                </div> -->

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label><strong>Fra</strong></label>
                        <!-- <datepicker :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></datepicker> -->
                        <b-input type='date' :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></b-input>
                    </div>
                    <div class="form-group col-md-6">
                        <label><strong>Til</strong></label>
                        <!-- <datepicker :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></datepicker> -->
                    </div>
                </div>
            </b-form-group>

            <b-form-group class="g-group3">
                <b-form-checkbox>Jeg jobber her nå</b-form-checkbox>
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
import Datepicker from 'vuejs-datepicker'

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
            selected: 'Bedrift',
            options: [
                { text: 'Bedrift', value: 'company' },
                { text: 'Frivillig organisasjon', value: 'volunteerOrganization' }
            ],
            form: {
                where: null,
                type: null,
                from: {
                    month: null,
                    year: null
                },
                to: {
                    month: null,
                    year: null
                },
                currentEmployer: false,
                description: null
            },
            date: ''
        }

    },
    components: {
        Datepicker
    },
    methods: {
        cancel() {
            console.log("cancel")
            this.$router.go(-1)
        }
    }
}
</script>

<style>

</style>
