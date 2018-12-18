<template>
    <div class="component">
        <b-card> 
            <div v-if="!experience[0] && mode!=='edit'" >
                <h5 class="text-muted">Arbeidserfaring
                    <b-button v-if="!this.$root.isMobile()" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                    <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                </h5>
                <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <h5 class="text-muted">Arbeidserfaring
                        <b-link v-if="!this.$root.isMobile()" class="g-link float-right" @click="id=0; mode='edit'"><strong>Legg til arbeidserfaring</strong></b-link>
                        <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <work-experience-list v-on:editExperience="editExperience" :experience="experience" :uid="user_id" :cid="cert_id" :id="id"></work-experience-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editExp" :visible="mode==='edit'">
                <work-experience v-on:onUpdatedExperience="onUpdatedExperience" :uid="user_id" :cid="cert_id" :id="id"></work-experience>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import WorkExperience from '@/components/views/WorkExperience'
import WorkExperienceList from './WorkExperienceList'

export default {
    name: 'WorkExperienceCard',
    components: {
        WorkExperience,
        WorkExperienceList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            experience: [],
            user: null,
            user_id: null,
            cert_id: null,
            id: null,
            mode: 'list'
        }
    },
    methods: {
        editExperience(id) {
            console.log('experienceCard edit', id, this.cert_id)
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedExperience(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            if (this.user_id) {
                this.experience = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('experience').where('cert_id', '==',this.cert_id)
                 } else {
                    ref = db.collection('experience').where('user_id', '==',this.user_id)
                 }   
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.media = this.fetchMedia('media', doc.id)
                        elem.links = this.fetchMedia('links', doc.id)
                        // elem.links = [] 
                        this.experience.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('mc fetching experience failed', error)
                })
            }
            // this.fetchMedia()
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
        if (this.cid !== undefined)
            this.cert_id = this.cid
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch work experience/training
            this.fetchData()
        }
    }
    
}
</script>

<style>

</style>
