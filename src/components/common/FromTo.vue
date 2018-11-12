<template>
<div class="component">
    <b-form-group>
        <div class="g-m2 form-row">
            <b-form-group class="col-md-3">
                <label for="fromMonth"><strong>Fra</strong></label>
                <b-form-select id="fromMonth" class="mb-3" @change="changed" :options="months" v-model="from.month" required />
            </b-form-group>
            <b-form-group class="col-md-3">
                <label for="fromYear" style="color: white">(år) </label>
                <b-form-select id="fromYear" class="mb-3" @change="changed" :options="years" v-model="from.year" required />
            </b-form-group>
            <b-form-group class="col-md-3">
                <label for="toMonth"><strong>Til</strong></label>
                <b-form-select class="mb-3" @change="changed" :options="months" v-model="to.month" />
            </b-form-group>
            <b-form-group class="col-md-3">
                <label for="toYear" style="color: white">(år) </label>
                <b-form-select id="toYear" class="mb-3" @change="changed" :options="years" v-model="to.year" required />
            </b-form-group>
            <b-form-group v-if="show != 'training'" class="g-group3">
                <b-form-checkbox @change="changed" v-model="ongoing">Jeg jobber her nå</b-form-checkbox>
            </b-form-group>
        </div>
    </b-form-group>
</div>

</template>

<script>
export default {
    name: 'FromTo',
    props: ['from', 'to', 'ongoing'],
    data() {
        return {
            months: [
                { value: null, text: 'Velg en måned' },
                { value: '01', text: 'januar' },
                { value: '02', text: 'februar' },
                { value: '03', text: 'mars' },
                { value: '04', text: 'april' },
                { value: '05', text: 'mai' },
                { value: '06', text: 'juni' },
                { value: '07', text: 'juli' },
                { value: '08', text: 'august' },
                { value: '09', text: 'september' },
                { value: '10', text: 'oktober' },
                { value: '11', text: 'november' },
                { value: '12', text: 'desember' }
            ],
            years: [],
            // form: {
            //     from: {
            //         month: null,
            //         year: null
            //     },
            //     to: {
            //         month: null,
            //         year: null
            //     },
            //     ongoing: false
            // },
            reason: 'onFromTo',
            show: true

        }
    },
    methods: {
        changed() {
            console.log('changed', this.from, this.to)
            this.$emit(this.reason, this.from, this.to, this.ongoing)
        }
    },
    created() {
        this.years = []
        let today = new Date()
        this.years.push('Velg et år')
        for (let y = 1940; y <= today.getFullYear(); y++) {
            this.years.push('' + y)
        }
    }   
}

</script>


<style>

</style>
