<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{ name: 'couriers.add' }" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="Cari..." v-model="search">
                </div>
            </div>
            <div class="panel-body">
                <b-table striped hover bordered :items="couriers.data" :fields="fields" show-empty>
                    <template slot="photo" slot-scope="row">
                        <img :src="'/storage/couriers/' + row.item.photo" :width="80" :height="50" :alt="row.item.name">
                    </template>
                    <template slot="outlet_id" slot-scope="row">
                        {{ row.item.outlet.name }}
                    </template>
                    <template slot="actions" slot-scope="row">
                        <router-link :to="{ name: 'couriers.edit', params: {id: row.item.id} }" class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i></router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteCourier(row.item.id)"><i class="fa fa-trash"></i></button>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="couriers.data"><i class="fa fa-bars"></i> {{ couriers.data.length }} item dari {{ couriers.meta.total }} total data</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination
                                v-model="page"
                                :total-rows="couriers.meta.total"
                                :per-page="couriers.meta.per_page"
                                aria-controls="couriers"
                                v-if="couriers.data && couriers.data.length > 0"
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
    name: 'DataCourier',
    created() {
        this.getCouriers()
    },
    data() {
        return {
            fields: [
                { key: 'photo', label: '#' },
                { key: 'name', label: 'Nama Lengkap' },
                { key: 'email', label: 'Email' },
                { key: 'outlet_id', label: 'Outlet' },
                { key: 'actions', label: 'Aksi' }
            ],
            search: ''
        }
    },
    computed: {
        ...mapState('courier', {
            couriers: state => state.couriers
        }),
        page: {
            get() {
                return this.$store.state.courier.page
            },
            set(val) {
                this.$store.commit('courier/SET_PAGE', val)
            }
        }
    },
    watch: {
        page() {
            this.getCouriers()
        },
        search() {
            this.getCouriers(this.search)
        }
    },
    methods: {
        ...mapActions('courier', ['getCouriers', 'removeCourier']),
        deleteCourier(id) {
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
                    this.removeCourier(id)
                }
            })
        }
    }
}
</script>
