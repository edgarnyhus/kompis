<template>
    <div class="component">
        <div v-for="elem in education" :key="elem.id">
            <!-- <div class="card"> -->
                <!-- <div class="card-body"> -->
                    <h6 class="card-title">{{ elem.school }}
                        <b-link class="btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                        <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </h6>
                    <h5 class="card-subtitle">{{elem.study}}</h5>
                    <p  v-if="elem.ongoing" class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - (Studerer her forsatt)</p>
                    <p v-else class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}</p>
                    <p class="card-text">{{elem.description}}</p>
                <!-- </div> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    props: ['education'],
    data: function() {
        return {
            reason: 'editEducation'
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('education').doc(elem.id).delete()
            .then(() => {
                console.log("document successfully deleted!");
                if (elem) {
                    let ix = this.education.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.education.splice(ix, 1)
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

