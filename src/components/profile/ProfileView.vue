<template>
    <div class="g-top container">
        <!-- <md-button class="g-pic md-fab md-fab-bottom-right md-fixed" @click="edit()"><md-icon>edit</md-icon></md-button> -->
        <h1 v-if="profile && profile.firstname">{{ profile.firstname }} {{ profile.surname }}
            <md-button class="g-pic md-fab md-mini float-right" @click="edit()"><md-icon>edit</md-icon></md-button>
        </h1>
        <h1 v-else>[Navnet ditt]
            <md-button class="g-pic md-fab md-mini float-right" @click="edit()"><md-icon>edit</md-icon></md-button>
        </h1>
        <ul class="g-sec list-unstyled">
            <b-media v-if="profile && profile.picture" tag="li">
                <b-img class="g-size" slot="aside" rounded="circle" :src="profile.picture" @click="show()" alt="img" />
                <!-- <b-button class="g-btn">Last opp nytt bilde av deg selv</b-button>
                <p style="margin-top: 0.5em">Bildet bør være minst 100 x 100 pixler</p>
                <b-button class="g-btn"><strong>Last opp bilde</strong></b-button>
                <upload-media :uid="user_id" :cid="cert_id" :media="media" :links="links"> </upload-media> -->
                <upload-media v-on:addedPicture="addedPicture" :profile="profile" :uid="user_id"> </upload-media>
            </b-media>
            <b-media v-else tag="li" class="my-4">
                <b-img slot="aside" rounded="circle" blank width="100px" height="100px" blank-color="#777" alt="img" class="m-1" />
                <upload-media v-on:addedPicture="addedPicture" :profile="profile" :uid="user_id"> </upload-media>
            </b-media>
        </ul>
        <div class="g-sec g-end row">
            <div class="col">
                <h3 text-secondary>Kontaktinformasjon</h3>
                <div class="row">
                    <div class="g-group col-6">
                        <label><strong>Fornavn</strong></label>
                        <p class="g-indent">{{ profile.firstname }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Etternavn</strong></label>
                        <p class="g-indent">{{ profile.surname }}</p>
                    </div>
                    <div class="g-group col-12">
                        <label><strong>Gateadresse</strong></label>
                        <p class="g-indent">{{ profile.address }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Postnummer</strong></label>
                        <p class="g-indent">{{ profile.postal_code }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>By</strong></label>
                        <p class="g-indent">{{ profile.city }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Mobilnummer</strong></label>
                        <p class="g-indent">{{ profile.mobile }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Email</strong></label>
                        <p class="g-indent">{{ email }}</p>
                    </div>
                </div>
            </div>
            <div class="g-end col">
                <h3>Påloggingsinformasjon</h3>
                <div class="row">
                    <div class="g-group col-6">
                        <label><strong>Brukernavn</strong></label>
                        <p class="g-indent">{{ profile.alias }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'
import slugify from 'slugify'
import UploadMedia from '@/components/common/UploadMedia'

export default {
    components: {
        UploadMedia
    },
    props: ['uid'],
    data() {
        return {
            user: null,
            profile: {
                picture: null,
                alias: null,
                firstname: null,
                surname: null,
                address: null,
                postal_code: null,
                city: null,
                mobile: null,
                timestamp: null
            },
            email: null,
            slug: null
        }
    },
    methods: {
        edit() {
            this.$router.push({ name: 'Profile', params: {uid: this.user.uid} })
        },
        show() {
            
        },
        profileUpdated() {
            this.getProfile()
        },
        addedPicture(file) {
            // console.log('onAddedPicture', file)
            this.profile.picture = file.url 
            db.collection('users').doc(this.slug)
            .set({picture: file.url}, {merge: true})
            .then(() => {
                // console.log('profile picture updated')
            })
            .catch(error=> {
                console.error('updating profile picture failed', error)
                alert(error)
            })
        },
        getProfile(id) {
            db.collection('users').where('user_id', '==', id)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.slug = doc.id
                    this.profile = doc.data()
                    this.email = this.user.email
                    // console.log('profile', this.profile)
                })
            })
            .catch(error => {
                console.error('fetching user profile', error)
                alert(error)
            })
            
        }
    },
    created() {
        this.user = firebase.auth().currentUser
        if (this.user) {
            this.user_id = this.user.uid
            this.getProfile(this.user_id)
        }
    }
}
</script>

<style>

</style>

