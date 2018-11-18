<template>
    <div>
        <slot>
        <!-- present a card for each job training/experience -->
        <b-card-group v-for="elem in experience" :key="elem.id">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">{{ elem.employer }}
                        <!-- <md-button class="md-fab md-mini md-primary float-right" >
                            <menu-icon>edit</menu-icon>
                        </md-button>
                        <md-button class="md-fab md-mini md-primary float-right" >
                            <menu-icon>delete</menu-icon>
                        </md-button> -->
                        <b-link class="btn-floating float-right btn-sm" @click="updateTraining(elem)">Endre</b-link>
                        <b-link class="button-span btn-floating float-right btn-sm" @click="removeTraining(elem)">Slett</b-link>
                    </h6>
                    <h5 class="card-subtitle text-muted">{{elem.role}}</h5>
                    <!-- <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from.month}} {{elem.from.year}} - {{ elem.to.month }} {{elem.to.year}}<br> -->
                    <p class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}<br>
                        {{elem.place}}</P>
                    <p class="card-text">{{elem.description}}</p>
                </div>
            </div>
        </b-card-group>
        </slot>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'WorkExperienceView',
    data() {
        return {
            experience: [],
            user: null,
            cert_id: null,
            wid: null
        }
    },
    props: ['cid', 'id'],
    methods: {
        cancel() {
            console.log("cancel")
            this.$emit(this.reason, null)
        },
        removeTraining(elem) {
            db.collection('experience').doc(elem.id).delete()
            .then(() => {
                console.log("pc document successfully deleted!");
                if (elem) {
                    let ix = this.experience.findIndex(e => e.id === elem.id)
                    if (~ix) {
                        this.experience.splice(ix, 1)
                    }
                }
            }).catch(error => {
                console.error("pc error removing praksissted: ", error);
                alert(error)
            })
        },
        updateTraining(elem) {
            this.id = elem.id; this.selectedComponent = 'WorkExperience'            
        },
        onUpdatedTraining(id) {
            // child component (slot) signaled finished
            console.log('updated event from child, ID=', id)
            this.selectedComponent = null
            if (id) {
                this.fetchTraining()
            }
        },
        fetchData() {
            if (this.user && this.wid) {
                // get object
                db.collection('experience').doc(this.wid)
                .get()
                .then ((doc) => {
                    if(doc.exists) {
                        this.form = doc.data()
                        this.from.month = getMonth(this.form.from)
                        this.from.year = getYear(this.form.from)
                        this.to.month = getMonth(this.form.to)
                        this.to.year = getYear(this.form.to)
                    }
                })
                .catch((error) => {
                    console.error("WE Error fetching document: ", error);
                    alert(error)
                });
            }            
        }
        
    },
    created() {
        this.cert_id  = this.cid
        this.wid = this.id
        this.user = firebase.auth().currentUser
        console.info('WEW created, CID=', this.form.cert_id, "WID=", this.wid)
        this.fetchData()       
    }
}
</script>

<style>

</style>

