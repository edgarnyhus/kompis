<template>
    <div class="component" style="margin: 1em">
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
            
            <upload-media :uid="user_id" :cid="form.cert_id"> </upload-media>
 
            <media-list :media="media" :links="links"></media-list>

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
            edu_id: null,
            disableWrite: false,
            reason: 'onUpdatedEducation'
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
                }
                if (this.edu_id) {
                    db.collection("education").doc(this.edu_id).set(this.form, {merge: true})
                    .then((docRef) => {
                        console.log("Document updated with ID: ", this.edu_id);
                        this.$emit(this.reason, this.edu_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("education").add(this.form)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        this.edu_id = docRef.id
                        this.$emit(this.reason, this.edu_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            }
            else {
                console.log('User not logged in???')
            }
        },
        fetchData(id) {
            if (id) {
                console.log('edu get object', id)
                // get object
                db.collection('education').doc(id)
                .get()
                .then ((docRef) => {
                    if(docRef.exists) {
                        this.form = docRef.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        this.to.month = getMonth(this.form.to)
                        this.to.year = getYear(this.form.to)
                        // this.media = this.form.media
                        // this.links = this.form.links
                    }
                })
                .catch((error) => {
                    console.error("edu error fetching document: ", error);
                });
            }
        }
    },
    created() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.form.cert_id  = this.cid
        this.edu_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        this.fetchData(this.edu_id)
        console.log('edu mounted:', this.we_id)
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
