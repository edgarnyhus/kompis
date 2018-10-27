<template>
    <div class="container">
        <div>
            <h4 class="g-title">Målsetning</h4>
            <p style="font-style: italic">Hvilke nøkkelkompetanse eller praktisk ferdighet vil du bli bedre på?</p>
        </div>

        <b-form>
            <b-form-group class="g-group">
                <b-form-select id="goal" v-model.trim="form.goal" :options="skills"></b-form-select>
            </b-form-group>
            
            <b-form-group class="g-group">
                <label for="description"><strong>Beskrivelse</strong> </label>
                <b-form-textarea id="description"
                                v-model="form.description"
                                placeholder="Beskriv målsetningen mer nøyaktig"
                                :rows="3"
                                :max-rows="8">
                </b-form-textarea>
            </b-form-group>
            
            <div class="g-group">
                <b-button class="g-span" type="submit" variant="info">Lagre</b-button>
                <b-link @click="cancel()" href="#" variant="info"><strong>Avbyt</strong></b-link>
            </div>
        </b-form>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'PeresonalGoal',
    computed: {
        state () {
        return this.name.length >= 4 ? true : false
        },
        invalidFeedback () {
        if (this.form.goal.length > 4) {
            return ''
        } else if (this.form.goal.length > 0) {
            return 'Enter at least 4 characters'
        } else {
            return 'Please enter something'
        }
        },
        validFeedback () {
            return this.state === true ? 'Thank you' : ''
        }
    },
    data() {
        return {
            skills: [
                { value: null, text: 'Nøkkelkompetane eller praktisk ferdighet' },
                { value: 'Varepåfylling', text: 'Varepåfylling' },
                { value: 'Murerarbreid', text: 'Murerarbreid' }
            ],
            form: {
                goal: null,
                description: null
            }
        }
    },
    components: {

    },
    methods: {
        cancel() {
            console.log("cancel")
            this.$router.push({ name: 'MyCV' })
        }
    }
}
</script>

<style>
.g-title {
    margin-top: 2em;
    margin-bottom: 0;
}
.g-group {
    margin-top: 2em;
    margin-bottom: 1.5em;
}
.g-span {
    margin-right: 1em;
}
</style>
