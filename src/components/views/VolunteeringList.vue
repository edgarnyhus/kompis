<template>
    <div class="component">
        <!-- <b-card-group v-for="elem in volunteering" :key="elem.id"> -->
        <div v-for="elem in volunteering" :key="elem.id">
            <!-- <div class="card"> -->
                <div class="card-body">
                    <h6 class="card-title text-muted">{{ elem.org }}
                        <b-link class="btn-floating float-right btn-sm"  @click="edit(elem)">Endre</b-link>
                        <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </h6>
                    <h5 class="card-subtitle ">{{elem.role}}</h5>
                    <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}<br>
                        {{elem.location}}</P>
                    <p class="card-text">{{elem.description}}</p>
                </div>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    props: ['volunteering'],
    data: function() {
        return {
            reason: 'editVolunteering'
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('volunteering').doc(elem.id).delete()
            .then(() => {
                console.log("document successfully deleted!");
                if (elem) {
                    let ix = this.volunteering.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.volunteering.splice(ix, 1)
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

