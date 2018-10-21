<template>
    <div class="container">
        <div>
            <h4 class="page-title">Praksisattester
                <b-button class="btn-floating btn-info float-right" @click="newPracticeCertificate()">Lag ny praksisattest</b-button>
            </h4>
        </div>

        <!-- v-for loop  -->
        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" role="tab">
                <b-link class="link-prop" @click="expand()" href="#">Becks Bar
                    <b-button class="btn-floating btn-secondary float-right" @click="editPracticeCertificate()">Endre</b-button>
                </b-link>
                <p class="b-card-text" style="font-style: normal"> Sist endret 3. oktober 2018 kl 07.04</p>
            </b-card-header>
        </b-card>
        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" role="tab">
                <h5 class="b-card-title">Mur- og pussearbeid AS</h5>
                <p class="b-card-text" style="font-style: normal"> Sist endret 24. aprl 2018 kl 16.32</p>
            </b-card-header>
        </b-card>
        <div class="end-page">

        </div>
    </div>
</template>

<script>

export default {
    name: 'PracticeCertificateView',
    components: {

    },
    data () {
        return {
            
        }
    },
    methods: {
        
    }
}
</script>

<style>
.page-title {
    margin-top: 1.5em;
    margin-bottom: 2em;
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
</style>
