<template>
    <div class="component">
        <ul class="list-unstyled" style="margin-top: 1em">
            <!-- <b-media tag="li" v-for="item in media" :key="item.url" style="margin-bottom: 0.5em">
                <p><strong>{{ item.filename, 10 | textTruncate}}</strong></p>
                <img :src="item.url" @click="show(item)" rounded slot="aside" class="mg-thumbnail" width="92" height="92" :alt="item.filename" style="padding-top: 0">
                <p>{{ item.description }}</p> -->
            <!-- </b-media> -->
            
            <div class="row">
                <div class="col-md-2" v-for="(item, index) in media" :key="index" style="margin-top: 0.5em; margin.-bottom: 1em">
                    <div class="card h-100" >
                        <h5 class="card-subtitle" style="font-size: 14px; margin: 10px"><strong>{{ item.filename}}</strong></h5>
                        <img class="card-img-top" :src="item.url" @click="show(item)" alt="item.type">
                        <!-- <div class="card-body"> -->
                        <!-- <p class="card-text">Product {{index}} - {{product.title}}</p> -->
                        <!-- <button v-on:click="addProductToCart(product)" class="btn btn-primary">Add To Cart</button> -->
                        <!-- </div> -->
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
        show(item) {
            console.log('show', item.url)
            this.file = item
            window.open(item.url)
            // const ref = this.$refs.showmodal
            // if(ref)
            //     ref.show()
            // this.$router.push({name: 'ShowMedia', params: { file: file }})

            // const ref = this.$refs.ShowFile
            // this.$set(ref, 'file', file)
            // this.$router.push({name: 'ShowMedia'})
        },
        // show(item) {
        //     this.file = item
        //     console.log('show', this.file)
        //     this.showFile = true
        // },
        onFileClose() {
            this.showFile = false
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
</style>

