<template>
    <div class="container">
        <b-container class="g-frame">
            <h4 class="g-title">Signup</h4>
        <b-form  @submit="onSubmit" v-if="show">
            <!-- <b-form-group class="g-group">
                <label for="email" description="Vi vil aldri dele email adressen din med andre">Din email adresse</label> -->
            <b-form-group class="g-group" id="email"
                    label="Din email adressse"
                    label-for="email"
                    description="We'll never share your email with anyone else.">
                <b-form-input id="email"
                    type="email"
                    v-model="form.email"
                    required
                    placeholder="">
                </b-form-input>
            </b-form-group>
            <b-form-group class="g-group">
                <label for="password">Ditt passord</label>
                <b-form-input id="password"
                    type="password"
                    v-model="form.password"
                    required
                    placeholder="">
                            
                </b-form-input>
            </b-form-group>
            <b-form-group class="g-group">
                <label for="confirmPassword">Bekreft ditt passord</label>
                <b-form-input id="confirmPassword"
                            type="password"
                            v-model="form.confirmPassword"
                            required
                            placeholder="">
                </b-form-input>
            </b-form-group>
        </b-form>
        </b-container>
    </div>
</template>

<script>
export default {
    name: 'Signup',
    data() {
        return {
            form: {
                email: null,
                password: null,
                confirmPassword: null
            },
            show: true
        }
    },
    methods: {
        onSubmit (evt) {
            evt.preventDefault();
            alert(JSON.stringify(this.form));
        }
    }

}
</script>

<style>
.g-title {
    margin-top: 1.5em;
    margin-left: 1.3em;
    margin-bottom: 0;
}
.g-frame {
    margin-top: 3em;

    width: 50%;
    height: 30em;
    border:5px solid;
    border-color: rgb(0,160,161);
}
.g-group {
    margin-left: 2em;
    margin-top: 1em;
    margin-right: 2em;
    margin-bottom: 0em;
}
</style>
