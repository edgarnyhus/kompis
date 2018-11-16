<template>
    <div class="component" style="margin-top: 0">
        <div v-for="elem in keyvalues" :key="elem.id">
            <div class="g-group">
                <h5 class="card-subtitle">{{ elem.keyvalue }}
                    <b-link class="btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                    <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                </h5>
                <p class="card-text" style="margin-top: 0.5em">{{elem.description}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    props: ['keyvalues'],
    data: function() {
        return {
            reason: 'editKeyValue'
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('keyvalues').doc(elem.id).delete()
            .then(() => {
                console.log("document successfully deleted!");
                if (elem) {
                    let ix = this.keyvalues.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.keyvalues.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("error removing praksissted: ", error);
                alert(error)
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
.g-group {
    margin-top: 1em
}
</style>

