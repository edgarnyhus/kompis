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
            user_id: null,
            cert_id: null,
            show: ''
        }
    },
    created() {
        if (this.uid !== undefined)
            this.user_id = this.uid
        if (!this.user_id && this.$route.params.uid)
            this.user_id = this.$route.params.uid
        if (!this.user_id && this.$user)
            this.user_id = this.$user.user_id
        if (!this.user_id)
            this.user_id = firebase.auth().currentUser.uid
        console.log('MyCV created', this.user_id)
    }
}
</script>

<style>

</style>
