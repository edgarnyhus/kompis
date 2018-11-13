<template>
    <div class="component" style="margin: 1em">
        <div>
            <h4 class="page-title">Praktisk ferdighet</h4>
            <p style="font-style: italic">Hva er dine praktiske evner? Noe du har lært på skole eller i jobb?</p>
        </div>

        <b-form @submit.prevent="update">
            <b-form-group>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <b-dropdown id="skill" text="Ferdighet" class="mr-sm-2 mb-sm-0">
                            <!-- <b-dropdown-item v-model="form.skill">Varepåfylling</b-dropdown-item>
                            <b-dropdown-item v-model="form.skill">Murerarbeid</b-dropdown-item> -->

                            <b-dropdown-item-button @click="setSkill('Varepåfylling')">Varepåfylling</b-dropdown-item-button>
                            <b-dropdown-item-button @click="setSkill('Murerarbeid')">Murerarbeid</b-dropdown-item-button>
                        </b-dropdown>
                    </div>
                    <input type="text" class="form-control" placeholder="Praktisk ferdighet (f.eks.Varepåfylling eller Murerarbeid)" v-model="form.skill" required>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder="Hvordan kommer denne ferdigheten til uttrykk?"
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <image-uploader v-on:input="onMedia" :parent="'edu'" :uid="user_id" :cid="form.cert_id"> </image-uploader>
 
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

            <b-form-group>
                <p><strong>Bekreftelse</strong></p>
                <p>Spør veileder eller kontaktperson ved bedrift om bekreftelse for å styrke din CV</p>
                <div class="button-group">
                    <b-button variant="light">Spør</b-button>
                </div>
            </b-form-group>

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

export default {
    name: 'PracticalSkill',
    components: {

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
            ps_id: null,
            reason: 'updskill',
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
            if (this.user_id) {
                this.form.user_id = this.user_id 
                this.form.cert_id = this.cert_ud 
                this.form.timestamp = Date.now()
                if (this.ps_id) {
                    db.collection('skills').doc(this.ps_id).set(
                        this.form, { merge: true })
                    .then (doc => {
                        conssole.log('Work experience updated')
                        this.$emit(this.reason, this.ps_id)
                    })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                } else {
                    db.collection('skills').add(
                        this.form)
                    .then (doc => {
                        conssole.log('Work experience added')
                        this.ps_id = doc.id
                        this.$emit(this.reason, this.ps_id)
                     })
                    .catch(err => {
                        console.log('Firestore error: ', err)
                    })
                }
            }
            else {
                console.log('User not logged in???')
            }
        },
        fetchData() {
            if (this.ps_id) {
                // get object
                db.collection('skills').doc(this.ps_id)
                .get()
                .then (doc => {
                    if(doc.exists) {
                        this.form = doc.data()
                    }
                })
                .catch(err => {
                    console.log('Firestore error: ', err)
                })
            }
        }            
    },
    mounted() {
        this.reset()
        this.user = firebase.auth().currentUser
        this.cert_id  = this.cid
        this.ps_id = this.id
        if (this.uid) {
            this.user_id = this.uid
        } else {
            this.user_id = this.user.uid
        }

        this.fetchData()
        console.log('created:', this.ps_id)
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
b-button {
    margin-right: 2em;
}
.button-group {
    margin-top: 1.5em;
    margin-bottom: 2em;
}
.button-span {
    margin-right: 1em;
}
</style>
