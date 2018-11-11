import * as axios from 'axios';

const BASE_URL = 'http://localhost:3001';

// function upload(formData) {
//     const url = `${BASE_URL}/photos/upload`;
//     return axios.post(url, formData)
//         // get data
//         .then(x => x.data)
//         // add url field
//         .then(x => x.map(img => Object.assign({},
//             img, { url: `${BASE_URL}/images/${img.id}` })));
// }


function upload(formData) {
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
        return firebase.storage().ref('media').child(file.name).getDownloadURL()
        .then(x => x.data)
        // add url field
        .then(x => x.map(img => Object.assign({},
            img, { url: `${BASE_URL}/images/${img.id}` })
        ));
        // .catch((error) => {
        //     console.log(error)
        //     this.errorMessage = error.message
        //     this.$emit(this.reason, null)
        // })
    })
    // .catch((error) => {
    //     console.log(error)
    //     this.errorMessage = error.message
    //     this.$emit(this.reason, null)
    // })
}

export { upload }
