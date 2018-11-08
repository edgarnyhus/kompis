<template>
    <div class="compnent">

    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    peops: [],
    methods: {
        getFile(url) {
            var img = document.getElementById('myimg');
            img.src = url;
        }
    }
}
</script>
