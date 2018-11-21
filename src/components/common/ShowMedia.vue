<template>
    <div class="container">
        <b-modal ref="showMediaRef" :title="file.filename" size="lg">
            <b-button class="float-right" style="margin-bottom: 1em " @click="close" variant="secondary">Lukk</b-button>

            <!-- <video width="320" height="240" controls> -->
            <video v-if="useVideoTag" controls>
                <source :src="file.url" :type="file.type">
            </video>
            
            <embed v-else-if="useEmbedTag" :src="file.url" autostart="false"/>

            <iframe v-else-if="useIFrameTag" :src="embedGoogle"></iframe>

            <img v-else-if="useImg" :src="file.url" width="480" height="340">
            <!-- <img :src="file.url" width="480" height="340"> -->
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
            reason: 'onFileClose'
        }
    },
    computed: {
        useVideoTag() {
            let ret = (this.file.type.endsWith('mp4') || this.file.type.endsWith('webm') || this.file.type.endsWith('ogg'))
            console.log('useVideoTag', ret)
            alert('useVideoTag,' + ret)
            return ret
        },
        useEmbedTag() {
            let ret =  (this.file.type.endsWith('swf') || this.file.type.endsWith('wmv') || 
                this.file.type.endsWith('mov') || this.file.type.endsWith('mpeg'))
            console.log('useEmbedTag', ret)
            alert('useEmbedTag,' + ret)
            return ret
        },
        useIFrameTag() {
            // return (this.file.type.endsWith('doc') || this.file.type.endsWith('docx') || this.file.type.endsWith('odt'))
            let ret = (this.file.type.startsWith('application/'))
            console.log('useIFrameTag', ret)
            alert('useIFrameTag,' + ret)
            return ret
        },
        embedGoogle() {
            let ret = ("http://docs.google.com/gview?url=" + this.file.url +"&embedded=true")
            console.log('embedGoogle', ret)
            alert('embedGoogle,' + ret)
            return ret
        },
        useImg() {
            let ret = (this.file.type.endsWith('jpg') || this.file.type.endsWith('jpeg') || this.file.type.endsWith('png'))
            console.log('useImg', ret)
            alert('useImg,' + ret)
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
    }
}
</script>

<style>

</style>
