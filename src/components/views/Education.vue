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

            <b-form-group class="g-group">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>

            <from-to @onFromTo="onFromTo" :from="from" :to="to" :ongoing="form.ongoing" :ongoingText="'Jeg går her nå'"></from-to>
            
            <!-- <upload-file v-on:input="onMedia" :uid="User_id" :cid="form.cert_id"></upload-file> -->
            <image-uploader v-on:input="onMedia" :uid="user_id" :cid="form.cert_id"> </image-uploader>
 
            <ul class="list-unstyled" style="margin-top: 1em">
                <b-media tag="li" v-for="item in media" :key="item.url" style="margin-bottom: 0.5em">
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
import moment from 'moment'
import UploadFile from '@/components/common/UploadFile'
import ImageUploader from '@/components/common/ImageUploader'
import FromTo from '@/components/common/FromTo'


export default {
    name: 'Education',
    components: {
        'from-to': FromTo,
        'upload-file': UploadFile,
        'image-uploader': ImageUploader
    },
    props: ['school', 'cid', 'id'],
    data() {
        return {
            months: [
                { value: null, text: 'Velg en måned' },
                { value: '01', text: 'januar' },
                { value: '02', text: 'februar' },
                { value: '03', text: 'mars' },
                { value: '04', text: 'april' },
                { value: '05', text: 'mai' },
                { value: '06', text: 'juni' },
                { value: '07', text: 'juli' },
                { value: '08', text: 'august' },
                { value: '09', text: 'september' },
                { value: '10', text: 'oktober' },
                { value: '11', text: 'november' },
                { value: '12', text: 'desember' }
            ],
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
            reason: 'updeducation'
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
        onFromTo(from, to, ongoing) {
            console.log('onFromTo', this.from, this.to)
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
            if (this.user_id) {
                this.form.user_id = this.user_id 
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
                        console.log("Document updated with ID: ", this.wid);
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
        fetchData() {
            if (this.edu_id) {
                console.log('edu get object', this.edu_id)
                // get object
                db.collection('education').doc(this.edu_id)
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
    mounted() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.form.cert_id  = this.cid
        this.edu_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        this.fetchData()
        console.log('edu mounted:', this.we_id)
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
.button-group {
    margin-top: 1.5em;
    margin-bottom: 0em;
}
.button-span {
    margin-right: 1em;
}
.g-span {
    margin-right: 1em;
}

</style>
