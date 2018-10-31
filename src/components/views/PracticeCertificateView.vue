  <template>
    <div class="container">
        <div>
            <h1 class="page-title">Praksisattester
                <b-button class="btn-floating btn-info float-right" router-link :to="{ name: 'PracticeCertificate' }">Lag ny praksisattest</b-button>
            </h1>
        </div>

        <b-card-group v-for="elem in certificates" :key="elem.id">
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" role="tab">
                    <b-link class="link-prop" href="#">{{ elem.employer }}
                        <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'PracticeCertificate', params: { cid: elem.id } }">Endre</b-button>
                        <b-button class="button-span btn-floating btn-outline-secondary float-right" @click="remove(elem)">Slett</b-button>
                    </b-link>
                    <p class="b-card-text" style="font-style: normal"> Sist endret {{elem.timestamp | formatDateAndTime}}</p>
                </b-card-header>
            </b-card>
        </b-card-group>

        <div class="end-page">

        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'PracticeCertificateView',
    components: {

    },
    data () {
        return {
            certificates: [],
            profile: null,
            user: null            
        }
    },
    methods: {
        remove(cert) {
            console.log("onRemove", cert.id);
            db.collection('certs').doc(cert.id).delete()
            .then(() => {
                console.log("Document successfully deleted!");
                this.certificates.length = 0
                this.fetchCertificates()
                // let idx = this.certificates.findIndex(cert)
                // if (idx >= 0) {
                //     this.certificates.slice(idx, 1)
                // }
            }).catch(error => {
                console.error("Error removing document: ", error);
            })
        },
        fetchCertificates() {
            if (this.user) {
                db.collection('certs').where('user_id', '==',firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let elem = doc.data()
                        elem.id = doc.id
                        this.certificates.push(elem)
                    })
                })
            }
        }
    },
    created() {
        // current user
        this.user = firebase.auth().currentUser.uid
        db.collection('users').doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
            this.profile = doc.data()
        })

        // fetch this practice certificates
        this.fetchCertificates()
    }
}
</script>

<style>
.page-title {
    margin-top: 1.5em;
    margin-bottom: 2em;
}
b-card {
    margin-bottom: 2em;
}
.link-prop {
    color: rgb(0,160,161);
    font-size: 1.5rem;
}
.end-page {
    margin-bottom: 3em;
}
.button-span {
    margin-right: 1em;
}
</style>
