  <template>
    <div class="container">
        <div>
            <h1 h1 style="margin-top: 0.7em; margin-bottom: 0.7em">Praksisattester
                <b-button class="btn-floating btn-info float-right" @click="add()">Lag ny praksisattest</b-button>
            </h1>
        </div>

        <b-card-group v-for="elem in certificates" :key="elem.id">
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" role="tab">
                    <b-link class="link-prop" href="#" router-link :to="{ name: 'ShowPracticeCertificate', params: { cid: elem.id  } }">{{ elem.employer }}
                        <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'PracticeCertificate', params: { cid: elem.id } }">Endre</b-button>
                        <b-button class="button-span btn-floating btn-outline-secondary float-right" @click="remove(elem)">Slett</b-button>
                    </b-link>
                    <p class="b-card-text" style="font-style: normal"> Sist endret {{elem.timestamp | formatDateAndTime}}</p>
                </b-card-header>
            </b-card>
        </b-card-group>

        <div class="g-bottom"></div>
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
        add() {
            this.$router.push({ name: 'PracticeCertificate', params: { cid: null }})
        },
        remove(cert) {
            console.log("onRemove", cert.id);
            db.collection('certs').doc(cert.id).delete()
            .then(() => {
                console.log("Document successfully deleted!");
                this.certificates = []
                this.fetchCertificates()
                // let idx = this.certificates.findIndex(cert)
                // if (idx >= 0) {
                //     this.certificates.slice(idx, 1)
                // }
            }).catch(error => {
                console.error("Error removing document: ", error);
                alert(error)
            })
        },
        fetchCertificates() {
            // fetch this practice certificates
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
        this.user = firebase.auth().currentUser.uid
        this.fetchCertificates()
    }
}
</script>

<style>

</style>
