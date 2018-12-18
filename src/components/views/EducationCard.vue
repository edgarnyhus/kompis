<template>
    <div class="component">
        <b-card> 
            <div v-if="!education[0] && mode!=='edit'" >
                <h5 class="text-muted">Utdanning og kurs
                    <b-button v-if="!this.$root.isMobile()" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                    <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt nen kurs på skolen, jobb eller fritid?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listEdu" :visible="mode==='list'">
                    <h5 class="text-muted">Utdanning og kurs
                        <b-link v-if="!this.$root.isMobile()" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til skole/kurs</strong></b-link>
                        <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <education-list v-on:editEducation="editEducation" :education="education" :uid="user_id" :cid="cert_id" :id="edu_id"></education-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editEdu" :visible="mode==='edit'">
                <education v-on:onUpdatedEducation="onUpdatedEducation" :uid="user_id" :cid="cert_id" :id="edu_id"></education>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Education from '@/components/views/Education'
import EducationList from './EducationList'

export default {
    name: 'EducationCard',
    components: {
        Education,
        EducationList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            education: [],
            user: null,
            user_id: null,
            cert_id: null,
            edu_id: null,
            mode: 'list'
        }
    },
    methods: {
        editEducation(id) {
            console.log('educationCard edit', id)
            if (id) {
                this.edu_id = id
                this.mode = 'edit'
            }
        },
        onUpdatedEducation(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            if (this.user_id) {
                this.education = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('education').where('user_id', '==', this.cert_id)
                } else {
                    ref = db.collection('education').where('user_id', '==', this.user_id)
                }
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.media = this.fetchMedia('media', doc.id)
                        elem.links = []
                        this.education.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('ec fetching educaion failed', error)
                })
            }
        },
        fetchMedia(coll, id) {
            let media = []
            db.collection(coll).where('parent_id', '==', id)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let elem = doc.data()
                    elem.id = doc.id
                    media.push(elem)
                })
            })
            .catch(error=> {
                console.log('fetching media failed', error)
            })
            return media
        }
    },
    created() {
        // current user
        this.user = firebase.auth().currentUser
        if (this.cert_id !== undefined)
            this.cert_id = this.cid
        if (this.uid !== undefined) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch education
            this.fetchData()
        }
    }
    
}
</script>

<style>

</style>
