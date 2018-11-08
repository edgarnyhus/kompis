<template>
    <div class="component">
        <p class="g-title2"><strong>Dokumentasjon</strong></p>
        <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
        <div class="g-group">
            <b-button class="g-span" @click="onPickFile()" variant="secondary">Last opp</b-button>
            <input type="file" style="display: none" @change="onFilePicked($event)" ref="fileInput" accept="image/*">
            <b-button @click="addLink()" variant="secondary">Lenke</b-button>
            <p v-if="errorMessage" style="color: red; margin-top: 0.4em"> {{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
// import storage from 'firebase/storage'
import 'firebase/storage';

export default {
    props: ['uid'],
    data () {
        return {
            progressUpload: 0,
            media: {
                base64: null,
                raw: null
            },
            uploadTask: '',
            errorMessage: '',
            reason: 'input'
        }
    },
    methods: {
        onPickFile() {
            this.$refs.fileInput.click()
            this.errorMessage = ''
        },
        onFilePickedA(event) {
            var file= event.target.files[0];
            let url = null
            var percentage = 0

            //create storage ref to the firebase storage
            var storageRef = firebase.storage().ref('media').child(file.name);
            var task = storageRef.put(file)
            task.on("state_changed", function(snapshot) {
                var percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                if (percentage == 100) {
                    storageRef.getDownloadURL()
                    .then(function(u) {
                        url = u
                        // You will get the Url here.
                        // var firebaseRef = firebase.database().ref("media")
                        // firebaseRef.push(url)
                        // .then(() => {
                        //     this.errorMessage ="Image Uploaded and also updated to the database"
                        // })
                        // .catch((error) => {
                        //     console.log(error)
                        //     this.errorMessage = error.message
                        // })
                    })
                }
            })
            if (percentage >= 100)
                this.$emit(this.reason, url)
        },
        onFilePicked(event) {
            const file = event.target.files[0]
            let filename = file.name // there is only one file
            const ext = filename.slice(filename.lastIndexOf('.'))

            // check if file has an extension (i.e. .jpg or .png)
            if (filename.lastIndexOf('.') <= 0) {
                this.errorMessage = 'Please add a valid file'
                return
            }
            // convert the binary file into a base64 value 'string'
            // const fileReader = new FileReader()
            // fileReader.addEventListener('load', () => {
            //     this.media.base64 = fileReader.result
            // })
            // fileReader.readAsDataURL(files[0])

            // store raw media object to firebase

            let key = (this.uid ? this.uid + '-' : '') + filename
            let metadata = {
                contentType: 'image/' + ext,
            };
            
            firebase.storage().ref('media').child(file.name)
            .put(file)
            .then (() => {
                firebase.storage().ref('media').child(file.name).getDownloadURL()
                .then (url => {
                    this.$emit(this.reason, url)
                })
                .catch((error) => {
                    console.log(error)
                    this.errorMessage = error.message
                    this.$emit(this.reason, null)
                })
            })
            .catch((error) => {
                console.log(error)
                this.errorMessage = error.message
                this.$emit(this.reason, null)
            })
        }
    }
}
</script>

<style>

</style>