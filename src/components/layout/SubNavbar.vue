<template>
    <div class="g-m0">
        <b-navbar v-if="!this.$smallScreen" id="subnavbar" toggleable="md" type="light" variant="light" 
            style="border-bottom: 1px solid rgb(232,233,232); padding-left: 3.5%; padding-right: 3.5%;">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#"><strong>Ok, la oss komme igang!</strong></b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <button type="button" class="nav-button btn btn-outline-secondary" @click="share()">Del</button>
                    <button type="button" class="nav-button btn btn-outline-secondary" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'" @click="dlink()">PDF</button>
                    <button type="button" class="nav-button btn btn-outline-secondary" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">Generer CV</button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import firebase from 'firebase'
import apiKey from '@/firebase/init'
import functions from 'firebase/functions'
import axios from 'axios'

export default {
    name: 'SubNavbar',
    data(){
        return{
            user: null,
            show: false,
            form: null
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        dlink() {
            let getShortLink = firebase.functions().httpsCallable('getShortLink')
            getShortLink(this.form)
            .then((result) => {
                console.log('Get Short Link', result)
                // if (result.data && (result.data.status === 'success' || result.data.status === 'ok')) {
                //     //
                // } else {
                //     alert('Get Short Link failed, ' + error)
                // }
            })
            .catch((error) => {
                console.error('Get Short ink failed', error)
                alert('Get Short Link failed, ' + error)
            })
        },
        share() {
            this.$router.push({name: 'ShareList', params: {mode: 'new' }})
        }
   },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user;
        })
    }
}
</script>

<style>
.g-m0 {
    margin-bottom: 0;
}
.nav-button {
    margin: 0.5em;
    border-color: lightgray
}
</style>
