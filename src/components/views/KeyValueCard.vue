<template>
    <div class="component">
        <b-card> 
            <div v-if="!keyvalues[0] && mode!=='edit'" >
                <h5 class="text-muted">Nøkkelkompetanse
                    <b-button v-if="!this.$root.isMobile()" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                    <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listKey" :visible="mode==='list'">
                    <h5 class="text-muted">Nøkkelkompetanse
                        <b-link v-if="!this.$root.isMobile()" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til en nøkkelkompetanse</strong></b-link>
                        <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <key-value-list v-on:editKeyValue="editKeyValue" :keyvalues="keyvalues" :uid="user_id" :cid="cert_id" :id="kv_id"></key-value-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editKey" :visible="mode==='edit'">
                <key-value v-on:onUpdatedKeyValue="onUpdatedKeyValue" :uid="user_id" :cid="cert_id" :id="kv_id"></key-value>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import KeyValue from '@/components/views/KeyValue'
import KeyValueList from './KeyValueList'

export default {
    name: 'KeyValueCard',
    components: {
        KeyValue,
        KeyValueList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            keyvalues: [],
            user: null,
            user_id: null,
            cert_id: null,
            kv_id: null,
            mode: 'list'
        }
    },
    methods: {
        editKeyValue(id) {
            if (id) {
                this.kv_id = id
                this.mode = 'edit'
            }
        },
        onUpdatedKeyValue(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            if (this.user) {
                this.keyvalues = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('keyvalues').where('user_id', '==',this.cert_id)
                } else {
                    ref = db.collection('keyvalues').where('user_id', '==',this.user_id)
                }
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.id = doc.id
                        elem.media = this.fetchMedia('media', doc.id)
                        this.keyvalues.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('fetching key values failed', error)
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
        this.cert_id = this.cid
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch work keyvalues
            this.fetchData()
        }
    }
    
}
</script>

<style>

</style>
