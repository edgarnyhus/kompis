<template>
    <div class="component">
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
                                    :options="job_types" stacked name="where">
                </b-form-radio-group>
            </b-form-group>

            <b-form-group>
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

            <b-form-group >
                <label for="role"><strong>Min rolle</strong></label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" id="role" placeholder="" v-model="form.role" />
            </b-form-group>


            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description" v-model="form.description" placeholder="" :rows="3" :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <from-to :from="from" :to="to" :ongoing="form.ongoing" :ongoingText="'Jeg jobber her nå'"></from-to>
            
            <upload-media :parent="'exp'" :uid="user_id" :cid="cert_id" :media="media" :links="links"> </upload-media>
 
            <media-list :media="media" :links="links"></media-list>

            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="color: info"><strong>Avbyt</strong></b-link>
            </div>

        </b-form>

        <b-modal  class="g-modal" ref="showmodal" size="lg" hide-footer title="Kompis">
            <embed v-if="file" :src="file.url" frameborder="0" width="100%" height="900px">        
        </b-modal>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import UploadMedia from '@/components/common/UploadMedia'
import FromTo from '@/components/common/FromTo'
import { wait } from '@/components/utils/utils';
import MediaList from '@/components/common/MediaList'


export default {
    name: 'WorkExperience',
    components: {
        'from-to': FromTo,
        'upload-media': UploadMedia,
        'media-list': MediaList

    },
    props: ['show', 'uid', 'cid', 'id'],
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
            cert_id: null,
            e_id: null,
            disableWrite: false,
            file: null,
            reason: 'onUpdatedExperience'
        }

    },
    watch: {
        // id: function(val, oldVal) {
        //     console.log('experience wath', val,oldVal)
        // }
    },
    computed: {
        // id: function(val, oldVal) {
        //     console.log('id changed', val, oldVal)
        //     return this.id
        // }
    },
    methods: {
        destroy() {
          this.$destroy();
        },    
        reset () {
            Object.assign(this.$data, this.$options.data.call(this));
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
                } catch (error) {
                    console.error('update excception: ', error)
                }

                if (this.e_id) {
                    db.collection("experience").doc(this.e_id).set(this.form, {merge: true})
                    .then((docRef) => {
                        this.updateMedia()
                        console.log("Document updated with ID: ", this.e_id);
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    this.form.user_id = this.user_id 
                    this.form.cert_id = this.cert_id 
                    db.collection("experience").add(this.form)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        this.e_id = docRef.id
                        this.$emit(this.reason, this.e_id)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
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
                        user_id: this.user_id, cert_id: this.cert_id, timestamp: Date.now()}
                if (element.id) {
                    db.collection("media").doc(element.id).set(item, {merge: true})
                    .then((docRef) => {
                        console.log("media updated with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("error adding media: ", error);
                    });
                } else {
                    db.collection("media").add(item)
                    .then((docRef) => {
                        console.log("media written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }
            });

        },
        fetchData(id) {
            if (id) {
                console.log('we get object', id)
                // get object
                db.collection('experience').doc(id)
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
                        console.log('experience fetched ok')
                    }
                })
                .catch((error) => {
                    console.error("error fetching document: ", error);
                    alert('Henting av data feilet\n' + error.message)
                });
            }
            this.fetchMedia()
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
                })
            }
            console.log('experience created ok')
        }
    },
    beforeDestroy() {
        console.log('experience destroyed')
    },
    activated() {
        console.log('experience activated', this.id)
    },
    updated() {
        console.log('experience updated', this.id)
    },
    mounted() {
        console.log('experience mounted', this.id)
    },
    created() {
        this.reset()
        this.user = firebase.auth().currentUser
        if (this.cid)
            this.cert_id  = this.cid
        if (this.id !== undefined)
            this.e_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }
        console.log('experience created:', this.cert_id, this.e_id)
        this.fetchData(this.e_id)
    }
}
</script>

<style scoped>
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
