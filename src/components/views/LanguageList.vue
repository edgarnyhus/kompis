<template>
    <div class="component">
        <!-- <b-card-group v-for="elem in languages" :key="elem.id"> -->
        <div v-for="elem in languages" :key="elem.id">
            <!-- <div class="card"> -->
                <!-- <div class="card-body"> -->
                    <h5 class="card-title">{{ elem.language }}
                        <b-link class="btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                        <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </h5>
                    <h6 class="card-subtitle text-muted">{{ elem.proficiency }}</h6>
                    <p class="card-text" style="margin-top: 0.5em">{{elem.description}}</p>
                <!-- </div> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    props: ['languages'],
    data: function() {
        return {
            reason: 'editLanguage'
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('languages').doc(elem.id).delete()
            .then(() => {
                console.log("document successfully deleted!");
                if (elem) {
                    let ix = this.languages.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.languages.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("error removing praksissted: ", error);
            })
        },
        edit: function(elem) {
            console.log('edit:', elem.id)
            this.$emit(this.reason, elem.id)
        }
    }
}
</script>

<style>

</style>

