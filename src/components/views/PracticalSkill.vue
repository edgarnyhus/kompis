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
            ps_id: null,
            reason: 'onUpdatedSkill',
            user: null
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
                if (this.ps_id) {
                    db.collection('skills').doc(this.ps_id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        console.log('Work experience updated')
                        this.$emit(this.reason, this.ps_id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                        alert(error)
                    })
                } else {
                    db.collection('skills').add(
                        this.form)
                    .then (doc => {
                        console.log('Work experience added')
                        this.ps_id = doc.id
                        this.$emit(this.reason, this.ps_id)
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
        fetchData(id) {
            if (id) {
                // get object
                db.collection('skills').doc(id)
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
        if (this.id)
            this.ps_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }

        this.fetchData(this.ps_id)
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
