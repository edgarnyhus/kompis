<template>
    <div class="component">
        <!-- <div class="form-group">
            <v-btn raised class="primary" @click="onPickFile">Last opp</v-btn>
            <input type="file" style="display: none" @change="onFilePicked" ref="fileInput" accept="image/*">
        </div> -->

            <p class="g-title2"><strong>Dokumentasjon</strong></p>
            <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
            <div class="g-group">
                <b-button class="g-span" @click="onPickFile()" variant="secondary">Last opp</b-button>
                <input type="file" style="display: none" @change="onFilePicked($event)" ref="fileInput" accept="image/*">
                <b-button @click="addLink()" variant="secondary">Lenke</b-button>
            </div>

            <!-- error dialog displays any potential errors -->
        <v-dialog v-model="errorDialog" max-width="300">
            <v-card>
                <v-card-text class="subheading">{{ errorText }}</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="errorDialog = false" flat>Jeg skjønner!</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import firebase from 'firebase'
import 'firebase/storage'

export default {
 
    data () {
        return {
            progressUpload: 0,
            media: {
                base64: null,
                raw: null
            },
            uploadTask: '',
            reason: 'add_media'
        }
    },
    methods: {
        onPickFile() {
            this.$refs.fileInput.click()
        },
        onFilePicked(event) {
            const files = event.target.files
            let filename = files[0].name // there is only one file
            const ext = filename.slice(filename.lastIndexOf('.'))

            // check if file has an extension (i.e. .jpg or .png)
            if (filename.lastIndexOf('.') <= 0) {
                alert('Please add a valid file')
                return
            }
            // convert the binary file into a base64 value 'string'
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.media.base64 = fileReader.result
            })
            fileReader.readAsDataURL(files[0])

            // store raw media object to firebase
            firebase.storeage().ref('meetups/' + key + '.' + ext).put(payload.image)
            .then(fileData => {
                imageUrl = fileData.metadata.downloadURLs[0]
                return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
            })
            .then(() => {
                // edgar: wait with the commit
                commit('createMeetup', {
                    ...meetup,
                    imageUrl: imageUrl,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })

            // store the raw image
            this.media.raw = files[0]
            this.$emit(this.reason, this.media)
        },
    }
}
</script>

<style>

</style>