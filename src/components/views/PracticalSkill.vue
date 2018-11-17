<template>
    <div class="component">
        <div>
            <h4 class="g-title">Praktisk ferdighet</h4>
            <p style="font-style: italic">Hva er dine praktiske evner? Noe du har lært på skole eller i jobb?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Praktisk ferdighet (f.eks.Varepåfylling eller Murerarbeid)" v-model="form.skill" required>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description"
                                placeholder="Hvordan kommer denne ferdigheten til uttrykk?"
                                :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <upload-media :parent="'skill'" :uid="user_id" :cid="cert_id"> </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id"></media-list>

            <b-form-group>
                <p class="g-header"><strong>Bekreftelse</strong></p>
                <p>Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <div class="button-group">
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
    name: 'PracticalSkill',
    components: {
        FromTo,
        UploadMedia,
        MediaList
    },
    props: ['uid', 'cid', 'id'],
    data() {
        return {
            skills: [
                { value: null, text: 'Velg en praktisk ferdighet' },
                { value: 'Varepåfylling', text: 'Varepåfylling' },
                { value: 'Murerarbreid', text: 'Murerarbreid' }
            ],
            form: {
                skill: null,
                level: null,
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
            reason: 'onUpdatedSkill',
            user: null
        }

    },
    watch: {
        id() {
            console.log('lamgiage watch', this.id)
            this.fetchData()
        }
    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
        },
        setSkill(value) {
            this.form.skill = value
        },
        cancel() {
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_ud 
                this.form.timestamp = Date.now()
                if (this.id) {
                    db.collection('skills').doc(this.id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        this.updateMedia()
                        this.updateLiinks()
                        console.log('Work experience updated')
                        this.$emit(this.reason, this.id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                        alert(error)
                    })
                } else {
                    db.collection('skills').add(
                        this.form)
                    .then (doc => {
                        this.updateMedia()
                        this.updateLiinks()
                        console.log('Work experience added')
                        this.id = doc.id
                        this.$emit(this.reason, this.id)
                     })
                    .catch(err => {
                        console.log('Firestore error: ', err)
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
                        console.error("error adding media: ", error);
                        alert(error)
                    });
                } else {
                    db.collection("media").add(item)
                    .then((docRef) => {
                        console.log("media written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        alert(error)
                    });
                }
            });
        },
        updateLiinks() {
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
            console.log('experience created ok')
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
            console.log('experience created ok')
        },
        fetchData() {
            if (this.id) {
                // get object
                db.collection('skills').doc(this.id)
                .get()
                .then (doc => {
                    if(doc.exists) {
                        this.form = doc.data()
                        this.user_id = this.form.user_id
                        this.cert_id = this.form.cert_id
                        console.log('skill fetched ok')
                    }
                })
                .catch(err => {
                    console.log('Firestore error: ', err)
                    alert(error)
                })
            }
        }            
    },
    created() {
        this.reset()
        this.user = firebase.auth().currentUser
        if (this.cid)
            this.cert_id  = this.cid
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }

        this.fetchData()
        console.log('skill created ok')
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
