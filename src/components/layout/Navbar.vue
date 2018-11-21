<template>
    <div>
        <b-navbar class="navbar-collapse" toggleable="md" type="light" variant="light" 
            style="height: 70px; border-bottom: 1px solid rgb(232,233,232); padding-left: 3.5%; padding-right: 3.5%;">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#"><strong>KOMPIS</strong></b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item v-if="user" router-link :to="{ name: 'MyCV' }">Min CV</b-nav-item>
                <b-nav-item v-if="user" router-link :to="{ name: 'PracticeCertificateView' }">Praksisattester</b-nav-item>
                <b-nav-item v-if="user" href="#">Utviklingsplan</b-nav-item>

                <div v-if="false">
                    <div class="dropdown-divider"></div>
                    <b-nav-item v-if="user" href="#" disabled >Del</b-nav-item>
                    <b-nav-item v-if="user" href="#" disabled>PDF</b-nav-item>
                    <b-nav-item v-if="user" href="#" disabled>Generer CV</b-nav-item>
                </div>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto" v-if="user">
                <b-nav-item-dropdown right>
                    <!-- Using button-content slot -->
                    <template slot="button-content">
                        <em>{{ this.user.email }}</em>
                    </template>
                    <b-dropdown-item type="link" v-on:click="showProfile()" href="#" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">Profil</b-dropdown-item>
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
            windowWidth: 0,
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
    computed: {
        smallScreen() {
            return this.windowWidth <= 480
        }
    },
    methods: {
        showPracticeCertificateView() {
            this.$router.push({ name: 'PracticeCertificateView' })
        },
        isMobile() {
            // an assumption
            if ( screen.width <= 480 ) {
                return true
            }
            return false
        }
    },
    mounted() {
        // get current user
        let user = firebase.auth().currentUser
        // this.$nextTick(() => {
        //     window.addEventListener('resize', () => {
        //         this.windowWidth = window.innerWidth
        //     })
        // })
   },
    created() {      
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user;
            if (!user) {
                this.$router.push({ name: 'Login' })
            }
        })
    }
}
</script>

<style>
.navbar-collapse{ 
    background-color: rgb(248,249,250);
}

</style>
