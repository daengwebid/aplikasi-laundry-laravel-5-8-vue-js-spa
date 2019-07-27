<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Detail Expenses</h3>
            </div>
            <div class="panel-body">
                <template>
                    <dt>Permintaan Karyawan</dt>
                    <dd>- {{ description }}</dd>

                    <hr>
                    <dt>Biaya Yang Diperlukan</dt>
                    <dd>- Rp {{ price }}</dd>
                    <hr>

                    <dt>Catatan</dt>
                    <dd>- {{ note }}</dd>
                    <hr>

                    <dt>User/Kurir</dt>
                    <dd>- {{ user.name }}</dd>
                    <hr>

                    <dt>Status</dt>
                    <dd>
                        <span class="label label-success" v-if="status == 1">Diterima</span>
                        <span class="label label-warning" v-else-if="status == 0">Diproses</span>
                        <span class="label label-default" v-else>Ditolak</span>
                    </dd>
                    <hr>

                    <div v-if="status == 2">
                        <dt>Alasan Penolakan</dt>
                        <dd>- {{ reason }}</dd>
                        <hr>
                    </div>
                    <div class="pull-right" v-if="status == 0 || (status == 0 && !formReason)">
                        <button class="btn btn-danger btn-sm" @click="formReason = true">Tolak</button>
                        <button class="btn btn-primary btn-sm" @click="accept">Terima</button>
                    </div>
                </template>

                <div v-if="formReason">
                    <div class="form-group">
                        <label for="">Alasan Penolakan</label>
                        <input type="text" v-model="inputReason" class="form-control">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-sm pull-right" @click="cancelRequest">Respon Penolakan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
    export default {
        name: 'ViewEpenses',
        created() {
            this.editExpenses(this.$route.params.id).then((res) => {
                let row = res.data
                this.description =  row.description
                this.price =  row.price
                this.note =  row.note
                this.status =  row.status
                this.reason =  row.reason
                this.user = row.user
            })
        },
        data() {
            return {
                description: '',
                price: '',
                note: '',
                status: '',
                reason: '',
                user: '',
                formReason: false,
                inputReason: ''
            }
        },
        methods: {
            ...mapActions('expenses', ['editExpenses', 'acceptExpenses', 'cancelExpenses']),
            accept() {
                this.$swal({
                    title: 'Kamu Yakin?',
                    text: "Permintaan yang disetujui tidak dapat dikembalikan!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Iya, Lanjutkan!'
                }).then((result) => {
                    if (result.value) {
                        this.acceptExpenses(this.$route.params.id).then(() => this.$router.push({ name: 'expenses.data' }))
                    }
                })
            },
            cancelRequest() {
                this.$swal({
                    title: 'Kamu Yakin?',
                    text: "Permintaan yang ditolak tidak dapat dikembalikan!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Iya, Lanjutkan!'
                }).then((result) => {
                    if (result.value) {
                        this.cancelExpenses({id: this.$route.params.id, reason: this.inputReason}).then(() => {
                            this.formReason = false
                            this.$router.push({ name: 'expenses.data' })
                        })
                    }
                })
            }
        }
    }
</script>
