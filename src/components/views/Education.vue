<template>
    <div class="container">
        <div>
            <h4 class="page-title">Arbeidserfaring</h4>
            <p style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
        </div>

        <b-form>
            <b-form-group>
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
            <b-form-group>
            </b-form-group>
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
            </b-form-group>

            <b-form-group>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="fromMonth"><strong>Fra</strong></label>
                        <b-form-select v-model="form.from.month" :options="months" class="mb-3" />
                        <!-- <b-input id="fromMonth" placeholder="Fra hvilken måned?" v-model="form.from.month" /> -->
                    </div>
                    <div class="form-group col-md-3">
                        <label for="fromYear">(år) </label>
                        <b-input id="fromYear" placeholder="Fra hvilket år?" v-model="form.to.year" />
                    </div>
                    <div class="form-group col-md-3">
                        <label for="toMonth"><strong>Til</strong></label>
                        <b-form-select v-model="form.to.month" :options="months" class="mb-3" />
                        <!-- <b-input id="toMonth" placeholder="Til hvilken måned?" v-model="form.to.month" /> -->
                    </div>
                    <div class="form-group col-md-3">
                        <label for="toYear">(år) </label>
                        <b-input  id="toYear" placeholder="Til hvilket år?" v-model="form.to.year" />
                    </div>
                </div>

                <!-- <div class="form-row">
                    <div class="form-group col-md-6">
                        <label><strong>Fra</strong></label>
                        <datepicker :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></datepicker>
                    </div>
                    <div class="form-group col-md-6">
                        <label><strong>Til</strong></label>
                        <datepicker :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></datepicker>
                    </div>
                </div> -->
            </b-form-group>

            <b-form-group>
                <b-form-checkbox>Jeg jobber her nå</b-form-checkbox>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder=""
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <b-form-group>
                <p><strong>Dokumentasjon</strong></p>
                <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
                <div class="button-group">
                    <b-button class="button-span" variant="leight">Last opp</b-button>
                    <b-button variant="leight">Lenke</b-button>
                </div>
            </b-form-group>

            <div class="button-group">
                <b-button class="button-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="foreground-color: rgb(0,161,181)"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>

    </div>
</template>

<script>
import firebase from 'firebase'
import Datepicker from 'vuejs-datepicker'

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
            this.$router.push({ name: 'MyCV' })
        }
    }
}
</script>

<style>
a {
    color: rgb(0,161,181);
}
b-button {
    margin-right: 2em;
}
.button-group {
    margin-top: 1.5em;
    margin-bottom: 2em;
}
.button-span {
    margin-right: 1em;
}
</style>
