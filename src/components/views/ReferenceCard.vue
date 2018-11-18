<template>
    <div class="component">
        <b-card> 
            <div v-if="!references[0] && mode!=='edit'" >
                <h5 class="text-muted">Referanser
                    <b-button class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke personer kan potensielle arbeidsgivere kontakte for å bli kjent med deg? Husk å be om tillatelse!</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <h5 class="text-muted">Referanser
                        <b-link class="g-link float-right" @click="mode='edit'"><strong>Legg til referanse</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <reference-list v-on:editReference="editReference" :references="references" :uid="user_id" :cid="cert_id" :id="id"></reference-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editExp" :visible="mode==='edit'">
                <reference v-on:onUpdatedReference="onUpdatedReference" :uid="user_id" :cid="cert_id" :id="id"></reference>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Reference from '@/components/views/Reference'
import ReferenceList from './ReferenceList'

export default {
    name: 'ReferenceCard',
    components: {
        Reference,
        ReferenceList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            references: [],
            user: null,
            user_id: null,
            cert_id: null,
            id: null,
            mode: 'list'
        }
    },
    methods: {
        editReference(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedReference(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchReference()
            }
            this.mode = 'list'
        },
        fetchReference() {
            if (this.user) {
                this.references = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('references').where('user_id', '==', this.cert_id)
                } else {
                    ref = db.collection('references').where('user_id', '==', this.user_id)
                }
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.media = this.fetchMedia(doc.id)
                        this.references.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('fetching references failed', error)
                })
            }
        },
        fetchMedia(id) {
            let media = []
            db.collection('media').where('parent_id', '==', id)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let elem = doc.data()
                    elem.id = doc.id
                    media.push(elem)
                })
            })
            .catch(error=> {
                console.log('ec fetching media failed', error)
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
            // fetch references
            this.fetchReference()
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
