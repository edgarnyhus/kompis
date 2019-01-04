const functions = require('firebase-functions');
const admin = require('firebase-admin');
const urlBuilder = require('build-url');
const request = require('request-promise');

admin.initializeApp(functions.config().firebase);


exports.checkAlias = functions.https.onCall((data, context) => {
    const ref = admin.firestore().collection('users').doc(data.slug)
    return ref.get()
    .then((doc) => {
        return { unique: !doc.exists }
    })
    .catch((error) => {
        throw new functions.https.HttpsError('failed to connect to database')
    })
})

exports.getShortLink = functions.https.onCall((data, context) => {
    // let apiKey = "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA";
    // let url = "https://www.googleapis.com/urlshortener/v1/url"
    console.log('share', apiKey)

    return new Promise((resolve, reject) => {
        axios.post({
            method: 'post',
            // url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
            url: `https://www.googleapis.com/urlshortener/v1/url?key=${functions.config().applinks.key}`,
            dynamicLinkInfo: {
                "domainUriPrefix": "https://cvue.page.link",
                "link": "https://cvue-bf9ec.firebaseapp.com/",
            },
            json: true
        })
        .then(response => {
            let shortLink = response.json.getShortLink()
            console.log('result', shortLink)
            resolve ({ shortLink: shortLink})
        })
        .catch(error => {
            console.error('error', error)
            // throw new functions.https.HttpsError('failed to get shortLink')
            reject(new functions.https.HttpsError('failed to get shortLink'))
        })
    })
})

/*
exports.postDynamicLink = functions.database.ref('Posts/{postId}')
    .onWrite(event => {
        let post = event.data.val();
        const postId = event.params.postId;

        if (post.addedDynamicLink) {
            return;
        }

        post.addedDynamicLink = true;

        const socialDescription = `Arvana Blog - ${post.title}`;
        const socialImageUrl = "http://res.cloudinary.com/jokam/image/upload/v1498378886/ar_blog_qeqjzu.png";

        const options = {
            method: 'POST',
            uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${functions.config().applinks.key}`,
            body: {
                "longDynamicLink": makeDynamicLongLink(postId, socialDescription, socialImageUrl)
            },
            json: true
        };

        request(options)
            .then(function (parsedBody) {
                console.log(parsedBody);
                return parsedBody.shortLink;
            })
            .then((shortLink) => {
                post.shareUrl = shortLink;
                console.log('short link: ' + shortLink);
                return event.data.ref.set(post);
            })

    });

function makeDynamicLongLink(postId, socialDescription, socialImageUrl) {
    return urlBuilder(`${functions.config().applinks.link}`, {
        queryParams: {
            link: "https://www.arvana.io/code/" + postId,
            apn: "io.arvana.blog",
            dfl: "https://www.arvana.io",
            st: "Arvana Blog - All you need to know about arvana",
            sd: socialDescription,
            si: socialImageUrl
        }
    });
}
*/
