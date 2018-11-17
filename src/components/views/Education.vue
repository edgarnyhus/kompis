<template>
    <div class="component">
        <slot>
        <div>
            <h4 class="g-title">Utdanning og kurs</h4>
            <p style="font-style: italic">Hvilke skole har du gått på? Har du tatt noe kurs på jobb, skole eller fritid?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="form-row">
                    <div class="col">
                        <label for="school"><strong>Navn på skole/kurs</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="employer" type="text" v-model="form.school" required />
                    </div>
                    <div class="col">
                        <label for="place"><strong>Navn på studie</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="place" placeholder="" v-model="form.study" required/>
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>

            <from-to :from="from" :to="to" :ongoing="form.ongoing" :ongoingText="'Jeg går her nå'"></from-to>
            
            <upload-media :media="media" :uid="user_id" :cid="cert_id"> </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id"></media-list>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="foreground-color: rgb(0,161,181)"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>
            
        </slot>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import UploadMedia from '@/components/common/UploadMedia'
import FromTo from '@/components/common/FromTo'
import MediaList from '@/components/common/MediaList'


export default {
    name: 'Education',
    components: {
        FromTo,
        UploadMedia,
        MediaList
    },
    props: ['uid', 'cid', 'id'],
    data() {
        return {
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
            user_id: null,
            cert_id: null,
            // edu_id: null,
            disableWrite: false,
            reason: 'onUpdatedEducation'
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
            console.log("cancel")
            this.$emit(this.reason, null)
        },
        update() {
            if (this.user_id) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_id 
                this.form.timestamp = Date.now()
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                } catch (error) {
                    console.log('update excception: ', error)
                    alert(error)
                }
                if (this.id) {
                    db.collection("education").doc(this.id).set(this.form, {merge: true})
                    .then((docRef) => {
                        this.updateMedia()
                        this.updateLiinks()
                        console.log("Document updated with ID: ", this.id);
                        this.$emit(this.reason, this.id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        alert(error)
                    });
                } else {
                    db.collection("education").add(this.form)
                    .then((docRef) => {
                        this.updateMedia()
                        this.updateLiinks()
                        console.log("Document written with ID: ", docRef.id);
                        this.id = docRef.id
                        this.$emit(this.reason, this.id)
ˍ                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        alert(error)
                    });
                }
            }
            else {
                console.log('User not logged in???')
                alert(error)
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
                        console.error("error updating media: ", error);
                        alert(error)
                    });
                } else {
                    db.collection("media").add(item)
                    .then((docRef) => {
                        console.log("media added", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding media", error);
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
                        console.error("error updating link", error);
                        alert(error)
                    });
                } else {
                    db.collection("links").add(item)
                    .then((docRef) => {
                        console.log("links added", docRef.id);
                    })
                    .catch((error) => {
                        console.error("error adding links", error);
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
                    this.fetchMedia()
                    this.fetchLinks()
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
                db.collection('education').doc(this.id)
                .get()
                .then ((docRef) => {
                    if(docRef.exists) {
                        this.form = docRef.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        this.to.month = getMonth(this.form.to)
                        this.to.year = getYear(this.form.to)
                        this.user_id = this.form.user_id
                        this.cert_id = this.form.cert_id
                        this.id = docRef.id
                        this.fetchMedia()
                        this.fetchLinks()
                        console.log('education fetched ok')
                    }
                })
                .catch((error) => {
                    console.error("error fetching document: ", error);
                    alert('Henting av data feilet\n' + error.message)
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
                    console.log('fetching media failed', err)
                    alert(error)
                })
            }
        }
    },
    created() {
        this.reset()
        this.user = firebase.auth().currentUser
        if (this.cid)
            this.form.cert_id  = this.cid
        // if (this.id)
        //     this.edu_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        this.fetchData()
        console.log('education created ok')
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
