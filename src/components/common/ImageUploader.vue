<template>
    <div class="component">
        <p class="g-title2"><strong>Dokumentasjon</strong></p>
        <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
        <div class="g-group">
            <b-button class="g-span" @click="reset(); isInitial=true" variant="secondary">Last opp</b-button>
            <!-- <input type="file" style="display: none" @change="onFilePicked($event)" ref="fileInput" accept="*"> -->
            <b-button @click="addLink()" variant="secondary">Lenke</b-button>
            <p v-if="uploadError" style="color: red; margin-top: 0.4em"> {{ errorMessage }}</p>
 
            <!--UPLOAD-->
            <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <div class="dropbox">
                    <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                        accept="*/*" class="input-file">
                    <p v-if="isInitial">
                        Dra filen(e) hit<br> eller kilkk i rammen for å velge fil(er)
                    </p>
                    <p v-if="isSaving">
                        Laster opp {{ fileCount }} filer...
                    </p>
                </div>
            </form>

            <!--SUCCESS-->
            <div v-if="isSuccess">
                <p>Lastet opp {{ fileCount }} fil(er)</p>
                <!-- <ul class="list-unstyled">
                    <li v-for="item in uploadedFiles">
                        <img :src="item.url" class="img-responsive img-thumbnail" :alt="item.originalName">
                    </li>
                </ul> -->
            </div>

            <!--FAILED-->
            <div v-if="isFailed">
                <p style="color: red">opplastingen feileg.</p>
                <p>
                <a href="javascript:void(0)" @click="reset()">Prøv igjen</a>
                </p>
                <pre>{{ uploadError }}</pre>
            </div>
            </div>
        </div>

</template>

<script>
// make upload swapable? ...for alternative methods
import firebase from 'firebase'
import db from '@/firebase/init'
import 'firebase/storage';

  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

  export default {
    name: 'app',
    props: ['uid', 'cid'],
    data() {
      return {
        fileCount: 0,
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'media',
        reason: 'input'
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
      }
    },
    methods: {
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.uploadedFiles = [];
        this.uploadError = null;
        this.fileCount  = 0;
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
                this.fileCount++;
                this.currentStatus = STATUS_SUCCESS;
                formData.append('url', url)
                console.log('upload, url=', url)
                this.$emit(this.reason, formData)
            })
            .catch((error) => {
                console.log(error)
                this.uploadError = error.response;
                this.currentStatus = STATUS_FAILED;
                this.$emit(this.reason, null)
            })
        })
        .catch((error) => {
            console.log(error)
            this.uploadError = error.response;
            this.currentStatus = STATUS_FAILED;
            this.$emit(this.reason, null)
        })

        // const BASE_URL = 'http://localhost:3001';
        // const url = `${BASE_URL}/media`;
        // return axios.post(url, formData)
        // // get data
        // .then(data => data.data)
        // // add url field
        // .then(data => data.map(img => Object.assign({},
        //     img, { url: `${BASE_URL}/images/${img.id}` })));

      },
      filesChange(fieldName, fileList) {
        // handle file changes
        if (!fileList.length) return;

        // append the files to FormData
        const formData = new FormData();
        Array
          .from(Array(fileList.length).keys())
          .map(item => {
            formData.append(fieldName, fileList[item], fileList[item].name);
          });

        // save it
        this.upload(formData);
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

<style>
  .dropbox {
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