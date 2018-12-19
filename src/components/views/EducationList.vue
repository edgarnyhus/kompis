<template>
    <div class="component">
        <div v-for="elem in education" :key="elem.id">
            <div class="g-group">
                <h6 class="card-title">{{ elem.school }}
                    <div v-if="!isMobile">
                        <b-link class="gb-link btn-floating float-right btn-sm" @click="edit(elem)">Endre</b-link>
                        <b-link class="gb-link button-span btn-floating float-right btn-sm" @click="remove(elem)">Slett</b-link>
                    </div>
                    <div v-if="isMobile">
                        <span><i class="material-icons md-light float-right g-icon" style="color: #767676"  @click="edit(elem)">edit</i></span>
                        <span><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="remove(elem)">delete</i></span>
                    </div>
                </h6>
                <h5 class="card-subtitle">{{elem.study}}</h5>
                <p  v-if="elem.ongoing" class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - (Studerer her forsatt)</p>
                <p v-else class="card-text text-muted" style="margin-bottom: 0.5em">{{elem.from | formatDate}} - {{elem.to | formatDate}}</p>
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
    props: ['education'],
    data: function() {
        return {
            more: true,
            reason: 'editEducation'
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
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

</style>

