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

        <b-form @submit.prevent="update">
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


            <b-form-group class="g-group">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <from-to @onFromTo="onFromTo" :from="from" :to="to"></from-to>
            
            <!-- <upload-file v-on:input="onMedia" :uid="User_id" :cid="form.cert_id"></upload-file> -->
            <image-uploader v-on:input="onMedia" :uid="user_id" :cid="form.cert_id"> </image-uploader>
 
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

            <div class="g-group4">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="color: info"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>

        <b-modal  class="g-modal" ref="showmodal" size="lg" hide-footer title="Kompis">
            <embed v-if="file" :src="file.url" frameborder="0" width="100%" height="900px">        
        </b-modal>
        <!-- </slot> -->
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import UploadFile from '@/components/common/UploadFile'
import ImageUploader from '@/components/common/ImageUploader'
import FromTo from '@/components/common/FromTo'
import { wait } from '@/components/utils/utils';


export default {
    name: 'WorkExperience',
    components: {
        'from-to': FromTo,
        'upload-file': UploadFile,
        'image-uploader': ImageUploader
    },
    props: ['inline', 'employer', 'show', 'uid', 'cid', 'id'],
    data() {
        return {
            job_types: [
                { text: 'Bedrift', value: 'Bedrift' },
                { text: 'Frivillig organisasjon', value: 'Frivillig organisasjon' }
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
                links: [],
                // media: [{data: null, url: null}],
                // media: [{url: null}],
                // media: [{ filename: null, type: null, url: null, description: null }]
                media: []
            },
            from: {
                month: null,
                year: null
            },
            to: {
                month: null,
                year: null
            },
            media: [],
            links: [],
            user: null,
            user_id: null,
            we_id: null,
            disableWrite: false,
            file: null,
            reason: 'updtraining'
        }

    },
    methods: {
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
            // this.form.media = []
            // this.form.links = []
        },
        onFromTo(from, to, ongoing) {
            console.log('onFromTo', this.from, this.to)
            // this.from = from
            // this.to = to
            // this.form.ongoing = ongoing
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
        addLink: function() {

        },
        showFile(item) {
            console.log('showFile', item.url)
            this.file = item
            // window.open(item.url)
            const ref = this.$refs.showmodal
            if(ref)
                ref.show()
        },
        cancel() {
            this.$emit(this.reason, null)
            // this.$destroy()
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
                    this.form.media = this.media
                    this.form.links = this.links
                } catch (error) {
                    console.error('update excception: ', error)
                }

                if (this.we_id) {
                    db.collection("experience").doc(this.we_id).set(this.form, {merge: true})
                    .then((docRef) => {
                        console.log("Document updated with ID: ", this.we_id);
                        this.$emit(this.reason, this.we_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    db.collection("experience").add(this.form)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        this.we_id = docRef.id
                        this.$emit(this.reason, this.we_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            }
            else {
                console.info('User not logged in???')
            }
            // this.$destroy()
        }
    },
    mounted() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.form.employer  = this.employer
        this.form.cert_id  = this.cid
        this.we_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        if (this.form.employer && this.cid) {
            this.disableWrite = true
        }
        console.log('we created:', this.we_id)

        if (this.we_id) {
            console.log('we get object', this.we_id)
            // get object
            db.collection('experience').doc(this.we_id)
            .get()
            .then ((docRef) => {
                if(docRef.exists) {
                    this.form = docRef.data()
                    this.from.month = getMonth(this.form.from)
                    this.from.year = getYear(this.form.from)
                    this.to.month = getMonth(this.form.to)
                    this.to.year = getYear(this.form.to)
                    this.media = this.form.media
                    this.links = this.form.links
                }
            })
            .catch((error) => {
                console.error("we error fetching document: ", error);
            });
        }
    }
}
</script>

<style scoped>
a {
    color: rgb(0,161,181);
}
.g-span {
    margin-right: 1em;
}
img {
    border: 1px;
    border-color: rgb(242,242,242);
    border-radius: 6px;
    cursor: pointer;
}
img:hover {

}

</style>
