<template>
    <div class="component">
        <b-card> 
            <div v-if="!experience[0] && mode!=='edit'" >
                <md-button  v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                <h5 class="text-muted">Arbeidserfaring
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Har du hatt jobb før? Hvilke jobber har du hatt?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <md-button  v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                    <h5 class="text-muted">Arbeidserfaring
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=0; mode='edit'"><strong>Legg til arbeidserfaring</strong></b-link>
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
        editExperience(id) {
            // console.log('experienceCard edit', id, this.cert_id)
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedExperience(id) {
            // child component (slot) signaled finished
            // console.log('updated event from child, ID=', id)
            if (id) {
                this.experience = this.$store.state.database.fetchData('experience', this.cert_id, this.user_id)
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
        this.experience = this.$store.state.database.fetchData('experience', this.cert_id, this.user_id)
    }
    
}
</script>

<style>

</style>
