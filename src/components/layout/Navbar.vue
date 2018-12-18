<template>
    <div>
        <b-navbar class="navbar-collapse" toggleable="md" type="light" variant="light" 
            style="border-bottom: 1px solid rgb(232,233,232); padding-left: 3.5%; padding-right: 3.5%;">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#"><strong>KOMPIS</strong></b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav>
                    <b-nav-item v-if="user" router-link :to="{ name: 'MyCV' }">Min CV</b-nav-item>
                    <b-nav-item v-if="user" router-link :to="{ name: 'PracticeCertificateView' }">Praksisattester</b-nav-item>
                    <b-nav-item v-if="user" href="#" v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'">Utviklingsplan</b-nav-item>

                    <!-- <div v-if="windowWidth <= 480"> -->
                    <div v-if="smallScreen">
                        <b-button v-if="user" variant="outline-secondary sm" block v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'" disabled>Del</b-button>
                        <b-button v-if="user" variant="outline-secondary sm" block v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'" disabled>PDF</b-button>
                        <b-button v-if="user" variant="outline-secondary sm" block v-b-popover.hover="'Funskjon ikke støttet i denne versjonen'" disabled>Generer CV</b-button>
                    </div>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" v-if="user">
                    <div class="dropdown-divider"></div>
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
            //windowWidth: window.innerWidth,
        }
    },
    computed: {
        smallScreen() {
            //return this.windowWidth <= 400
            return this.$root.windowWidth <= 400
        }
    },
    methods: {
        // handleWindowResize(event) { 
        //     this.windowWidth = event.currentTarget.innerWidth; 
        //     console.log('resize', this.windowWidth)
        // },
        showPracticeCertificateView() {
            this.$router.push({ name: 'PracticeCertificateView' })
        },
        logout: function () {
            console.log('logging out...')
            firebase.auth().signOut().then(() => {
                this.$router.push({ name: 'Login' })
            })
        },
        showProfile: function () {
            console.log('show profile')
            
        }
    },
    beforeDestroy: function () {
        // window.removeEventListener('resize', this. handleWindowResize)
    },
    mounted() {
        // get current user
        let user = firebase.auth().currentUser
        // this.$nextTick(() => {
        //     window.addEventListener('resize', () => {
        //         this.windowWidth = window.innerWidth
        //     })
        // })

        // window.addEventListener('resize', this.handleWindowResize);
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
.navbar{
    background:transparent;
}
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
    font-weight: 400;
}
a:hover {
    color: rgb(0,161,181);
    font-weight: 400;
}
.gb-link {
    color: rgb(0,161,181);
    font-weight: 400;
}
.gb-link:hover {
    color: rgb(0,161,181);
    font-weight: 400;
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
    font-weight: 400;
    font-size: 1.5rem;
}
.link-prop:hover {
    color: rgb(0,160,161);
    font-weight: 400;
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
    color: white;
}
.g-info{
    cursor: pointer;
    background: rgb(0,160,161);
    color: white
}
.g-secondary{
    cursor: pointer;
    background: #6c757d;
    color: white;
}
.g-secondary-outline{
    cursor: pointer;
    /* background: rgb(0,160,161); */
    color: #6c757d;
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
