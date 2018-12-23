<template>
    <div class="g-m0">
        <b-navbar v-if="!this.$smallScreen" id="subnavbar" toggleable="md" type="light" variant="light" 
            style="border-bottom: 1px solid rgb(232,233,232); padding-left: 3.5%; padding-right: 3.5%;">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#"><strong>Ok, la oss komme igang!</strong></b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <button type="button" class="nav-button btn btn-outline-secondary" @click="share()" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">Del</button>
                    <button type="button" class="nav-button btn btn-outline-secondary" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">PDF</button>
                    <button type="button" class="nav-button btn btn-outline-secondary" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">Generer CV</button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import firebase from 'firebase'
import apiKey from '@/firebase/init'
import axios from 'axios'

export default {
    name: 'SubNavbar',
    data(){
        return{
            user: null,
            show: false
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        share() {
            let apiKey = "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA";
            let url = "https://www.googleapis.com/urlshortener/v1/url"
            console.log('share', apiKey)

            axios.post({
                method: 'post',
                uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
                // url: 'https://www.googleapis.com/urlshortener/v1/url?key=${apiKey}' + apiKey,
                dynamicLinkInfo: {
                    "domainUriPrefix": "https://cvue.page.link",
                    "link": "https://cvue-bf9ec.firebaseapp.com/",
                },
                json: true
            })
            .then(result => {
                console.log('result', result)
            })
            .catch(error => {
                console.error('error', error)
            })
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
