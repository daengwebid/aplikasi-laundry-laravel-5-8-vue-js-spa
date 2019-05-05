<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{ name: 'outlets.add' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="Cari..." v-model="search">
                </div>
            </div>
            <div class="panel-body">
                <b-table striped hover bordered :items="outlets.data" :fields="fields" show-empty>
                    <template slot="status" slot-scope="row">
                        <span class="label label-success" v-if="row.item.status == 1">Active</span>
                        <span class="label label-default" v-else>Inactive</span>
                    </template>
                    <template slot="actions" slot-scope="row">
                        <router-link :to="{ name: 'outlets.edit', params: {id: row.item.code} }" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i></router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteOutlet(row.item.id)"><i class="fa fa-trash"></i></button>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="outlets.data"><i class="fa fa-bars"></i> {{ outlets.data.length }} item dari {{ outlets.meta.total }} total data</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination
                                v-model="page"
                                :total-rows="outlets.meta.total"
                                :per-page="outlets.meta.per_page"
                                aria-controls="outlets"
                                v-if="outlets.data && outlets.data.length > 0"
                                ></b-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: 'DataOutlet',
    created() {
        this.getOutlets()
    },
    data() {
        return {
            fields: [
                { key: 'code', label: 'Kode Outlet' },
                { key: 'name', label: 'Nama Outlet' },
                { key: 'address', label: 'Alamat' },
                { key: 'phone', label: 'Telp' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Aksi' }
            ],
            search: ''
        }
    },
    computed: {
        ...mapState('outlet', {
            outlets: state => state.outlets
        }),
        page: {
            get() {
                return this.$store.state.outlet.page
            },
            set(val) {
                this.$store.commit('outlet/SET_PAGE', val)
            }
        }
    },
    watch: {
        page() {
            this.getOutlets()
        },
        search() {
            this.getOutlets(this.search)
        }
    },
    methods: {
        ...mapActions('outlet', ['getOutlets', 'removeOutlet']),
        deleteOutlet(id) {
            this.$swal({
                title: 'Kamu Yakin?',
                text: "Tindakan ini akan menghapus secara permanent!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Iya, Lanjutkan!'
            }).then((result) => {
                if (result.value) {
                    this.removeOutlet(id)
                }
            })
        }
    }
}
</script>
