<template>
    <div class="component">
        <div v-for="elem in experience" :key="elem.id">
                <div class="g-group">
                    <h6 class="card-title">{{ elem.employer }}
                        <b-link class="gb-link btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                        <b-link class="gb-link button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </h6>
                    <h5 class="card-subtitle">{{ elem.role }}</h5>
                    <p v-if="elem.ongoing" class="card-text text-muted" style="margin-bottom: 0.5em">{{ elem.from | formatDate }} - (Jobber her nå)<br>
                        {{elem.location}}
                    </P>
                    <p v-else class="card-text text-muted" style="margin-bottom: 0.5em">{{ elem.from | formatDate }} - {{ elem.to | formatDate }}<br>
                        {{elem.location}}
                    </P>
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
    props: ['experience'],
    data: function() {
        return {
            more: true,
            reason: 'editExperience'
        }
    },
    methods: {
        remove: function(elem) {
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
        edit: function(elem) {
            console.log('experience edit:', elem.id)
            this.$emit(this.reason, elem.id)
        },
        showMore() {
            console.log('show more')
        }
    }
}
</script>

<style>

</style>

