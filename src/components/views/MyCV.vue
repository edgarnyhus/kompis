<template>
    <div role="tablist">
        <SubNavbar />

        <div class="container">
            <h1 style="margin-top: 0.7em; margin-bottom: 0.7em">Min CV</h1>
            
            <!-- ARBEIDSERFARING -->
            <work-experience-card :show="show" :uid="user_id" :cid="cert_id"></work-experience-card>

            <!-- UTDANNING OG KURS -->
            <education-card :show="show" :uid="user_id" :cid="cert_id">></education-card>

            <!-- NØKKELKOMPETANSE -->
            <key-value-card :show="show" :uid="user_id" :cid="cert_id">></key-value-card>

            <!-- PRAKTISKE FERDIGHETER -->
            <practical-skill-card :show="show" :uid="user_id" :cid="cert_id">></practical-skill-card>

            <!-- FRIVILLIG ARBEID OG VERV -->
            <volunteering-card :show="show" :uid="user_id" :cid="cert_id">></volunteering-card>

            <!-- SPRÅK -->
            <language-card :show="show" :uid="user_id" :cid="cert_id">></language-card>

            <!-- REFERANSER -->
            <reference-card :show="show" :uid="user_id" :cid="cert_id"></reference-card>

            <div style="margin-bottom: 2em"></div>
        </div>
        <div class="g-bottom"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import SubNavbar from '@/components/layout/SubNavbar'
import WorkExperienceCard from '@/components/views/WorkExperienceCard'
import EducationCard from '@/components/views/EducationCard'
import KeyValueCard from '@/components/views/KeyValueCard'
import PracticalSkillCard from '@/components/views/PracticalSkillCard'
import VolunteeringCard from '@/components/views/VolunteeringCard'
import LanguageCard from '@/components/views/LanguageCard'
import ReferenceCard from '@/components/views/ReferenceCard'

const EXPR=0, EDU=1, KV=2, SKIL=3, LAN=4, VOL=5, REF=6

export default {
    name: 'MyCV',
    components: {
        SubNavbar,
        WorkExperienceCard,
        EducationCard,
        KeyValueCard,
        PracticalSkillCard,
        VolunteeringCard,
        LanguageCard,
        ReferenceCard
    },
    props: ['uid'],
    data () {
        return {
            user: null,
            profile: null,
            user_id: null,
            cert_id: null,
            show: ''
        }
    },
    mounted() {

    },
    created() {
        // current user
        this.user = firebase.auth().currentUser
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user_id) {
            db.collection('users').doc(this.user_id)
            .get()
            .then(doc => {
                this.profile = doc.data()
            })
            .catch(error => {
                console.error('Firebase error: ', error)
                alert(error)
            })
        }
    }
}
</script>

<style>
.g-title {
    margin-top: 2em;
    margin-bottom: 1em;
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
