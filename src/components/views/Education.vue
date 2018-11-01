<template>
    <div class="container">
        <slot>
        <div>
            <h4 class="g-title">Utdanning og kurs</h4>
            <p style="font-style: italic">Hvilke skole har du gått på? Har du tatt noe kurs på jobb, skole eller fritid?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="school"><strong>Nav på skole/kurs</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="employer" type="text" v-model="form.school" required />
                    </div>
                    <div class="col">
                        <label for="place"><strong>Navn på studie</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="place" placeholder="" v-model="form.study" required/>
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <div class="g-m2 form-row">
                    <b-form-group class="col-md-3">
                        <label for="fromMonth"><strong>Fra</strong></label>
                        <b-form-select id="fromMonth" class="mb-3" :options="months" v-model="from.month" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="fromYear" style="color: white">(år) </label>
                        <b-form-input id="fromYear" type="number" placeholder="Årstall" v-model="from.year" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toMonth"><strong>Til</strong></label>
                        <b-form-select class="mb-3" :options="months" v-model="to.month" />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toYear" style="color: white">(år) </label>
                        <b-form-input  type="number" id="toYear" placeholder="Årstall" v-model="to.year" />
                    </b-form-group>
                </div>
            </b-form-group>

            <b-form-group class="">
                <b-form-checkbox v-model="form.ongoing">Jeg går her nå</b-form-checkbox>
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
        </slot>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Education',
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
                school: null,
                study: null,
                from: null,
                to: null,
                ongoing: false,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null
            },
            user: null,
            cert_id: null,
            edu_id: null,
            reason: 'updeducation'
        }

    },
    props: ['cid', 'id'],
    components: {

    },
    methods: {
        cancel() {
            console.log("cancel")
            this.$router.go(-1)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user.uid 
                this.form.cert_id = this.$route.params.id
                this.form.timestamp = Date.now()
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                } catch (error) {
                    console.log('update excception: ', error)
                }
                if (this.edu_id) {
                    db.collection('education').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            conssole.log('Education updated')
                        })
                    .catch(error => {
                        console.log('Firestore error: ', error)
                    })
                } else {
                    db.collection('education').add(this.form)
                    .then ((doc) => {
                        conssole.log('Education added')
                        this.edu_id = doc.id
                     })
                    .catch(error => {
                        console.log('Firestore error: ', error)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
            this.$emit(reason, this.edu_id)
            this.$router.back()
        }
    },
    created() {
        this.form.cert_id  = this.cid ? this.cid : this.$route.params.cid
        this.edu_id = this.id ? this.id : this.$route.params.id
        this.user = firebase.auth().currentUser
        if (this.user && this.edu_id) {
            // get object
            ref = db.collection('education').doc(this.edu_id)
            ref.get().
            then (doc => {
                if(doc.exists) {
                    this.form = doc.data()
                }
            })
        }            
    }
}
</script>

<style>
.g-title {
    margin-top: 2em;
    margin-bottom: 0em;
}
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
