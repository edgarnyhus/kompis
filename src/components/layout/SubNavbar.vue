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
import functions from 'firebase/functions'
Cannot find module 'nodemailer'import axios from 'axios'

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
            // let getShortLink = firebase.functions().httpsCallable('getShortLink');
            // getShortLink()
            // .then((result) => {
            //     console.log('getShortLink', result)
            // })
            // .catch((error) => {
            //     console.error('getShortLink', error)
            // })

            let key = 'AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA'
            let url = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + key
            let domain = 'https://cvue.page.link'
            let URLtoShorten = 'https://cvue-bf9ec.firebaseapp.com/';
            // let options = 
            //     {
            //         contentType: 'application/json',
            //         dynamicLinkInfo: 
            //         {
            //             dynamicLinkDomain: domain,
            //             link: URLtoShorten
            //         }
            //     };
            let options = 
            {
                method: 'post',
                url: url,
                data: {
                    // shortLink: 'https://cvue.page.link',
                    dynamicLinkInfo: {
                        domainUriPrefix: domain,
                        link: URLtoShorten,
                        navigationInfo: {
                            enableForcedRedirect: true,
                        },
                    },
                    suffix: {
                        option: "SHORT"
                    }
                },
                json: true
            }

            // axios({
            // })
            axios.post(url, options)
            .then(response => {
                // let shortLink = response.json.getShortLink()
                // return ({ shortLink: shortLink })
                return ({ response: response })
            })
            .catch(error => {
                throw new functions.https.HttpsError('failed to get shortLink')
            })

            /*
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
            */
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
