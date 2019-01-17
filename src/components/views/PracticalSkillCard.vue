<template>
    <div class="component">
        <b-card> 
            <div v-if="!skills[0] && mode!=='edit'" >
                <md-button  v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                <h5 class="text-muted">Praktiske ferdigheter
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hva er dine praktiske evner? Npe du har lært på skolen eller i jobb?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <div v-if="isMobile" style="margin-bottom: 1.5em">
                        <md-button class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                    </div>
                    <h5 class="text-muted">Praktiske ferdigheter
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til en praktisk ferdighet</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1.7em"></div>
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
        editSkill(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedSkill(id) {
            // child component (slot) signaled finished
            // console.log('updated event from child, ID=', id)
            if (id) {
                this.skills = this.$store.state.database.fetchData('skills', this.cert_id, this.user_id)
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
        this.skills = this.$store.state.database.fetchData('skills', this.cert_id, this.user_id)
    }
    
}
</script>

<style>

</style>
