const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const urlBuilder = require('build-url');
const request = require('request-promise-native');
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport')

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'KOMPIS';

// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);


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
    let key = 'AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA'
    // let url = 'https://www.googleapis.com/urlshortener/v1/url?key=' + key
    let url = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + key
    // let fullUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA'

    // axios({
    //     method: 'post',
    //     url: url,
    //     data: {
    //         // shortLink: 'https://cvue.page.link',
    //         "dynamicLinkInfo": {
    //             "domainUriPrefix": "https://cvue.page.link",
    //             "link": "https://cvue-bf9ec.firebaseapp.com/",
    //             "navigationInfo": {
    //                 "enableForcedRedirect": boolean,
    //             },
    //         },
    //         "suffix": {
    //             "option": "SHORT"
    //         }
    //     },
    //     json: true
    // })
    // .then(response => {
    //     // let shortLink = response.json.getShortLink()
    //     // return ({ shortLink: shortLink })
    //     return ({ response: response })
    // })
    // .catch(error => {
    //     throw new functions.https.HttpsError('failed to get shortLink')
    // })

    // axios({
    //     method: 'get',
    //     url: 'https://jsonplaceholder.typicode.com/posts/',
    //     json: true
    // })
    // .then(response => {
    //     return ({ response: response })
    // })
    // .catch(error => {
    //     throw new functions.https.HttpsError('failed to get shortLink')
    // })

    const options = {
        method: 'GET',
        uri: 'https://jsonplaceholder.typicode.com/posts/',
        json: true
    };

    rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody);
        return parsedBody;
    })
    .then((result) => {
        return {result: result};
    })

    // const options = {
    //     method: 'POST',
    //     // uri: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${functions.config().applinks.key}`,
    //     url: url,
    //     body: {
    //         'dynamicLinkInfo': {
    //             'domainUriPrefix': 'https://cvue.page.link',
    //             'link': 'https://cvue-bf9ec.firebaseapp.com/',
    //             'navigationInfo': {
    //                 'enableForcedRedirect': boolean,
    //             },
    //         },
    //         'suffix': {
    //             'option': 'SHORT'
    //         }  
    //     },
    //     json: true
    // };

    // request(options)
    // .then(function (parsedBody) {
    //     console.log(parsedBody);
    //     return parsedBody.shortLink;
    // })
    // .then((shortLink) => {
    //     post.shareUrl = shortLink;
    //     console.log('short link: ' + shortLink);
    //     return event.data.ref.set(post);
    // })


    // var data = 
    // {
    //     'dynamicLinkInfo': 
    //     {
    //         'dynamicLinkDomain': 'https://cvue.page.link',
    //         'link': 'https://cvue-bf9ec.firebaseapp.com/'
    //     },
    //     'suffix': 
    //     {
    //         'option': 'SHORT'
    //     }
    // };

    // var options = 
    //     {
    //     'method': 'post',
    //     'contentType': 'application/json',
    //     'payload' : JSON.stringify(data)
    //     };

    // var response = UrlFetchApp.fetch(dynamicLinkURL, options);
    // response = JSON.parse(response.getContentText());
    // // response.shortLink contains something like 

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

// Sends a email to the given user.
exports.sendInviteEmail = functions.https.onCall((data, context) => {
    const mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: email,
        html: 'https://cvue-bf9ec.firebaseapp.com/'
    };

    mailOptions.subject = `Du er invitert til ${APP_NAME}!`,
    mailOptions.text = `Hei ${data.email || ''}! ${data.from} ønsker å dele sine data med deg på ${'https://cvue-bf9ec.firebaseapp.com/'}.`;
    return mailTransport.sendMail(mailOptions)
    .then(() => {
        return console.log('New share invite email sent to:', data.email)
    })
    .catch((error) => {
        console.error('There was an error while sending the email:', error)
    })
})
