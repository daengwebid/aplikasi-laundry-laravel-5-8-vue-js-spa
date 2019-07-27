<template>
    <div>
        <div class="form-group" :class="{ 'has-error': errors.description }">
            <label for="">Permintaan</label>
            <input type="text" class="form-control" v-model="expenses.description">
            <p class="text-danger" v-if="errors.description">{{ errors.description[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.price }">
            <label for="">Biaya</label>
            <input type="number" class="form-control" v-model="expenses.price">
            <p class="text-danger" v-if="errors.price">{{ errors.price[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.note }">
            <label for="">Catatan</label>
            <textarea cols="5" rows="5" class="form-control" v-model="expenses.note"></textarea>
            <p class="text-danger" v-if="errors.note">{{ errors.note[0] }}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'FormExpenses',
    created() {
        if (this.$route.name == 'expenses.edit') {
            this.editExpenses(this.$route.params.id).then((res) => {
                this.expenses = {
                    description: res.data.description,
                    price: res.data.price,
                    note: res.data.note
                }
            })
        }
    },
    data() {
        return {
            expenses: {
                description: '',
                price: '',
                note: ''
            }
        }
    },
    computed: {
        ...mapState(['errors'])
    },
    methods: {
        ...mapActions('expenses', ['submitExpense', 'editExpenses', 'updateExpenses']),
        submit() {
            if (this.$route.name == 'expenses.edit') {
                let data = Object.assign({id: this.$route.params.id}, this.expenses)
                this.updateExpenses(data).then(() => this.$router.push({name: 'expenses.data'}))
            } else {
                this.submitExpense(this.expenses).then(() => this.$router.push({ name: 'expenses.data' }))
            }
        }
    },
    destroyed() {
        this.expenses = {
            description: '',
            price: '',
            note: ''
        }
    }
}
</script>
