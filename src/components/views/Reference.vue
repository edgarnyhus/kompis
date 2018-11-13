<template>
    <div class="container">
        <slot>
        <div v-if="this.$route.params.show == 'training'">
            <h4  class="g-title">Kontaktperson</h4>
            <p style="font-style: italic">Hvem var din kontaktperson på praksisstedet?</p>
        </div>
        <div v-else>
            <h4  class="g-title">Referanse</h4>
            <p style="font-style: italic">Hvilken person kan potensielle arbeidsgivere kontakte for å bli bedre kjent med deg? Husk å be om tilatelse!</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <label for="person"><strong>Referanseperson</strong> </label>
                <b-form-input id="person" v-model="form.person" />
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder="Hva gjelder denne referansen?"
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <b-form-group>
                <p><strong>Dokumentasjon</strong></p>
                <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
                <div class="button-group">
                    <b-button class="button-span" variant="light">Last opp</b-button>
                    <b-button variant="light">Lenke</b-button>
                </div>
            </b-form-group>

            <b-form-group>
                <p><strong>Bekreftelse</strong></p>
                <p>Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <div class="button-group">
                    <b-button variant="light">Spør</b-button>
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
    name: 'Reference',
    data() {
        return {
            competences: [
                { value: null, text: 'Velg en nøkkelkompetanse' },
                { value: 'Punktlig', text: 'Punktlig' },
                { value: 'Tar initiativ', text: 'Tar initiativ' },
                { value: 'Loyal', text: 'Loyal' },
                { value: 'Ansvarlig', text: 'Ansvarlig' }
            ],
            form: {
                person: null,
                description: null,
                confirmation: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            user: null,
            ref_id: null,
            reason: 'updref'
        }

    },
    props: ['cid', 'id'],
    components: {

    },
    methods: {
        cancel() {
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user.uid 
                this.form.timestamp = Date.now()
                if (this.$route.params.id) {
                    db.collection('references').doc(this.$route.params.id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        conssole.log('Work experience updated')
                        this.$emit(this.reason, this.ref_id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    db.collection('references').add(
                        this.form)
                    .then (doc => {
                        conssole.log('Work experience added')
                        this.ref_id = doc.id
                        this.$emit(this.reason, this.ref_id)
                     })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
        }
    },
    created() {
        this.user = firebase.auth().currentUser
        this.form.cert_id  = this.cid
        this.ref_id = this.id
        // this.fetchData()
        if (this.user && this.ref_id) {
            // get object
            db.collection('references').doc(this.ref_id)
            .get()
            .then (doc => {
                if(doc.exists) {
                    this.form = doc.data()
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
