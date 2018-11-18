<template>
    <div class="component">
        <div>
            <h4 class="g-title">Språk</h4>
            <p style="font-style: italic">Hvilke språk kan du snakke?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <label for="school"><strong>Språk</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="employer" type="text" v-model="form.language" required />
            </b-form-group>

            <b-form-group class="g-header">
                <label for="place"><strong>Hvor godt snakker du språket?</strong></label>
                <b-form-select id="fromMonth" class="mb-3" :options="proficiency" v-model="form.proficiency" required />
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" 
                    placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <upload-media :parent="'lang'" :uid="user_id" :cid="cert_id" :media="media" :links="links"> </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id"></media-list>

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
import MediaList from '@/components/common/MediaList'

export default {
    name: 'Education',
    components: {
        UploadMedia,
        MediaList
    },
    props: ['cid', 'id'],
    data() {
        return {
            proficiency: [
                { value: null, text: 'Velg ferdighetsnivå' },
                { value: 'Begrenset', text: 'Begrenset' },
                { value: 'Profesjonelt', text: 'Profesjonelt' },
                { value: 'Innfødt og tospråklig', text: 'Innfødt og tospråklig' }
            ],
            form: {
                language: null,
                proficiency: null,
                description: null,
                user_id: null,
                cert_id: null,
                timestamp: null
            },
            media: [],
            links: [],
            user: null,
            user_id: null,
            cert_id: null,
            e_id: null,
            reason: 'onUpdatedLanguage'
        }
    },
    watch: {
        id(newId, oldId) {
            console.log('languages watch', this.id, newId, oldId)
            this.e_id = this.id
            this.init()
        }
    },
    computed: {

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
                    db.collection("languages").doc(this.e_id).set(this.form, {merge: true})
                    .then(() => {
                        this.updateMedia()
                        this.updateLinks()
                        console.log("languages updated", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding languages", error);
                        alert(error)
                        this.cancel()
                    });
                } else {
                    this.form.user_id = this.user_id 
                    this.form.cert_id = this.cert_id 
                    db.collection("languages").add(this.form)
                    .then((doc) => {
                        this.updateMedia()
                        this.updateLinks()
                        console.log("education added ", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding languages", error);
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
                db.collection('languages').doc(this.e_id)
                .get()
                .then ((doc) => {
                    if(doc.exists) {
                        this.form = doc.data()
                        this.fetchMedia()
                        this.fetchLinks()
                        console.log('languages fetched ok')
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
            this.user = firebase.auth().currentUser
            if (this.cid != undefined)
                this.cert_id  = this.cid
            if (this.id != undefined)
                this.e_id  = this.id
            if (this.uid != undefined) {
                this.user_id = this.uid
            } else {
                this.user_id = this.user.uid
            }
            console.log('languages created:', this.cert_id, this.e_id)
            this.fetchData()
        }
    },
    created() {
        this.init()
    }
}
</script>

<style>
a {
    color: rgb(0,161,181);
}
a:hover {
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
