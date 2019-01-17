<template>
    <div class="component">
        <b-card> 
            <div v-if="!keyvalues[0] && mode!=='edit'" >
                <md-button  v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                <h5 class="text-muted">Nøkkelkompetanse
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke nøkkelegenskaper kjennetegner deg? Hva er dine styrker?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listKey" :visible="mode==='list'">
                    <div v-if="isMobile" style="margin-bottom: 1.5em">
                        <md-button class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                    </div>
                    <h5 class="text-muted">Nøkkelkompetanse
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til en nøkkelkompetanse</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1.7em"></div>
                    <key-value-list v-on:editKeyValue="editKeyValue" :keyvalues="keyvalues" :uid="user_id" :cid="cert_id" :id="id"></key-value-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editKey" :visible="mode==='edit'">
                <key-value v-on:onUpdatedKeyValue="onUpdatedKeyValue" :uid="user_id" :cid="cert_id" :id="id"></key-value>
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
        editKeyValue(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedKeyValue(id) {
            // child component (slot) signaled finished
            // console.log('updated event from child, ID=', id)
            if (id) {
                this.keyvalues = this.$store.state.database.fetchData('keyvalues', this.cert_id, this.user_id)
            }
            this.mode = 'list'
        }
    },
    created() {
        if (this.cid != undefined) 
            this.cert_id  = this.cid
        if (!this.cert_id && this.$route.params.cid)
            this.cert_id = this.$route.params.cid
        if (this.uid != undefined)
            this.user_id = this.uid
        if (!this.user_id && this.$route.params.uid)
            this.user_id = this.$route.params.uid
        if (!this.user_id)
            this.user_id = firebase.auth().currentUser.uid
        this.keyvalues = this.$store.state.database.fetchData('keyvalues', this.cert_id, this.user_id)
    }
    
}
</script>

<style>

</style>
