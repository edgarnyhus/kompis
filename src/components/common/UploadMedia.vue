<template>
    <div class="component">
        <div v-if="!profile">
            <p class="g-header"><strong>Dokumentasjon</strong></p>
            <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
        </div>
        <div class="g-group">
            <div v-if="profile">
                <h6 class="mt-0 mb-1">Last opp bilde av deg selv</h6>
                <p style="margin-top: 0.5em">Bildet bør være minst 100 x 100 pixler</p>
                <!-- <b-button class="g-btn"><strong>Last opp bilde</strong></b-button> -->
                <b-button class="g-btn" @click="setInitial"><strong>Last opp bilde</strong></b-button>
            </div>
            <div v-else>
                <b-button class="g-span" @click="setInitial" variant="secondary">Last opp</b-button>
                <!-- <input type="file" style="display: none" @change="onFilePicked($event)" ref="fileInput" accept="*"> -->
                <b-button @click="setLinking" variant="secondary">Lenke</b-button>
                <!-- <p v-if="uploadError" style="color: red; margin-top: 0.4em"> {{ uploadError }}</p> -->
            </div>

            <!--LINK-->
            <div v-if="isLinking" style="margin-top: 1em">
                <label for="name"><strong>Angi et navn på lenken</strong></label>
                <b-input-group>
                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" id="name" type="text" v-model="link.name" required placeholder="Eks. Attest fra NN"></b-form-input>
                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" id="url" type="text" v-model="link.url" required placeholder="Eks. http://example.com/documents/mydocument.opt"></b-form-input>
                    <b-input-group-append>
                        <div v-if="this.$smallScreen">
                            <md-button class="md-fab md-mini float-right" @click="addLink" style="margin-top: 0; margin-right: 0"><md-icon>add</md-icon></md-button>
                        </div>
                        <div v-else>
                            <b-btn @click="addLink" variant="secondary">Legg til</b-btn>
                        </div>
                    </b-input-group-append>
                </b-input-group>
            </div>

            <!--UPLOAD-->
            <form enctype="multipart/form-data" novalidate v-if="isInitial">
                <div class="dropbox">
                    <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                        accept="*/*" class="input-file">
                    <p v-if="isInitial">
                        Dra filen(e) hit<br> eller kilkk i rammen for å velge fil(er)
                    </p>
'                    <p v-if="isSaving">
                        Laster opp {{ fileCount }} filer...
                    </p>
                </div>
            </form>

            <!--SAVING-->
            <div v-if="isSaving">
                <div style="margin-top: 1em">
                    <b-progress :value="100" variant="info" striped :animated="animated" class="mb-2"></b-progress>
                    <!-- <md-progress-spinner :md-diameter="30" :md-stroke="5" md-mode="indeterminate" style="top-margin: 1em"></md-progress-spinner> -->
                    <!-- <progress-spinner></progress-spinner> -->
                </div>
            </div>

            <!--SUCCESS-->
            <div v-if="isSuccess">

            </div>

            <!--FAILED-->
            <div v-if="isFailed">
                <p style="color: red; margin-top: 0.6em; margin-bottom: 0">En feil oppsto. {{ uploadError }}</p>
            </div>
        </div>
    </div>
</template>

<script>
// make upload swapable? ...for alternative methods
import firebase from 'firebase'
import db from '@/firebase/init'
import 'firebase/storage';
// import 'vue-material/dist/theme/default.css'
import ProgressSpinner from './ProgressSpinner'


const STATUS_NONE = 0, STATUS_INITIAL = 1, STATUS_SAVING = 2, STATUS_SUCCESS = 3, STATUS_FAILED = 4, STATUS_LINKING = 5;

export default {
    name: 'UploadMedia',
    components: {
        ProgressSpinner
    },
    props: ['profile', 'uid', 'cid', 'media', 'links'],
    data() {
        return {
            link: { name: null, url: null, description: null },
            fileCount: 0,
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'media',
            progress: 20,
            animated: true,
            reason: 'addedPicture'
        }
    },
    computed: {
        isInitial() {
            return this.currentStatus === STATUS_INITIAL;
        },
        isSaving() {
            return this.currentStatus === STATUS_SAVING;
        },
        isSuccess() {
            return this.currentStatus === STATUS_SUCCESS;
        },
        isFailed() {
            return this.currentStatus === STATUS_FAILED;
        },
        isLinking() {
            return this.currentStatus === STATUS_LINKING;
        }
    },
    methods: {
        reset() {
            // reset form to initial state
            this.currentStatus = STATUS_NONE;
            this.uploadedFiles = [];
            this.uploadError = null;
            this.fileCount  = 0;
        },
        setInitial() {
            //this.reset()
            this.currentStatus = STATUS_INITIAL;
        },
        setLinking() {
            this.currentStatus = STATUS_LINKING;
        },
        add(formData) {
            if (formData) {
                const file = formData.get('media')
                let elem = { filename: file.name, type: file.type, url: formData.get('url'), description: '' }
                // console.log('add media', elem)
                if (this.profile) {
                    // this.profile.picture = elem.url
                    this.$emit(this.reason, elem)
                } else {
                    this.media.push(elem)
                }
            }
        },
        upload(formData) {
            // upload data to the server
            this.currentStatus = STATUS_SAVING;

            const file = formData.get('media')
            firebase.storage().ref('media').child(file.name)
            .put(file)
            .then (() => {
                firebase.storage().ref('media').child(file.name).getDownloadURL()
                .then (url => {
                    this.currentStatus = STATUS_SUCCESS;
                    formData.append('url', url)
                    console.log('upload, url=', url)
                    this.add(formData)
                })
                .catch((error) => {
                    console.error(error)
                    this.uploadError = error.response;
                    this.currentStatus = STATUS_FAILED;
                })
            })
            .catch((error) => {
                console.error(error)
                this.uploadError = error.response;
                this.currentStatus = STATUS_FAILED;
            })
        },
        filesChange(fieldName, fileList) {
            // handle file changes
            if (!fileList.length)
                return;

            // append the files to FormData
            const formData = new FormData();
            Array
                .from(Array(fileList.length).keys())
                .map(item => {
                    formData.append(fieldName, fileList[item], fileList[item].name);
                });

            // save it
            this.upload(formData);
        },
        addLink() {
            try {
                this.links.forEach(element => {
                    if (element.url === this.link.url) {
                        throw new Error('Denne lenken finnes allerede.');
                    }
                });
                this.links.push(this.link)
                // console.log('link', this.link)
                this.currentStatus = STATUS_SUCCESS;
            } catch(error) {
                this.uploadError = error.message
                this.currentStatus = STATUS_FAILED;
            }
        }
    },
    mounted() {
        this.reset();
    },
    activated() {
        this.reset()
    }
}

</script>

<style scoped>
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
b-progress {
    height: 10px;
    width: 300px;
}
.g-header {
    margin-bottom: 0;
}
.g-btn {
    background: #eeeeea;
    color: #515151;
    border: none;
}
</style>