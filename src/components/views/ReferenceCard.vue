<template>
    <div class="component">
        <b-card> 
            <div v-if="!references[0] && mode!=='edit'" >
                <md-button  v-if="isMobile" class="g-secondary md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                <h5 class="text-muted">Referanser
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke personer kan potensielle arbeidsgivere kontakte for å bli kjent med deg? Husk å be om tillatelse!</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <div v-if="isMobile" style="margin-bottom: 1.5em">
                        <md-button class="g-secondary md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                    </div>
                    <h5 class="text-muted">Referanser
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til referanse</strong></b-link>
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
            user_id: null,
            cert_id: null,
            id: null,
            mode: 'list'
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
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
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            if (this.user_id) {
                this.references = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('references').where('cert_id', '==', this.cert_id)
                } else {
                    ref = db.collection('references').where('user_id', '==', this.user_id)
                }
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.media = this.fetchMedia('media', doc.id)
                        this.references.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('fetching references failed', error)
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
        if (this.cid != undefined) 
            this.cert_id  = this.cid
        if (!this.cert_id)
            this.cert_id = this.$route.params.cid
        if (this.uid != undefined)
            this.user_id = this.uid
        if (!this.user_id)
            this.user_id = this.$route.params.uid
        if (!this.user_id)
            this.user_id = firebase.auth().currentUser.uid
        this.fetchData()
    }
    
}
</script>

<style>

</style>
