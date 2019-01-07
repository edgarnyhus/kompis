const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
// const request = require('request-promise-native')
const nodemailer = require('nodemailer');


// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'KOMPIS';
const gmailEmail = functions.config().gmail.email; //"cv.kompis@gmail.com";
const gmailPassword = functions.config().gmail.password; //"uUamHD8SC9"
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// try {
//     admin.initializeApp(functions.config().firebase)
// } catch(e) {
//     console.log('initializeApp failure')
// }
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
    var slug = data.slug;
    var invitee = data.email;

    //Sends a email to the given user (invitee).
    var mailOptions = {
        from : `${APP_NAME} <noreply@firebase.com>`,
        to : invitee,
    };
    
    // The user subscribed to the newsletter.
    mailOptions.subject = `Du er invitert til ${APP_NAME}!`;
    mailOptions.html = `<p>Hei ${invitee || ''}!</p><p><strong>${slug}</strong> ønsker å dele sine data med deg på ${'https://cvue-bf9ec.firebaseapp.com/'}.</p><p>Med vennlig hilsen<br>${APP_NAME}</p>`;
    return mailTransport.sendMail(mailOptions)
    .then(() => {
        return { status: 'success' };
    })
    .catch((error) => {
        return { status: 'error', message: 'There was an error while sending the email:', error: error };
    });
})

exports.getShortLink = functions.https.onCall((data, context) => {
    let apiKey = functions.config().applinks.key // "AIzaSyCbN1LSb075G2sLa48Fn8d3dexjiYSdHEA";
    // let url = "https://www.googleapis.com/urlshortener/v1/url"
    console.log('share', apiKey)

    axios.post({
        method : 'post',
        url : `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
        dynamicLinkInfo : {
            domainUriPrefix : 'https://cvue.page.link',
            link : 'https://cvue-bf9ec.firebaseapp.com/',
        },
        suffix : {
            option : "SHORT"
        },
        json : true
    })
    .then(response => {
        let shortLink = response.json.getShortLink()
        console.log('shortLink', shortLink)
        return { status: 'success', result: response, shortLink: shortLink}
    })
    .catch(error => {
        console.error('error', error)
        // throw new functions.https.HttpsError('failed to get shortLink')
        return { status: 'failed', key: appKey, error: error }

    })
})
