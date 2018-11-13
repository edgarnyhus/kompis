<template>
    <div class="component">
        <b-card-group v-for="elem in references" :key="elem.id">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ elem.person }}
                        <b-link class="btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                        <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </h5>
                    <h6 class="card-subtitle text-muted">{{ elem.about }}</h6>
                    <p class="card-text">{{elem.description}}</p>
                </div>
            </div>
        </b-card-group>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    props: ['references'],
    data: function() {
        return {
            reason: 'editReference'
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('references').doc(elem.id).delete()
            .then(() => {
                console.log("document successfully deleted!");
                if (elem) {
                    let ix = this.references.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.references.splice(ix, 1)
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

