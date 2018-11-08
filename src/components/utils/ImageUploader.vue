<template>
    <div class="component">
        <!-- slot for parent component to activate the file changer -->
        <!-- <div @click="launchFilePicker()">
            <slot name="activator"></slot>
        </div> -->

        <p style="margin-bottom: 0"><strong>Dokumentasjon</strong></p>
        <p>Legg til eller link til eksterne dokumenter. bilder, sider, videoer og presentasjoner</p>
        <div class="g-group">
            <b-button class="g-span" @click="launchFilePicker()" variant="secondary">Last opp</b-button>
            <!-- <input type="file" style="display: none" @change="onFilePicked($event)" ref="fileInput" accept="image/*"> -->
            <!-- image input: style is set to hidden and assigned a ref so that it can be triggered -->
            <input type="file" ref="file" :name="uploadFieldName" @change="onFileChange($event.target.name, $event.target.files)" style="display:none">
            <b-button @click="addLink()" variant="secondary">Lenke</b-button>
            <p v-if="errorDialog" style="color: red">{{ errorText }}</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'image-input',
    data: ()=> ({
      errorDialog: null,
      errorText: '',
      uploadFieldName: 'file',
      maxSize: 1024
    }),
    props: {
    // Use "value" to enable using v-model
      value: Object,
    },
    methods: {
      launchFilePicker(){
        this.$refs.file.click();
      },
      onFileChange(fieldName, file) {
        const { maxSize } = this
        let imageFile = file[0]

        if (file.length>0) {
          let size = imageFile.size / maxSize / maxSize
          if (!imageFile.type.match('image.*')) {
            // check whether the upload is an image
            this.errorDialog = true
            this.errorText = 'Please choose an image file'
          } else if (size>1) {
            // check whether the size is greater than the size limit
            this.errorDialog = true
            this.errorText = 'Your file is too big! Please select an image under 1MB'
          } else {
            // Append file into FormData and turn file into image URL
            let formData = new FormData()
            let imageURL = URL.createObjectURL(imageFile)
            formData.append(fieldName, imageFile)
            // Emit the FormData and image URL to the parent component
            this.$emit('input', { formData, imageURL })
          }
        }
      }
    }
  }
</script>
