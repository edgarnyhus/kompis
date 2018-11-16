<template>
    <div class="component">
        <b-card> 
            <div v-if="!languages[0] && showList" >
                <h5 class="text-muted">Språk
                    <b-button class="btn-floating btn-secondary float-right" @click="showList=false">Legg til emne</b-button>
                    <p class="b-card-text" style="font-style: italic">Hvilke språk kan du snakke?</p>
                </h5>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="showList">
                    <h5 class="text-muted">Språk
                        <b-link class="g-link float-right" @click="showList=false"><strong>Legg til arbeidserfaring</strong></b-link>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <language-list v-on:editLanguage="editLanguage" :languages="languages" :uid="user_id" :cid="cert_id" :id="id"></language-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editExp" :visible="!showList">
                <language v-on:onUpdatedLanguage="onUpdatedLanguage" :uid="user_id" :cid="cert_id" :id="id"></language>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Language from '@/components/views/Language'
import LanguageList from './LanguageList'

export default {
    name: 'LanguageCard',
    components: {
        Language,
        LanguageList
    },
    props: ['uid', 'cid'],
    data() {
        return {
            languages: [],
            user: null,
            user_id: null,
            cert_id: null,
            id: null,
            showList: true
        }
    },
    methods: {
        editLanguage(id) {
            if (id) {
                this.id = id
                this.showList = false
            }
        },
        onUpdatedLanguage(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchLanguage()
            }
            this.showList = true
        },
        fetchLanguage() {
            if (this.user) {
                db.collection('languages').where('user_id', '==',this.user_id)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.languages.push(elem)
                    })
                })
                .catch(err => {
                    console.log('mc fetching Language failed', err)
                })
            }
        }

    },
    created() {
        // current user
        this.user = firebase.auth().currentUser
        this.cert_id = this.cid
        if (this.uid) {
            this.user_id = this.uid
        } else if (this.user) {
            this.user_id = this.user.uid
        }
        if (this.user) {
            // fetch work Language/training
            this.fetchLanguage()
        }
    }
    
}
</script>

<style>
small {
    display: block;
}
a {
    color: rgb(0,161,181);
}
a:hover {
    color: rgb(0,161,181);
}
.g-title {
    margin-top: 1em;
    margin-bottom: 1em;
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
.g-link {
    color: rgb(62,65,67);
    font-size: 16px;
}
.g-link:hover {
    color: rgb(70,72,74);
    font-size: 16px;
}
</style>
