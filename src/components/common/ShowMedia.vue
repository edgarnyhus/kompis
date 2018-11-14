<template>
    <div class="component">
        <h5>Innhold</h5>
        <b-button class="" @click="close" variant="secondary">Lukk</b-button>

        <!-- <video width="320" height="240" controls> -->
        <!-- <video v-if="useVideoTag" width="320" height="240" controls>
            <source src="file.url" type="file.type">
        </video>
        
        <embed v-else-if="useEmbedTag" src="file.url" autostart="false" width="320" height="240" />

        <iframe v-else-if="useIFrameTag" src="embedGoogle"></iframe>

        <img v-else src="file.url" > -->
        <img src="https://firebasestorage.googleapis.com/v0/b/cvue-b…=media&token=d9d0dd6e-ec75-4186-869f-53fb49aade6c" width="800px" height="600px">

        <iframe src='https://firebasestorage.googleapis.com/v0/b/cvue-b…=media&token=10972099-8630-4647-afb6-814803fd20f1' width='800px' height='600px' frameborder='0'></iframe>

    </div>
</template>

<script>
export default {
    name: 'ShoeMedia',
    components: {

    },
    props: ['file'],
    data() {
        return {
            // file: null
            reason: 'onFileClose'
        }
    },
    computed: {
        useVideoTag() {
            console.log('useVideoTag', file.type)
            return (file.type.endsWith('mp4') || file.type.endsWith('webm') || file.type.endsWith('ogg'))
        },
        useEmbedTag() {
            return (file.type.endsWith('swf') || file.type.endsWith('wmv') || 
                file.type.endsWith('mov') || file.type.endsWith('mpeg'))
        },
        useIFrameTag() {
            return (file.type.endsWith('doc') || file.type.endsWith('docx') || file.type.endsWith('odt'))
        },
        embedGoogle() {
            return ("http://docs.google.com/gview?url=" + this.file.url +"&embedded=true")
        }
    },
    methods: {
        close() {
            this.$emit(this.reason)
        }
    },
    mounted() {
        console.log('mounted')
        // this.file = this.$route.params.file
    }
}
</script>

<style>

</style>
