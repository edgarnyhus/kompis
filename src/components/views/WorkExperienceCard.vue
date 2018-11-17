<template>
    <div class="component">
        <b-card> 
            <div v-if="!experience[0] && mode!=='edit'" >
                <h5 class="text-muted">Arbeidserfaring
                    <b-button class="btn-floating btn-secondary float-right" @click="mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <h5 class="text-muted">Arbeidserfaring
                        <b-link class="g-link float-right" @click="mode='edit'"><strong>Legg til arbeidserfaring</strong></b-link>
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
            // media: [],
            // links: [],
            user: null,
            user_id: null,
            cert_id: null,
            id: null,
            mode: 'list',
            showList: true
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
                this.fetchExperience()
            }
            this.mode = 'list'
        },
        fetchExperience() {
            if (this.user_id) {
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('wxperience').where('cert_id', '==',this.cert_id)
                 } else {
                    ref = db.collection('wxperience').where('user_id', '==',this.user_id)
                 }   
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.experience.push(elem)
                    })
                })
                .catch(err => {
                    console.log('mc fetching experience failed', err)
                })
            }
            // this.fetchMedia()
        },
        // fetchMedia() {
        //     if (this.user_id) {
        //         let ref = null
        //         if (this.cert_id) {
        //             ref = db.collection('media').where('cert_i', '==',this.cert_id)
        //          } else {
        //             ref = db.collection('media').where('user_id', '==',this.user_id)
        //          }   
        //         ref.get()
        //         .then(snapshot => {
        //             snapshot.forEach(doc => {
        //                 let elem = doc.data()
        //                 elem.id = doc.id
        //                 this.media.push(elem)
        //             })
        //         })
        //         .catch(err => {
        //             console.log('mc fetching experience failed', err)
        //         })
        //     }
        // }

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
            this.fetchExperience()
        }
    }
    
}
</script>

<style>
small {
    display: block;
}
a {
    color: rgb(0,161,181);
}
a:hover {
    color: rgb(0,161,181);
}
.g-title {
    margin-top: 1em;
    margin-bottom: 1em;
}
.g-header {
    margin-bottom: 0;
}
.g-group {
    margin-top: 1em;
}
.g-span {
    margin-right: 1em;
}
.g-link {
    color: rgb(62,65,67);
    font-size: 16px;
}
.g-link:hover {
    color: rgb(70,72,74);
    font-size: 16px;
}
</style>
