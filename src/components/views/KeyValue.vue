<template>
    <div class="component" style="margin: 1em">
        <div>
            <h4 class="g-title page-title">Nøkkelkompetanse</h4>
            <p style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group class="g-group">
                <div class="input-group mb-3">
                    <!-- <div class="input-group-prepend">
                        <b-dropdown id="skill" text="Nøkkelkompetanse" class="mr-sm-2 mb-sm-0">
                            <b-dropdown-item-button @click="form.key_value = 'Pålitelig'">Pålitelig</b-dropdown-item-button>
                            <b-dropdown-item-button @click="form.key_value = 'Tar initiativ'">Tar initiativ</b-dropdown-item-button>
                            <b-dropdown-item-button @click="form.key_value = 'Loyal'">Loyal</b-dropdown-item-button>
                            <b-dropdown-item-button @click="form.key_value = 'Ansvarlig'">Ansvarlig</b-dropdown-item-button>
                        </b-dropdown>
                    </div> -->
                    <input type="text" class="form-control" placeholder="Nøkkelkompetanse (f.eks. Pålitelig eller Tar initiativ)" v-model="form.key_value" required>
                </div>
            </b-form-group>

            <b-form-group class="g-group">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder="Hvordan kommer denne nøkkelkompetansen til uttrykk?"
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <image-uploader v-on:input="onMedia" :parent="'edu'" :uid="user_id" :cid="form.cert_id"> </image-uploader>
 
            <ul class="list-unstyled" style="margin-top: 1em">
                <b-media tag="li" v-for="item in media" :key="item.url" style="margin-bottom: 0.5em">
                    <!-- <b-img :src="elem.url" rounded slot="aside" width="64" height="64" style="padding-top: 0"/> -->
                    <img :src="item.url" @click="showFile(item)" rounded slot="aside" class="mg-thumbnail" width="92" height="92" :alt="item.filename" style="padding-top: 0">
                    <!-- <p class="mt-0 mb-1"><strong>Kommentar</strong></p> -->
                    <p style="margin-bottom: 5px">{{ item.filename }}</p>
                    <b-form-textarea id="mdesc" v-model="item.description" placeholder="Beskriv litt om hva dette handler om." :rows="2" :max-rows="8">
                    </b-form-textarea>
                </b-media>
            </ul>

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
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ImageUploader from '@/components/common/ImageUploader'
import FromTo from '@/components/common/FromTo'

export default {
    name: 'KeyValue',
    components: {
        'from-to': FromTo,
        'image-uploader': ImageUploader
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
                key_value: null,
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
        onMedia(formData) {
            if (formData) {
                const file = formData.get('media')
                let elem = { filename: file.name, type: file.type, url: formData.get('url') }
                console.log('onMedia', elem)
                // this.form.media.push(elem)
                this.media.push(elem)
            }
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user.uid 
                this.form.cert_id = this.cert_id
                this.form.timestamp = Date.now()
                if (this.kv_id) {
                    db.collection('keyvalues').doc(this.kv_id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            conssole.log('Key value updated')
                            this.$emit(this.reason, this.kv_id)
                        })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    db.collection('keyvalues').add(
                        this.form)
                    .then (doc => {
                        conssole.log('Key value added')
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
        fetchData() {
            if (this.kv_id) {
                // get object
                db.collection('keyvalues').doc(this.kv_id)
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

        this.fetchData()
    }
}
</script>

<style>
.g-title {
    margin-top: 0;
    margin-bottom: 0;
}
.g-group {
    margin-top: 0;
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
.button-group-span {
    border-radius: 25px;
    margin-right: 0.3em;
}
</style>
