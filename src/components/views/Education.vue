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
            
            <upload-media :uid="user_id" :cid="cert_id" :media="media" :links="links"> </upload-media>
 
            <media-list :media="media" :links="links" :uid="user_id" :cid="cert_id"></media-list>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" class="gb-link"><strong>Avbyt</strong></b-link>
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
                year: null,
                ongoing: false
            },
            user: null,
            user_id: null,
            cert_id: null,
            e_id: null,
            disableWrite: false,
            reason: 'onUpdatedEducation'
        }
    },
    watch: {
        id(newId, oldId) {
            console.log('education watch', this.id, newId, oldId)
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
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                    this.form.ongoing = this.to.ongoing
                } catch (error) {
                    console.error('update excception: ', error)
                    alert(error)
                }

                if (this.e_id) {
                    db.collection("education").doc(this.e_id).set(this.form, {merge: true})
                    .then(() => {
                        this.updateMedia()
                        this.updateLinks()
                        console.log("education updated", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding education", error);
                        alert(error)
                        this.cancel()
                    });
                } else {
                    this.form.user_id = this.user_id 
                    this.form.cert_id = this.cert_id 
                    db.collection("education").add(this.form)
                    .then((doc) => {
                        this.updateMedia()
                        this.updateLinks()
                        this.e_id = doc.id
                        console.log("education added ", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding education", error);
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
                db.collection('education').doc(this.e_id)
                .get()
                .then ((doc) => {
                    if(doc.exists) {
                        this.form = doc.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        if (this.form.to) {
                            this.to.month = getMonth(this.form.to)
                            this.to.year = getYear(this.form.to)
                        }
                        this.to.ongoing = this.form.ongoing
                        this.user_id = this.form.user_id
                        this.cert_id = this.form.cert_id
                        this.form.id = doc.id
                        this.fetchMedia()
                        this.fetchLinks()
                        console.log('education fetched ok')
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
            console.log('education created:', this.cert_id, this.e_id)
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
