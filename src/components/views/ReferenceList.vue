<template>
    <div class="component">
        <div v-for="elem in references" :key="elem.id">
            <div class="g-group">
                <h5 class="card-title">{{ elem.person }}
                    <b-link class="btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                    <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                </h5>
                <p class="card-subtitle text-muted" style="margin-bottom: 0.5em">Email: {{elem.email}}<br>
                    Telefon: {{elem.phone}}
                </p>
                <p class="card-text">{{elem.description}}</p>
            </div>
        </div>
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

