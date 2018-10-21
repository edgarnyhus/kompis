<template>
    <div>
        <div class="b-navbar">
            <b-navbar toggleable="md" type="light" variant="light" style="height: 3.5em">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#"><strong>KOMPIS</strong></b-navbar-brand>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav>
                    <b-nav-item href="#">Min CV</b-nav-item>
                    <b-nav-item router-link :to="{ name: 'PracticeCertificateView' }">Praksisattester</b-nav-item>
                    <b-nav-item href="#">Utviklingsplan</b-nav-item>
                    </b-navbar-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown right>
                            <!-- Using button-content slot -->
                            <template slot="button-content">
                            <em>{{ this.user }}</em>
                            </template>
                            <b-dropdown-item href="#">Profil</b-dropdown-item>
                            <b-dropdown-item href="#">Logg ut</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
        <hr>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Navbar',
    data(){
        return{
            user: 'edgar@getacademy.no'
        }
    },
    methods: {
        showPracticeCertificateView() {
            this.$router.push({ name: 'PracticeCertificatView' })
        }
    },
    mounted() {
        // Initialize navbar
    },
    created(){
        
        firebase.auth().onAuthStateChanged((user) => {
        this.user = user;
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
