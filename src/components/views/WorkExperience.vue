<template>
    <div class="component" style="margin: 1em">
        <!-- <slot> -->
        <div v-if="this.show == 'training'">
            <h4  class="g-title">Praksissted</h4>
            <p style="font-style: italic">Hvor har du vært i praksis?</p>
        </div>
        <div v-else>
            <h4  class="g-title">Arbeidserfaring</h4>
            <p style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
        </div>

        <b-form @submit.prevent="addOrUpdate">
            <b-form-group v-if="show == 'training'" style="font-weight: 650" label="Type arbeid">
                <b-form-radio-group style="font-weight: 400" v-model="form.job_type"
                                    :options="job_types"
                                    stacked
                                    name="where">
                </b-form-radio-group>
            </b-form-group>

            <b-form-group class="g-group">
                <div class="form-row">
                    <div class="col">
                        <label for="employer"><strong>Arbeidsgiver</strong></label>
                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0" :disabled="disableWrite" id="employer" placeholder="" v-model="form.employer" />
                    </div>
                    <div class="col">
                        <label for="place"><strong>Sted</strong></label>
                        <b-input class="mb-2 mr-sm-2 mb-sm-0" id="place" placeholder="" v-model="form.location" />
                    </div>
                </div>
            </b-form-group>

            <b-form-group class="g-group">
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
            </b-form-group>

            <b-form-group>
                <!-- <div class="form-row">
                    <div class="form-group col-md-6">
                        <label><strong>Fra</strong></label>
                        <b-input type='date' :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></b-input>
                    </div>
                    <div class="form-group col-md-6">
                        <label><strong>Til</strong></label>
                        <b-input type='date' :bootstrap-styling=true :typeable=true format="MMMM yyyy" v-model="date"></b-input>
                    </div>
                </div> -->

                <div class="g-m2 form-row">
                    <b-form-group class="col-md-3">
                        <label for="fromMonth"><strong>Fra</strong></label>
                        <b-form-select id="fromMonth" class="mb-3" :options="months" v-model="from.month" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="fromYear" style="color: white">(år) </label>
                        <b-form-input id="fromYear" type="number" placeholder="Fra hvilket år?" v-model="from.year" required />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toMonth"><strong>Til</strong></label>
                        <b-form-select class="mb-3" :options="months" v-model="to.month" />
                    </b-form-group>
                    <b-form-group class="col-md-3">
                        <label for="toYear" style="color: white">(år) </label>
                        <b-form-input  type="number" id="toYear" placeholder="Til hvilket år?" v-model="to.year" />
                    </b-form-group>
                </div>
            </b-form-group>

            <b-form-group v-if="show != 'training'" class="g-group3">
                <b-form-checkbox v-model="form.ongoing">Jeg jobber her nå</b-form-checkbox>
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
            
            <!-- <b-form-group>
                <p class="g-title2"><strong>Dokumentasjon</strong></p>
                <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
                <div class="g-group">
                    <b-button class="g-span" @click="uploadFile()" variant="leight">Last opp</b-button>
                    <b-button @click="addLink()" @variant="leight">Lenke</b-button>
                </div>
            </b-form-group> -->

            <upload-file v-on:add_media="addMedia"></upload-file>
 
            <ul class="list-unstyled" style="margin-top: 1em">
                <b-media tag="li" v-for="elem in media" :key="elem.id">
                    <b-img rounded slot="aside" blank blank-color="#777" width="64" alt="img" style="padding-top: 0"/>
                    <!-- <p class="mt-0 mb-1"><strong>Kommentar</strong></p> -->
                    <b-form-textarea id="mdesc"
                                    v-model="form.description"
                                    placeholder="Beskriv litt om hva dette handler om."
                                    :rows="2"
                                    :max-rows="8">
                    </b-form-textarea>
                </b-media>
            </ul>

            <div class="g-group4">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="color: info"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>
        <!-- </slot> -->
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import UploadFile from '@/components/utils/UploadFile'

export default {
    name: 'WorkExperience',
    data() {
        return {
            job_types: [
                { text: 'Bedrift', value: 'Bedrift' },
                { text: 'Frivillig organisasjon', value: 'Frivillig organisasjon' }
            ],
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
                employer: null,
                location: null,
                job_type: null,
                role: null,
                ongoing: false,
                from: null,
                to: null,
                description: null,
                timestamp: null,
                user_id: null,
                cert_id: null,
            },
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null
            },
            links: [],
            media: [],
            user: null,
            wid: null,
            disableWrite: false, 
            reason: 'updtraining'
        }

    },
    props: ['inline', 'employer', 'show', 'cid', 'id'],
    components: {
        'upload-file': UploadFile
    },
    methods: {
        addMedia(obj) {
            console.log('addMedia', obj)
            this.media.push(obj.raw)
        },
        addLink: function() {

        },
        uploadFile: function() {
            // Create a root reference
            var storageRef = firebase.storage().ref();

            // Create a reference to 'mountains.jpg'
            var mountainsRef = storageRef.child('mountains.jpg');

            // Create a reference to 'images/mountains.jpg'
            var mountainImagesRef = storageRef.child('images/mountains.jpg');

            // While the file names are the same, the references point to different files
            mountainsRef.name === mountainImagesRef.name            // true
            mountainsRef.fullPath === mountainImagesRef.fullPath    // false
        },
        cancel() {
            console.log("cancel")
            this.$emit(this.reason, null)
        },
        addOrUpdate() {
            console.log('WE update training, ID=', this.wid)
            if (this.user) {
                this.form.user_id = this.user.uid 
                this.form.timestamp = Date.now()
                try {
                    this.form.from = toTimestamp(this.from.month, this.from.year)
                    if (this.to.month && this.to.year) {
                        this.form.to = toTimestamp(this.to.month, this.to.year)
                    }
                } catch (error) {
                    console.error('update excception: ', error)
                }

                if (this.wid) {
                    db.collection("training").doc(this.wid).set(this.form, {merge: true})
                    .then((docRef) => {
                        console.log("Document updated with ID: ", this.wid);
                        this.$emit(this.reason, this.wid)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("training").add(this.form)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        this.wid = docRef.id
                        this.$emit(this.reason, this.wid)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            }
            else {
                console.info('User not logged in???')
            }
        },
        fetchData() {
            if (this.user && this.wid) {
                // get object
                db.collection('training').doc(this.wid)
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
    updated() {
        console.log('WE updated event, ID=', this.wid)
    },
    activated() {
        console.log('WE activated event, ID=', this.wid )
    },
    mounted() {
        console.log('WE mounted event, ID=', this.wid )
        if (this.form.employer && this.cid) {
            this.disableWrite = true
        }
    },
    created() {
        this.form.employer  = this.employer
        this.form.cert_id  = this.cid
        this.wid = this.id
        this.user = firebase.auth().currentUser
        console.info('WE created, CID=', this.form.cert_id, "WID=", this.wid)
        this.fetchData()
    }

}
</script>

<style>
a {
    color: rgb(0,161,181);
}
.g-span {
    margin-right: 1em;
}
</style>
