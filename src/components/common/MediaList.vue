<template>
    <div class="component">
        <ul class="list-unstyled" style="margin-top: 1em">
            <div class="row">
                <div class="col-md-2" v-for="(item, index) in media" :key="index" style="margin-top: 0.5em; margin.-bottom: 1em">
                    <div class="card h-100" >
                        <h5 class="card-subtitle" style="font-size: 12px; margin: 10px"><strong>{{ item.filename.substring(0,11) }}...</strong></h5>
                        <img class="card-img-top" style="font-size: 12px" :src="item.url" @click="show(item)" :alt="item.type">
                        <span><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="remove(item)">delete</i></span>
                        <!-- <span><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="remove(item)">delete_outline</i></span> -->
                    </div>
                </div>
            </div>

            <show-media v-if="showFile" v-on:onFileClose="onFileClose" :file="file"></show-media>

            <b-media tag="li" v-for="item in links" :key="item.url" style="margin-bottom: 0.5em">
                <b-link href="item.url">Link</b-link>
                <p style="margin-bottom: 5px">{{ item.description }}</p>
            </b-media>
        </ul>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ShowMedia from '@/components/common/ShowMedia'

export default {
    name: 'MediaList',
    components: {
        ShowMedia
    },
    props: ['uid', 'cid', 'id', 'media', 'links'],
    data() {
        return {
            file: null,
            showFile: false
        }
    },
    methods: {
        remove: function(item) {
            console.log('remove', item.filename, item.id)
            if (item.id) {
                db.collection('media').doc(item.id).delete()
                .then(() => {
                    console.log('media deleted in database/media')
                }).catch(error => {
                    console.info("error removing media; not saved yet?...", error);
                    // alert(error)
                })
            }

            // Delete from Storage
            firebase.storage().ref('media').child(item.filename).delete()
            .then(() => {
                // File deleted successfully
                console.log("media successfully deleted from storage!");
            }).catch((error) => {
                // Uh-oh, an error occurred!
                console.error("error removing media from storage", error);
            });

            // Remove from array
            let ix = this.media.findIndex(e => e.id === item.id)
            if (~ix) {
                this.media.splice(ix, 1)
            }
        },
        show(item) {
            console.log('show', item)
            this.file = item
            window.open(item.url)
        },
        onFileClose() {
        }
    },
    mounted() {

    }
}
</script>

<style scoped>
img {
    border: 1px;
    border-color: rgb(242,242,242);
    border-radius: 6px;
    cursor: pointer;
}
.dropbox {
    margin-top: 7px;
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: #f7f7f7;
    color: dimgray;
    padding: 10px 10px;
    min-height: 100px; /* minimum height */
    position: relative;
    cursor: pointer;
}

.input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
}

.dropbox:hover {
    background: #f2f2f2; /* when mouse over to the drop zone, change color */
}

.dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
}
.g-icon { 
    color: rgb(80,80,80);
    cursor: pointer;
}
</style>

