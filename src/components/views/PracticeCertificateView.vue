  <template>
    <div class="container">
        <div>
            <h2 style="margin-top: 0.7em; margin-bottom: 0.7em">Praksisattester
                <b-button v-if="!isMobile" class="btn-floating btn-info float-right" @click="add()">Lag ny praksisattest</b-button>
                <md-button v-else class="g-info md-fab md-mini float-right" variant="info" @click="add()"><md-icon>add</md-icon></md-button>
            </h2>
        </div>

        <b-card-group v-for="elem in certificates" :key="elem.id">
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" role="tab">
                    <b-link class="link-prop" href="#" router-link :to="{ name: 'ShowPracticeCertificate', params: { uid: user_id, cid: elem.id  } }">{{ elem.employer }}</b-link>
                    <div v-if="!isMobile">
                        <b-button class="btn-floating btn-secondary float-right" router-link :to="{ name: 'PracticeCertificate', params: { uid: user_id, cid: elem.id } }">Endre</b-button>
                        <b-button class="button-span btn-floating btn-outline-secondary float-right" @click="remove(elem)">Slett</b-button>
                    </div>
                    <div v-else>
                        <span><i class="material-icons md-light float-right g-icon" style="color: #767676"  router-link :to="{ name: 'PracticeCertificate', params: { uid: user_id, cid: elem.id } }">edit</i></span>
                        <span><i class="material-icons md-light float-right g-icon" style="color: #767676" @click="remove(elem)">delete</i></span>
                    </div>
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
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    data () {
        return {
            certificates: [],
            profile: null,
            user_id: null            
        }
    },
    computed: {
        isMobile() {
            return this.$smallScreen
        }
    },
    methods: {
        add() {
            this.$router.push({ name: 'PracticeCertificate', params: { uid: this.user_id, cid: null }})
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
            if (this.user_id) {
                db.collection('certs').where('user_id', '==', this.user_id)
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
        this.user_id = this.$route.params.uid
        if (!this.user_id) {
            this.user_id = firebase.auth().currentUser.uid
        }

        this.fetchCertificates()
    }
}
</script>

<style>

</style>
