<template>
    <div class="component">
        <b-card> 
            <div v-if="!skills[0] && mode!=='edit'" >
                <h5 class="text-muted">Praktiske ferdigheter
                    <b-button class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hva er dine praktiske evner? Npe du har lært på skolen eller i jobb?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <h5 class="text-muted">Praktiske ferdigheter
                        <b-link class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til praktisk ferdighet</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <practical-skill-list v-on:editSkill="editSkill" :skills="skills" :uid="user_id" :cid="cert_id" :id="id"></practical-skill-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editExp" :visible="mode==='edit'">
                <practical-skill v-on:onUpdatedSkill="onUpdatedSkill" :uid="user_id" :cid="cert_id" :id="id"></practical-skill>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import PracticalSkill from '@/components/views/PracticalSkill'
import PracticalSkillList from './PracticalSkillList'

export default {
    name: 'PracticalSkillCard',
    components: {
        PracticalSkill,
        PracticalSkillList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            skills: [],
            user: null,
            user_id: null,
            cert_id: null,
            id: null,
            mode: 'list'
        }
    },
    methods: {
        editSkill(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedSkill(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            if (this.user) {
                this.skills = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('skills').where('user_id', '==', this.cert_id)
                } else {
                    ref = db.collection('skills').where('user_id', '==', this.user_id)
                }
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.media = this.fetchMedia('media', doc.id)
                        this.skills.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('mc fetching skills failed', error)
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
        if (this.cid !== undefined) {
            this.cert_id = this.cid
        }
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch work skills/training
            this.fetchData()
        }
        console.log('skill card crearewd', this.user_id, this.cert_id)
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
