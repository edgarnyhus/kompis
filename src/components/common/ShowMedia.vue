<template>
    <div class="component">
        <b-modal id="showMedia" :title="file.filename" size="lg">
            <b-button class="float-right" style="margin-bottom: 1em " @click="close" variant="secondary">Lukk</b-button>

            <!-- <video width="320" height="240" controls> -->
            <!-- <video v-if="useVideoTag" controls>
                <source :src="file.url" :type="file.type">
            </video>
            
            <embed v-else-if="useEmbedTag" :src="file.url" autostart="false"/>

            <iframe v-else-if="useIFrameTag" :src="embedGoogle"></iframe>

            <img v-else-if="useImg" :src="file.url"> -->
            <img :src="file.url" width="480" height="340">
        </b-modal>

    </div>
</template>

<script>
export default {
    name: 'ShowMedia',
    components: {

    },
    props: ['file'],
    data() {
        return {
            // this.file: null
            reason: 'onthis.fileClose'
        }
    },
    computed: {
        useVideoTag() {
            console.log('useVideoTag', this.file.type)
            return (this.file.type.endsWith('mp4') || this.file.type.endsWith('webm') || this.file.type.endsWith('ogg'))
        },
        useEmbedTag() {
            return (this.file.type.endsWith('swf') || this.file.type.endsWith('wmv') || 
                this.file.type.endsWith('mov') || this.file.type.endsWith('mpeg'))
        },
        useIFrameTag() {
            return (this.file.type.endsWith('doc') || this.file.type.endsWith('docx') || this.file.type.endsWith('odt'))
        },
        embedGoogle() {
            return ("http://docs.google.com/gview?url=" + this.this.file.url +"&embedded=true")
        },
        useImg() {
            let ret = (this.file.type.endsWith('jpg') || this.file.type.endsWith('jpeg') || this.file.type.endsWith('png'))
            console.log('useImg', ret, this.file.url)
            return ret

        }
    },
    methods: {
        close() {
            this.$emit(this.reason)
        }
    },
    created() {
        console.log('showmedia created',this.file)
        // this.this.file = this.$route.params.this.file
    }
}
</script>

<style>

</style>
