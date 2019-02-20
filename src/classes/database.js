import firebase from 'firebase'
import db from '@/firebase/init'


class Database {
    constructor() {
        console.log('database constructor');
    }

    fetchData(coll, cid, uid) {
        let data = []
        let ref = null
        if (cid) 
            ref = db.collection(coll).where('cert_id', '==', cid)
        else
            ref = db.collection(coll).where('user_id', '==', uid)
        ref.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let item = doc.data()
                item.id = doc.id
                item.media = this.fetchMedia('media', doc.id)
                item.links = this.fetchMedia('links', doc.id)
                data.push(item)
            })
        })
        .catch(error=> {
            throw new Error("Hening av '" + coll + "' feilet. " + error)
        })
        return data
    }

    fetchMedia(coll, id) {
        let media = []
        db.collection(coll).where('parent_id', '==', id)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let item = doc.data()
                item.id = doc.id
                media.push(item)
            })
        })
        .catch(error=> {
            throw new Error('Henting av media/lenker feilet. ' + error)
        })
        return media
    }

    uploadMedia(coll, formData) {
        // upload data to the server
        return new Promise((resolve, reject) => {
            const file = formData.get(coll)
            firebase.storage().ref(coll).child(file.name)
            .put(file)
            .then (() => {
                firebase.storage().ref(coll).child(file.name).getDownloadURL()
                .then (url => {
                    // File uploaded ok
                    resolve(url)
                })
                .catch((error) => {
                    reject('Opplasting av fieln feilet. ' + error)
                })
            })
            .catch((error) => {
                reject('Opplasting av fieln feilet. ' + error)
            })
        })
    }
}

export { Database }
