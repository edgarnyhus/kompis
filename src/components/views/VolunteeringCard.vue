<template>
    <div class="component">
        <b-card> 
            <div v-if="!volunteering[0] && mode!=='edit'" >
                <h5 class="text-muted">Frivillig arbeid og verv
                    <b-button class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Har du tatt på deg frivillig arbeid eller verv? Hva?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <h5 class="text-muted">Frivillig arbeid og verv
                        <b-link class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til frivillig arbeid/verv</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <volunteering-list v-on:editVolunteering="editVolunteering" :volunteering="volunteering" :uid="user_id" :cid="cert_id" :id="id"></volunteering-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editExp" :visible="mode==='edit'">
                <volunteering v-on:onUpdatedVolunteering="onUpdatedVolunteering" :uid="user_id" :cid="cert_id" :id="id"></volunteering>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Volunteering from '@/components/views/Volunteering'
import VolunteeringList from './VolunteeringList'

export default {
    name: 'VolunteeringCard',
    components: {
        Volunteering,
        VolunteeringList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            volunteering: [],
            user: null,
            user_id: null,
            cert_id: null,
            id: null,
            mode: 'list'
        }
    },
    methods: {
        editVolunteering(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedVolunteering(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            this.volunteering = []
            let ref = null
            if (this.cert_id) {
                ref = db.collection('volunteering').where('user_id', '==', this.cert_id)
            } else {
                ref = db.collection('volunteering').where('user_id', '==', this.user_id)
            }
            ref.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let elem = doc.data()
                    elem.id = doc.id
                    elem.media = this.fetchMedia('media', doc.id)
                    elem.links = []
                    this.volunteering.push(elem)
                })
            })
            .catch(error=> {
                console.log('ec fetching educaion failed', error)
            })
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
        this.cert_id = this.cid
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch work volunteering
            this.fetchData()
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
