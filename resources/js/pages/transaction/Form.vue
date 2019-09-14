<template>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group" :class="{ 'has-error': errors.customer_id }">
                <label for="">Customer <sup><a href="javascript:void(0)" @click="newCustomer">New Customer</a></sup></label>
                <v-select :options="customers.data"
                    v-model="transactions.customer_id"
                    @search="onSearch" 
                    label="name"
                    placeholder="Masukkan Kata Kunci" 
                    :filterable="false">
                    <template slot="no-options">
                        Masukkan Kata Kunci
                    </template>
                    <template slot="option" slot-scope="option">
                        {{ option.name }}
                    </template>
                </v-select>
                <p class="text-danger" v-if="errors.customer_id">{{ errors.customer_id[0] }}</p>
            </div>
        </div>
        <div class="col-md-6" v-if="transactions.customer_id != null && !isForm">
            <table>
                <tr>
                    <th width="30%">NIK </th>
                    <td width="5%">:</td>
                    <td>{{ transactions.customer_id.nik }}</td>
                </tr>
                <tr>
                    <th>No Telp </th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.phone }}</td>
                </tr>
                <tr>
                    <th>Alamat </th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.address }}</td>
                </tr>
                <tr>
                    <th>Deposit </th>
                    <td>:</td>
                    <td>Rp {{ transactions.customer_id.deposit }}</td>
                </tr>
                <tr>
                    <th>Point </th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.point }}</td>
                </tr>
            </table>
        </div>
        <div class="col-md-6" v-if="isForm">
            <h4>Add New Customer</h4>
            <form-customer />
            <button class="btn btn-primary btn-s" @click="addCustomer">Save</button>
        </div>
        <div class="col-md-12">
            <hr>
            <button class="btn btn-warning btn-sm" style="margin-bottom: 10px" v-if="filterProduct.length == 0" @click="addProduct">Tambah</button>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th width="40%">Paket</th>
                            <th>Berat/Satuan</th>
                            <th>Harga</th>
                            <th>Subtotal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in transactions.detail" :key="index">
                            <td>
                                <v-select :options="products.data"
                                    v-model="row.laundry_price"
                                    @search="onSearchProduct" 
                                    label="name"
                                    placeholder="Masukkan Kata Kunci" 
                                    :filterable="false">
                                    <template slot="no-options">
                                        Masukkan Kata Kunci
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        {{ option.name }}
                                    </template>
                                </v-select>
                            </td>
                            <td>
                                <div class="input-group">
                                    <input type="number" v-model="row.qty" class="form-control" @blur="calculate(index)">
                                    <span class="input-group-addon">{{ row.laundry_price != null && row.laundry_price.unit_type == 'Kilogram' ? 'gram':'pcs' }}</span>
                                </div>
                                
                            </td>
                            <td>Rp {{ row.price }}</td>
                            <td>Rp {{ row.subtotal }}</td>
                            <td>
                                <button class="btn btn-danger btn-flat" @click="removeProduct(index)">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-md-12" v-if="isSuccess">
            <div class="alert alert-success">
                Transaksi Berhasil, Total Tagihan: Rp {{ total }}
                <strong><router-link :to="{ name: 'transactions.view', params: {id: transaction_id} }">Lihat Detail</router-link></strong>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import _ from 'lodash'
import FormCustomer from '../customers/Form.vue'

export default {
    name: 'FormTransaction',
    data() {
        return {
            isForm: false,
            isSuccess: false,
            transaction_id: null,
            transactions: {
                customer_id: null,
                detail: [
                    { laundry_price: null, qty: 1, price: 0, subtotal: 0 }
                ]
            }
        }
    },
    computed: {
        ...mapState(['errors']),
        ...mapState('transaction', {
            customers: state => state.customers,
            products: state => state.products
        }),
        total() {
            return _.sumBy(this.transactions.detail, function(o) {
                return parseFloat(o.subtotal)
            })
        },
        filterProduct() {
            return _.filter(this.transactions.detail, function(item) {
                return item.laundry_price == null
            })
        }
    },
    methods: {
        ...mapActions('transaction', ['getCustomers', 'getProducts', 'createTransaction']),
        ...mapActions('customer', ['submitCustomer']),
        onSearch(search, loading) {
            this.getCustomers({
                search: search,
                loading: loading
            })
        },
        onSearchProduct(search, loading) {
            this.getProducts({
                search: search,
                loading: loading
            })
        },
        addProduct() {
            if (this.filterProduct.length == 0) {
                this.transactions.detail.push({ laundry_price: null, qty: null, price: 0, subtotal: 0 })
            }
        },
        removeProduct(index) {
            if (this.transactions.detail.length > 1) {
                this.transactions.detail.splice(index, 1)
            }
        },
        calculate(index) {
            let data = this.transactions.detail[index]
            if (data.laundry_price != null) {
                data.price = data.laundry_price.price
                if (data.laundry_price.unit_type == 'Kilogram') {
                    data.subtotal = (parseInt(data.laundry_price.price) * (parseInt(data.qty) / parseInt(1000))).toFixed(2)
                } else {
                    data.subtotal = parseInt(data.laundry_price.price) * parseInt(data.qty)
                }
            }
        },
        submit() {
            this.isSuccess = false
            let filter = _.filter(this.transactions.detail, function(item) {
                return item.laundry_price != null
            })
            
            if (filter.length > 0) {
                this.createTransaction(this.transactions).then((res) => {
                    this.transaction_id = res.data.id
                    this.isSuccess = true
                })
            }
        },
        newCustomer() {
            this.isForm = true
        },
        addCustomer() {
            this.submitCustomer().then((res) => {
                this.transactions.customer_id = res.data
                this.isForm = false
            })
        },
        resetForm() {
            this.transactions = {
                customer_id: null,
                detail: [
                    { laundry_price: null, qty: 1, price: 0, subtotal: 0 }
                ]
            }
        }
    },
    components: {
        vSelect,
        'form-customer': FormCustomer
    }
}
</script>
