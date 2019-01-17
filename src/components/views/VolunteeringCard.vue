<template>
    <div class="component">
        <b-card> 
            <div v-if="!volunteering[0] && mode!=='edit'" >
                <md-button  v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                <h5 class="text-muted">Frivillig arbeid og verv
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Har du tatt på deg frivillig arbeid eller verv? Hva?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <md-button  v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                    <h5 class="text-muted">Frivillig arbeid og verv
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til frivillig arbeid/verv</strong></b-link>
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
        editVolunteering(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedVolunteering(id) {
            // child component (slot) signaled finished
            // console.log('updated event from child, ID=', id)
            if (id) {
                this.volunteering = this.$store.state.database.fetchData('volunteering', this.cert_id, this.user_id)
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
        this.volunteering = this.$store.state.database.fetchData('volunteering', this.cert_id, this.user_id)
    }
    
}
</script>

<style>

</style>
