<template>
    <div class="component">
        <b-card> 
            <div v-if="!education[0] && mode!=='edit'" >
                <h5 class="text-muted">Utdanning og kurs
                    <b-button class="btn-floating btn-secondary float-right" @click="mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt nen kurs på skolen, jobb eller fritid?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listEdu" :visible="mode==='list'">
                    <h5 class="text-muted">Utdanning og kurs
                        <b-link class="g-link float-right" @click="mode='list'"><strong>Legg til skole/kurs</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <education-list v-on:editEducation="editEducation" :education="education" :uid="user_id" :cid="cert_id" :id="id"></education-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editEdu" :visible="mode==='edit'">
                <education v-on:onUpdatedEducation="onUpdatedEducation" :uid="user_id" :cid="cert_id" :id="id"></education>
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
            id: null,
            mode: 'list'
        }
    },
    methods: {
        editEducation(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedEducation(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchEducation()
            }
            this.mode = 'list'
        },
        fetchEducation() {
            if (this.user) {
                db.collection('education').where('user_id', '==',this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.education.push(elem)
                    })
                })
                .catch(err => {
                    console.log('ec fetching educaion failed', err)
                })
            }
        }

    },
    created() {
        // current user
        this.user = firebase.auth().currentUser
        this.cert_id = this.cid
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch work education
            this.fetchEducation()
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
