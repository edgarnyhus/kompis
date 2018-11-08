<template>
    <div class="g-m0">
        <b-navbar v-if="user" id="subnavbar" toggleable="md" type="light" variant="light" 
            style="height: 70px; border-bottom: 1px solid rgb(232,233,232); padding-left: 3.5%; padding-right: 3.5%;">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#"><strong>Ok, la oss komme igang!</strong></b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <!-- <b-button size="sm" variant='outline-secondary' class="nav-button my-2 my-sm-0">Del</b-button>
                    <b-button size="sm" variant='outline-secondary' class="nav-button my-2 my-sm-0">PDF</b-button>
                    <b-button size="sm" variant='outline-secondary' class="nav-button my-2 my-sm-0">Generer CV</b-button> -->
                    <button type="button" class="nav-button btn btn-outline-secondary">Del</button>
                    <button type="button" class="nav-button btn btn-outline-secondary">PDF</button>
                    <button type="button" class="nav-button btn btn-outline-secondary">Generer CV</button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'SubNavbar',
    data(){
        return{
            user: null,
            show: false
        }
    },
    mounted() {
        // Initialize navbar
    },
    created(){
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
