<template>
    <div class="component">
        <b-card> 
            <div v-if="!education[0] && mode!=='edit'" >
                <md-button v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                <h5 class="text-muted">Utdanning og kurs
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke skoler har du gått på? Har du tatt noen kurs på skolen, jobb eller fritid?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listEdu" :visible="mode==='list'">
                    <md-button v-if="isMobile" class="md-fab md-mini md-fab-top-right" style="margin-top: 0; margin-right: 0" @click="id=null; mode='edit'"><md-icon>add</md-icon></md-button>
                    <h5 class="text-muted">Utdanning og kurs
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til skole/kurs</strong></b-link>
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
        editEducation(id) {
            // console.log('educationCard edit', id)
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedEducation(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.education = this.$store.state.database.fetchData('education', this.cert_id, this.user_id)
            }
            this.mode = 'list'
        },
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
        this.education = this.$store.state.database.fetchData('education', this.cert_id, this.user_id)
    }
    
}
</script>

<style>

</style>
