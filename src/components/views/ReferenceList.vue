<template>
    <div class="component">
        <div v-for="elem in references" :key="elem.id">
            <div class="g-group">
                <div v-if="!isMobile">
                    <b-link class="gb-link btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                    <b-link class="gb-link button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                </div>
                <div v-if="isMobile">
                    <span><i class="material-icons md-light float-right g-icon" style="color: #767676"  @click="edit(elem)">edit</i></span>
                    <span><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="remove(elem)">delete</i></span>
                </div>
                <h5 class="card-title">{{ elem.person }}</h5>
                <p class="card-subtitle text-muted" style="margin-bottom: 0.5em">Email: {{elem.email}}<br>
                    Telefon: {{elem.phone}}
                </p>
                <p class="card-text">{{elem.description}}</p>

                <!-- <b-link @click="more=true">se mer...</b-link> -->
                <media-list v-if="more" @click="showMore()" :media="elem.media" :links="elem.links"></media-list>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import MediaList from '@/components/common/MediaList'

export default {
    components: {
        MediaList
    },
    props: ['references'],
    data: function() {
        return {
            more: true,
            reason: 'editReference'
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        remove: function(elem) {
            db.collection('references').doc(elem.id).delete()
            .then(() => {
                // console.log("document successfully deleted!");
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
            // console.log('edit:', elem.id)
            this.$emit(this.reason, elem.id)
        }
    }
}
</script>

<style>

</style>

