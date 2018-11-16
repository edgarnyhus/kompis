<template>
    <div class="component">
        <div>
            <h4 class="g-title">Nøkkelkompetanse</h4>
            <p style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Nøkkelkompetanse (f.eks. Pålitelig eller Tar initiativ)" v-model="form.keyvalue" required>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description"
                                placeholder="Hvordan kommer denne nøkkelkompetansen til uttrykk?"
                                :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <upload-media :parent="'edu'" :uid="user_id" :cid="form.cert_id"> </upload-media>
 
            <media-list :media="media" :links="links"></media-list>

            <b-form-group>
                <p class="g-header"><strong>Bekreftelse</strong></p>
                <p>Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <div class="">
                    <b-button variant="light">Spør</b-button>
                </div>
            </b-form-group>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="foreground-color: rgb(0,161,181)"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import UploadMedia from '@/components/common/UploadMedia'
import FromTo from '@/components/common/FromTo'
import MediaList from '@/components/common/MediaList'

export default {
    name: 'KeyValue',
    components: {
        FromTo,
        UploadMedia,
        MediaList
    },
    props: ['uid', 'cid', 'id'],
    data() {
        return {
            values: [
                { value: null, text: 'Velg en nøkkelkompetanse' },
                { value: 'Punktlig', text: 'Punktlig' },
                { value: 'Tar initiativ', text: 'Tar initiativ' },
                { value: 'Loyal', text: 'Loyal' },
                { value: 'Ansvarlig', text: 'Ansvarlig' }
            ],
            form: {
                keyvalue: null,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            media: [],
            links: [],
            user_id: null,
            cert_id: null,
            kv_id: null,
            reason: 'onUpdatedKeyValue',
            user: null
        }
    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        cancel() {
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user.uid 
                this.form.cert_id = this.cert_id
                this.form.timestamp = Date.now()
                if (this.kv_id) {
                    console.log('db.set', this.form)
                    db.collection('keyvalues').doc(this.kv_id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            console.log('Key value updated')
                            this.$emit(this.reason, this.kv_id)
                        })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    console.log('db.add', this.form)
                    db.collection('keyvalues').add(
                        this.form)
                    .then (doc => {
                        console.log('Key value added')
                        this.kv_id = doc.id
                        this.$emit(this.reason, this.kv_id)
                     })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
        },
        fetchData(id) {
            if (id) {
                // get object
                db.collection('keyvalues').doc(id)
                .get()
                .then ((docRef) => {
                    if(docRef.exists) {
                        this.form = docRef.data()
                    }
                })
                .catch((error) => {
                    console.error("WE Error fetching document: ", error);
                });
            }            
        }

    },
    mounted() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.cert_id  = this.cid
        this.kv_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }

        this.fetchData(this.kv_id)
    }
}
</script>

<style>
a {
    color: rgb(0,161,181);
}
.g-title {
    margin-top: 0;
    margin-bottom: 0;
}
.g-header {
    margin-bottom: 0;
}
.g-group {
    margin-top: 2em;
}
.g-span {
    margin-right: 1em;
}
</style>
