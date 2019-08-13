<template>
    <div>
        <div class="form-group" :class="{ 'has-error': errors.nik }">
            <label for="">NIK</label>
            <input type="text" class="form-control" v-model="customer.nik" :readonly="$route.name == 'customers.edit'">
            <p class="text-danger" v-if="errors.nik">{{ errors.nik[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.name }">
            <label for="">Nama Lengkap</label>
            <input type="text" class="form-control" v-model="customer.name">
            <p class="text-danger" v-if="errors.name">{{ errors.name[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.address }">
            <label for="">Alamat</label>
            <textarea cols="5" rows="5" class="form-control" v-model="customer.address"></textarea>
            <p class="text-danger" v-if="errors.address">{{ errors.address[0] }}</p>
        </div>
        <div class="form-group" :class="{ 'has-error': errors.phone }">
            <label for="">No Telp</label>
            <input type="text" class="form-control" v-model="customer.phone">
            <p class="text-danger" v-if="errors.phone">{{ errors.phone[0] }}</p>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'FormCustomer',
    computed: {
        ...mapState(['errors']),
        ...mapState('customer', {
            customer: state => state.customer
        })
    },
    methods: {
        ...mapMutations('customer', ['CLEAR_FORM']),
    },
    destroyed() {
        this.CLEAR_FORM()
    }
}
</script>
