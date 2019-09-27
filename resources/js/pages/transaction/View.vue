<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6" v-if="transaction.status == 0">
                        <h4>Payment</h4>
                        <hr>
                        <div class="form-group">
                            <label for="">Tagihan</label>
                            <input type="text" :value="transaction.amount" class="form-control" readonly>
                        </div>
                        <div class="form-group" v-if="transaction.customer && transaction.customer.deposit >= transaction.amount">
                            <input type="checkbox" v-model="via_deposit"> Bayar Via Deposit?
                        </div>
                        <div class="form-group">
                            <label for="">Jumlah Bayar</label>
                            <input type="number" class="form-control" v-model="amount">
                        </div>
                        <p v-if="isCustomerChange">Kembalian: Rp {{ customerChangeAmount }}</p>
                        <div class="form-group" v-if="isCustomerChange">
                            <input type="checkbox" v-model="customer_change" id="customer_change">
                            <label for="customer_change"> Kembalian Jadi Deposit?</label>
                        </div>
                        <p class="text-danger" v-if="payment_message">{{ payment_message }}</p>
                        <button class="btn btn-primary btn-sm" :disabled="loading" @click="makePayment">Bayar</button>
                    </div>
                    <div class="col-md-6" v-if="transaction.customer">
                        <h4>Customer Info</h4>
                        <hr>
                        <table>
                            <tr>
                                <th width="30%">NIK </th>
                                <td width="5%">:</td>
                                <td>{{ transaction.customer.nik }}</td>
                            </tr>
                            <tr>
                                <th>No Telp </th>
                                <td>:</td>
                                <td>{{ transaction.customer.phone }}</td>
                            </tr>
                            <tr>
                                <th>Alamat </th>
                                <td>:</td>
                                <td>{{ transaction.customer.address }}</td>
                            </tr>
                            <tr>
                                <th>Deposit </th>
                                <td>:</td>
                                <td>Rp {{ transaction.customer.deposit }}</td>
                            </tr>
                            <tr>
                                <th>Point </th>
                                <td>:</td>
                                <td>{{ transaction.customer.point }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6" v-if="transaction.payment">
                        <h4>Riwayat Pemabayaran</h4>
                        <hr>
                        <table>
                            <tr>
                                <th width="30%">Jumlah Pembayaran </th>
                                <td width="5%">:</td>
                                <td>Rp {{ transaction.payment.amount }}</td>
                            </tr>
                            <tr>
                                <th>Kembalian </th>
                                <td>:</td>
                                <td>Rp {{ transaction.payment.customer_change }}</td>
                            </tr>
                            <tr>
                                <th>Metode Pembayaran </th>
                                <td>:</td>
                                <td>{{ transaction.payment.type_label }}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-12" style="padding-top: 20px">
                        <div class="alert alert-success" v-if="payment_success">Pembayaran Berhasil</div>
                        <h4>Detail Transaction</h4>
                        <hr>
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>Paket</th>
                                        <th width="28%">Waktu Layanan</th>
                                        <th>Berat/Satuan</th>
                                        <th>Harga</th>
                                        <th>Subtotal</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in transaction.detail" :key="index">
                                        <td>
                                            <strong>{{ row.product.name }}</strong>
                                            <sup v-html="row.status_label"></sup>
                                        </td>
                                        <td>{{ row.service_time }}</td>
                                        <td>
                                            {{ row.qty }} ({{ row.product.unit_type }})
                                        </td>
                                        <td>Rp {{ row.price }} / {{ row.product.unit_type }}</td>
                                        <td>Rp {{ row.subtotal }}</td>
                                        <td>
                                            <button class="btn btn-success btn-sm" v-if="transaction.status == 1  && row.status == 0" @click="isDone(row.id)">
                                                <i class="fa fa-paper-plane-o"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState, mapMutations } from 'vuex'
    export default {
        name: 'DetailTransaction',
        created() {
            this.detailTransaction(this.$route.params.id)
        },
        data() {
            return {
                amount: null,
                customer_change: false,
                loading: false,
                payment_message: null,
                payment_success: false,
                via_deposit: false
            }
        },
        watch: {
            via_deposit() {
                if (this.via_deposit) {
                    this.amount = this.transaction.amount
                } else {
                    this.amount = null
                }
            }
        },
        computed: {
            ...mapState('transaction', {
                transaction: state => state.transaction
            }),
            isCustomerChange() {
                if (!this.via_deposit) {
                    return this.amount > this.transaction.amount 
                }
                return false
            },
            customerChangeAmount() {
                if (!this.via_deposit) {
                    return parseInt(this.amount - this.transaction.amount)
                }
                return 0
            }
        },
        methods: {
            ...mapActions('transaction', ['detailTransaction', 'payment', 'completeItem']), 
            makePayment() {
                if (this.amount < this.transaction.amount) {
                    this.payment_message = 'Pembayaran Kurang Dari Tagihan'
                    return
                }
                this.loading = true
                this.payment({
                    transaction_id: this.$route.params.id,
                    amount: this.amount,
                    customer_change: this.customer_change,
                    via_deposit: this.via_deposit
                }).then((res) => {
                    if (res.status == 'success') {
                        this.payment_success = true
                        setTimeout(() => {
                            this.loading = false
                            this.amount = null,
                            this.customer_change = false,
                            this.payment_message = null
                            this.via_deposit = false
                        }, 500)
                        this.detailTransaction(this.$route.params.id)
                    } else {
                        this.loading = false
                        alert(res.data)
                    }
                })
            },
            isDone(id) {
                this.$swal({
                    title: 'Kamu Yakin?',
                    text: "Akan menyelesaikan pesanan ini!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Iya, Lanjutkan!'
                }).then((result) => {
                    if (result.value) {
                        this.completeItem({ id: id }).then(() => {
                            this.detailTransaction(this.$route.params.id)
                        })
                    }
                })
            }
        }
    }
</script>
