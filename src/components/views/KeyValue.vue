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
            
            <upload-media :parent="'edu'" :uid="user_id" :cid="cert_id"> </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id"></media-list>

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
            reason: 'onUpdatedKeyValue',
            user: null
        }
    },
    watch: {
        id() {
            console.log('education watch', this.id)
            this.fetchData()
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
                if (this.id) {
                    db.collection('keyvalues').doc(this.id).set(
                        this.form, { merge: true })
                        .then (doc => {
                            console.log('Key value updated')
                            this.$emit(this.reason, this.id)
                        })
                    .catch(error => {
                        console.log('Firestore error: ', error)
                        alert(error)
                    })
                } else {
                    console.log('db.add', this.form)
                    db.collection('keyvalues').add(
                        this.form)
                    .then (doc => {
                        console.log('Key value added')
                        this.id = doc.id
                        this.$emit(this.reason, this.id)
                     })
                    .catch(error => {
                        console.log('Firestore error: ', error)
                        alert(error)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
        },
        updateMedia() {
            this.media.forEach(element => {
                let item = {filename: element.filename, url: element.url, type: element.type, description: element.description,
                        user_id: this.user_id, cert_id: this.cert_id, timestamp: Date.now()}
                if (element.id) {
                    db.collection("media").doc(element.id).set(item, {merge: true})
                    .then((docRef) => {
                        console.log("media updated with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        this.updateMedia()
                        this.updateLiinks()
                        console.error("error adding media: ", error);
                        alert(error)
                    });
                } else {
                    db.collection("media").add(item)
                    .then((docRef) => {
                        this.updateMedia()
                        this.updateLiinks()
                        console.log("media added", docRef.id);
                        this.id = docRef.id
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        alert(error)
                    });
                }
            });
        },
        updateLinks() {
            this.media.forEach(element => {
                let item = {name: element.name, url: element.url, description: element.description,
                        user_id: this.user_id, cert_id: this.cert_id, timestamp: Date.now()}
                if (element.id) {
                    db.collection("links").doc(element.id).set(item, {merge: true})
                    .then((docRef) => {
                        console.log("links updated", docRef.id);
                    })
                    .catch((error) => {
                        console.error("error adding link", error);
                        alert(error)
                    });
                } else {
                    db.collection("links").add(item)
                    .then((docRef) => {
                        console.log("links added", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding links", error);
                        alert(error)
                    })
                }
            });
        },
        fetchMedia() {
            if (this.user_id) {
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('media').where('cert_i', '==',this.cert_id)
                 } else {
                    ref = db.collection('media').where('user_id', '==',this.user_id)
                 }   
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.media.push(elem)
                    })
                })
                .catch(err => {
                    console.log('fetching media failed', err)
                    alert(error)
                })
            }
        },
        fetchLinks() {
            if (this.user_id) {
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('links').where('cert_i', '==',this.cert_id)
                 } else {
                    ref = db.collection('links').where('user_id', '==',this.user_id)
                 }   
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.links.push(elem)
                    })
                })
                .catch(err => {
                    console.log('fetching links failed', err)
                    alert(error)
                })
            }
        },
        fetchData() {
            if (this.id) {
                console.log('we get object', this.id)
                // get object
                db.collection('keyvalues').doc(this.id)
                .get()
                .then ((docRef) => {
                    if(docRef.exists) {
                        this.form = docRef.data()
                        this.user_id = this.form.user_id
                        this.cert_id = this.form.cert_id
                        this.fetchMedia()
                        this.fetchLinks()
                        console.log('keyvalue fetched ok')
                    }
                })
                .catch((error) => {
                    console.error("error fetching keyvalue", error);
                    alert('Henting av data feilet\n' + error.message)
                })
            }
        }
    },
    created() {
        this.reset()
        this.user = firebase.auth().currentUser
        if (this.cid)
            this.cert_id  = this.cid
        if (this.id)
            this.id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }

        this.fetchData()
        console.log('keyvalue created ok')
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
