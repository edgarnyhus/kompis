# kompis

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install
npm install slugify --save
npm install moment --save
npm install firebase --save
npm install bootstrp-vue --save
npm install vue-material --save
npm install vue-pdf --save
npm install axios --save

# initialize firebasse
firebase login

# returns:
ttps://accounts.google.com/o/oauth2/auth?client_id=563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com&scope=email%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloudplatformprojects.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffirebase%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&response_type=code&state=499001397&redirect_uri=http%3A%2F%2Flocalhost%3A9005
firebase init

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

#publiish to Firebase
firebase deploy

# build Firebase functions and install needed packafes
cd functions
npm install firebase-functions@latest --save
npm install firebase-admin@latest --save-exact
npm install --save @google-cloud/storage
npm install --save child-process-promise

# Functions
# define the Web API Key in functions environment config
firebase functions:config:set applinks.key="AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA"
firebase functions:config:set applinks.domain="https://cvue.page.link"
firebase functions:config:set gmail.email="cv.kompis@gmail.com" gmail.password="uUamHD8SC9"
firebase functions:config:get
{
  "applinks": {
    "key": "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA",
    "domain": "https://cvue.page.link"
  },
  "gmail": {
    "password": "uUamHD8SC9",
    "email": "cv.kompis@gmail.com"
  }
}
firebase functions:config:unset key1 key2 removes the specified keys from the config

# build for production and view the bundle analyzer report
npm run build --report
```


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
