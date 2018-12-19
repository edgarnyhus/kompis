<template>
    <div class="component">
        <b-card> 
            <div v-if="!languages[0] && mode!=='edit'">
                <h5 class="text-muted">Språk
                    <b-button v-if="!isMobile" class="btn-floating btn-secondary float-right" @click="id=null; mode='edit'">Legg til emne</b-button>
                    <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                </h5>
                <p class="b-card-text" style="font-style: italic">Hvilke språk kan du snakke?</p>
            </div>

            <div v-else>
                <b-collapse class="mt-2" id="listExp" :visible="mode==='list'">
                    <h5 class="text-muted">Språk
                        <b-link v-if="!isMobile" class="g-link float-right" @click="id=null; mode='edit'"><strong>Legg til et språk</strong></b-link>
                        <span v-else><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="id=null; mode='edit'">add</i></span>
                    </h5>
                    <div style="margin-bottom: 1em"></div>
                    <language-list v-on:editLanguage="editLanguage" :languages="languages" :uid="user_id" :cid="cert_id" :id="id"></language-list>
                </b-collapse>
            </div>

            <b-collapse class="mt-2"  id="editExp" :visible="mode==='edit'">
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
            mode: 'list'
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        editLanguage(id) {
            if (id) {
                this.id = id
                this.mode = 'edit'
            }
        },
        onUpdatedLanguage(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            if (id) {
                this.fetchData()
            }
            this.mode = 'list'
        },
        fetchData() {
            if (this.user) {
                this.languages = []
                let ref = null
                if (this.cert_id) {
                    ref = db.collection('languages').where('user_id', '==', this.cert_id)
                } else {
                    ref = db.collection('languages').where('user_id', '==', this.user_id)
                }
                ref.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        elem.media = this.fetchMedia('media', doc.id)
                        elem.links = []
                        this.languages.push(elem)
                    })
                })
                .catch(error=> {
                    console.log('mc fetching Language failed', error)
                })
            }
        },
        fetchMedia(coll, id) {
            let media = []
            db.collection(coll).where('parent_id', '==', id)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let elem = doc.data()
                    elem.id = doc.id
                    media.push(elem)
                })
            })
            .catch(error=> {
                console.log('fetching media failed', error)
            })
            return media
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
            this.fetchData()
        }
    }
    
}
</script>

<style>

</style>
