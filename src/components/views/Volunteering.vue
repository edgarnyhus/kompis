<template>
    <div class="component" style="margin: 1em">
        <div>
            <h4 class="g-title">Frivillig arbeid</h4>
            <p style="font-style: italic">Hvilke frivillig verv har du tatt på deg?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="org"><strong>Navn på organisasjon</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="org" type="text" v-model="form.org" required />
                    </div>
                    <div class="col">
                        <label for="loc"><strong>Sted</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="loc" placeholder="" v-model="form.location" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group class="g-group">
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
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
            
            <from-to @onFromTo="onFromTo" :from="from" :to="to" :ongoing="form.ongoing" :ongoingText="'Jeg har det vervet nå'"></from-to>

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

export default {
    name: 'Volunteering',
    components: {

    },
    props: ['uid', 'cid', 'id'],
    data() {
        return {
            form: {
                org: null,
                location: null,
                role: null,
                from: null,
                to: null,
                ongoing: false,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            media: [],
            links: [],
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null
            },
            user: null,
            v_id: null,
            reason: 'onUpdatedVolunteering'
        }

    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        cancel() {
            console.log("cancel")
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_id 
                this.form.timestamp = Date.now()
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                } catch (error) {
                    console.log('update excception: ' + error)
                }
                if (this.v_id) {
                    db.collection('volunteering').doc(this.v_id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        conssole.log('Volunteering updated')
                        this.$emit(this.reason, this.v_id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                } else {
                    db.collection('volunteering').add(this.form)
                    .then (doc => {
                        conssole.log('Education added')
                        this.v_id = doc.id
                        this.$emit(this.reason, this.v_id)
                     })
                    .catch(err => {
                        console.log('Firestore error: ' + err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
        },
        fetchData() {
            if (this.v_id) {
                // get object
                db.collection('volunteering').doc(this.v_id)
                .get()
                .then ((docRef) => {
                    if(docRef.exists) {
                        this.form = docRef.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        this.to.month = getMonth(this.form.to)
                        this.to.year = getYear(this.form.to)
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
        this.v_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        this.fetchData()
        console.log('vol mounted:', this.v_id)
    }
}
</script>

<style>
.g-title {
    margin-top: 0;
    margin-bottom: 0;
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
