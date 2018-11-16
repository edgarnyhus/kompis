<template>
    <div class="component">
        <b-card> 
            <div v-if="!keyvalues[0] && mode!=='edit'" >
                <h5 class="text-muted">Nøkkelkompetanse
                    <b-button class="btn-floating btn-secondary float-right" @click="mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listKey" :visible="mode==='list'">
                    <h5 class="text-muted">Nøkkelkompetanse
                        <b-link class="g-link float-right" @click="mode='edit'"><strong>Legg til skole/kurs</strong></b-link>
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
                this.fetchKeyValues()
            }
            this.mode = 'list'
        },
        fetchKeyValues() {
            if (this.user) {
                db.collection('keyvalues').where('user_id', '==',this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.keyvalues.push(elem)
                    })
                })
                .catch(err => {
                    console.log('fetching key values failed', err)
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
            // fetch work keyvalues
            this.fetchKeyValues()
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
