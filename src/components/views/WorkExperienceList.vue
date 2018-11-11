<template>
    <div class="component">
        <b-card-group v-for="elem in training" :key="elem.id">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">{{ elem.employer }}
                        <!-- <md-button class="md-fab md-mini md-primary float-right" >
                            <menu-icon>edit</menu-icon>
                        </md-button>
                        <md-button class="md-fab md-mini md-primary float-right" >
                            <menu-icon>delete</menu-icon>
                        </md-button> -->
                        <b-link class="btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                        <b-link class="button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </h6>
                    <h5 class="card-subtitle text-muted">{{elem.role}}</h5>
                    <!-- <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from.month}} {{elem.from.year}} - {{ elem.to.month }} {{elem.to.year}}<br> -->
                    <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}<br>
                        {{elem.place}}</P>
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
    props: ['training'],
    data: function() {
        return {
            reason: 'edittraining'
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('training').doc(elem.id).delete()
            .then(() => {
                console.log("PC Document successfully deleted!");
                if (elem) {
                    let ix = this.training.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.training.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("PC Error removing praksissted: ", error);
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

