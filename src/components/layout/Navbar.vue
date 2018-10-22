<template>
    <div>
        <b-navbar toggleable="md" type="light" variant="light" 
            style="height: 70px; border-bottom: 1px solid rgb(232,233,232); padding-left: 3.5%; padding-right: 3.5%;">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#"><strong>KOMPIS</strong></b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav>
                <b-nav-item v-if="user" router-link :to="{ name: 'MyCV' }">Min CV</b-nav-item>
                <b-nav-item v-if="user" router-link :to="{ name: 'PracticeCertificateView' }">Praksisattester</b-nav-item>
                <b-nav-item v-if="user" href="#">Utviklingsplan</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" v-if="user">
                    <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                            <em>{{ this.user.email }}</em>
                        </template>
                        <b-dropdown-item type="link" v-on:click="showProfile()" href="#">Profil</b-dropdown-item>
                        <b-dropdown-item type="link" v-on:click="logout()" href="#">Logg ut</b-dropdown-item>
                    </b-nav-item-dropdown>

                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Navbar',
    data() {
        return {
            user: null,
            logout: function () {
                console.log('logging out...')
                firebase.auth().signOut().then(() => {
                    this.$router.push({ name: 'Login' })
                })
            },
            showProfile: function () {
                console.log('show profile')
            }
        }
    },
    events: {

    },
    methods: {
        showPracticeCertificateView() {
            this.$router.push({ name: 'PracticeCertificateView' })
        }
    },
    mounted() {
        // get current user
        let user = firebase.auth().currentUser
    },
    created() {      
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user;
            if (!user) {
                this.$router.push({ name: 'Login' })
            }
        })
    },
    methods: {

    }
}
</script>

<style>
.main-nav {
    margin-left: 3.75em;
    margin-right: 3.75em;
}
</style>
