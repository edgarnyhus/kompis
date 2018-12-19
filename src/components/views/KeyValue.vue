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
            
            <upload-media :parent="'kv'" :uid="user_id" :cid="cert_id" :media="media" :links="links"> </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id"></media-list>

            <div class="my-3">
                <p class="g-header"><strong >Bekreftelse</strong></p>
                <p >Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <b-btn variant="light" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">
                    Spør
                </b-btn>
            </div>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" class="gb-link"><strong>Avbyt</strong></b-link>
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
            e_id: null,
            reason: 'onUpdatedKeyValue'
        }
    },
    watch: {
        id(newId, oldId) {
            console.log('keyvalues watch', this.id, newId, oldId)
            this.e_id = this.id
            this.init()
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
            this.media = []
            this.links = []
        },
        destroy() {
        //   this.$destroy();
        },    
        cancel() {
            this.$emit(this.reason, null)
            this.destroy()
        },
        update() {
            if (this.user_id) {
                this.form.timestamp = Date.now()
                if (this.e_id) {
                    db.collection("keyvalues").doc(this.e_id).set(this.form, {merge: true})
                    .then(() => {
                        this.updateMedia()
                        this.updateLinks()
                        console.log("keyvalues updated", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding keyvalues", error);
                        alert(error)
                        this.cancel()
                    });
                } else {
                    this.form.user_id = this.user_id 
                    this.form.cert_id = this.cert_id 
                    db.collection("keyvalues").add(this.form)
                    .then((doc) => {
                        this.updateMedia()
                        this.updateLinks()
                        this.e_id = doc.id
                        console.log("education added ", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding keyvalues", error);
                        alert(error)
                        this.cancel()
                    });
                }
            }
            else {
                console.info('User not logged in???')
            }
            this.destroy()
        },
        updateMedia() {
            this.media.forEach(element => {
                let item = {filename: element.filename, url: element.url, type: element.type, description: element.description,
                        user_id: this.user_id, cert_id: this.cert_id, parent_id: this.e_id, timestamp: Date.now()}
                if (element.id) {
                    db.collection("media").doc(element.id).set(item, {merge: true})
                    .then(() => {
                        console.log("media updated with ID: ", element.id);
                    })
                    .catch((error) => {
                        console.error("error adding media: ", error);
                        alert(error)
                    });
                } else {
                    db.collection("media").add(item)
                    .then((doc) => {
                        console.log("media written with ID: ", doc.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        alert(error)
                    });
                }
            });
        },
        updateLinks() {
            this.links.forEach(element => {
                let item = {name: element.name, url: element.url, description: element.description,
                        user_id: this.user_id, cert_id: this.cert_id, parent_id: this.e_id, timestamp: Date.now()}
                if (element.id) {
                    db.collection("links").doc(element.id).set(item, {merge: true})
                    .then(() => {
                        console.log("links updated", element.id);
                    })
                    .catch((error) => {
                        console.error("error adding link", error);
                        alert(error)
                    });
                } else {
                    db.collection("links").add(item)
                    .then((doc) => {
                        console.log("links added", doc.id);
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
                db.collection('media').where('parent_id', '==', this.e_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.media.push(elem)
                        console.log('maedia fetched', doc.id)
                    })
                })
                .catch(error=> {
                    console.log('fetching media failed', error)
                    alert(error)
                })
            }
        },
        fetchLinks() {
            if (this.e_id) {
                db.collection('links').where('parent_id', '==', this.e_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.links.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('fetching links failed', error)
                    alert(error)
                })
            }
        },
        fetchData() {
            if (this.e_id) {
                console.log('we get object', this.e_id)
                db.collection('keyvalues').doc(this.e_id)
                .get()
                .then ((doc) => {
                    if(doc.exists) {
                        this.form = doc.data()
                        this.fetchMedia()
                        this.fetchLinks()
                        console.log('keyvalues fetched ok')
                    }
                })
                .catch((error) => {
                    console.error("error fetching document: ", error);
                    alert('Henting av data feiletń' + error)
                })
            }
        },
        init() {
            this.reset()
            if (this.cid != undefined) 
                this.cert_id  = this.cid
            if (!this.cert_id)
                this.cert_id = this.$route.params.cid
            if (this.id != undefined) 
                this.e_id  = this.id
            if (!this.e_id)
                this.e_id = this.$route.params.id
            if (this.uid != undefined)
                this.user_id = this.uid
            if (!this.user_id)
                this.user_id = this.$route.params.uid
            if (!this.user_id)
                this.user_id = firebase.auth().currentUser.uid
            this.fetchData()
        }
    },
    created() {
        this.init()
    }
}
</script>

<style>

</style>
