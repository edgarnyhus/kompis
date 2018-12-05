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
                        <!-- <b-dropdown-item type="link" v-on:click="showProfile()" href="#" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">Profil</b-dropdown-item> -->
                        <b-dropdown-item type="link" router-link :to="{ name: 'ProfileView' }" href="#">Profil</b-dropdown-item>
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
h1,h2,h3,h4,h5,h6,p {
    font-family:  Verdana, Geneva, Tahoma, sans-serif;
}
.g-top {
    margin-top: 2.5em;
    margin-bottom: 2em;
}
.navbar-collapse{ 
    background-color: rgb(248,249,250);
}
.g-title {
    margin-top: 0;
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
a {
    color: rgb(0,161,181);
    font-weight: bold;
}
a:hover {
    color: rgb(0,161,181);
    font-weight: bold;
}
.gb-link {
    color: rgb(0,161,181);
    font-weight: bold;
}
.gb-link:hover {
    color: rgb(0,161,181);
    font-weight: bold;
}
.g-header {
    margin-bottom: 0;
}
.g-group {
    margin-top: 1em;
}
.g-span {
    margin-right: 1em;
}
b-card {
    margin-bottom: 2em;
}
.link-prop {
    color: rgb(0,160,161);
    font-size: 1.5rem;
}
.end-page {
    margin-bottom: 3em;
}
.button-span {
    margin-right: 1em;
}

.info-color {
    color: rgb(0,161,181);
}
small {
    display: block;
}
.g-practice {
    margin-top: 3em;
    margin-bottom: 1em;
    background-color: rgb(242,242,242);
}
.accordion {
    margin-top: 1em;
    margin-bottom: 5em;
}
b-card-header {
  cursor: wait;
}
.g-bottom {
    margin-bottom: 2em;
}
.btn-outline-secondary {
    border-color: grey;
}
.g-sec {
    margin-top: 2em;
}
.g-pic {
    cursor: pointer;
    background: #e6363d;
    color: white
}

.g-indent {
    margin-left: 0.75em
}
.g-end {
    margin-bottom: 2em;
}
.g-size {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
}
</style>
