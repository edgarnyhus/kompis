# kompis

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install
npm install moment --save
npm install firebase --save
npm install bootstrp-vue --save

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

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
