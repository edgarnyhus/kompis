const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
// const urlBuilder = require('build-url');
// const request = require('request-promise-native');
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport')

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'KOMPIS';

// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

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

exports.inviteUser = functions.https.onCall((data, context) => {
    const slug = data.slug
    const invitee = data.email
    const mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: invitee,
    };
    const postmarkKey = 'AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA' 
    // const mailTransport = nodemailer.createTransport(postmarkTransport({
    //     auth: {
    //         apiKey: postmarkKey
    //     }
    // }))
    const mailTransport = nodemailer.createTransport(
        `smtps://cv.kompis@gmail.com:6Lfw3x1rM%bTmFJZ@smtp.gmail.com`);
    
    //Sends a email to the given user.
    mailOptions.subject = `Du er invitert til ${APP_NAME}!`,
    mailOptions.html = `<p>Hei ${invitee || ''}!</p><p><strong>${slug}</strong> ønsker å dele sine data med deg på ${'https://cvue-bf9ec.firebaseapp.com/'}.</p><p>Med vennlig hilsen<br>${APP_NAME}</p>`;
    return mailTransport.sendMail(mailOptions)
    .then(() => {
        return ({ id: doc.id })
    })
    .catch((error) => {
        // throw new functions.https.HttpsError('failed to send invite email, ' + error)
        return ({ error: error })
    })
})

exports.getShortLink = functions.https.onCall((data, context) => {
    let apiKey = "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA";
    // let url = "https://www.googleapis.com/urlshortener/v1/url"
    console.log('share', apiKey)

    axios.post({
        method : 'post',
        url : `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
        // url: `https://www.googleapis.com/urlshortener/v1/url?key=${functions.config().applinks.key}`,
        dynamicLinkInfo: {
            "domainUriPrefix" : "https://cvue.page.link",
            "link" : "https://cvue-bf9ec.firebaseapp.com/",
        },
        json : true
    })
    .then(response => {
        let shortLink = response.json.getShortLink()
        console.log('shortLink', shortLink)
        return ({ shortLink: shortLink})
    })
    .catch(error => {
        console.error('error', error)
        // throw new functions.https.HttpsError('failed to get shortLink')
        return(new functions.https.HttpsError('failed to get shortLink'))
    })
})
