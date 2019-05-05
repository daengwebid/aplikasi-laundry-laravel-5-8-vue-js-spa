<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Edit Outlet</h3>
            </div>
            <div class="panel-body">
                <outlet-form></outlet-form>
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Update
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex'
    import FormOutlets from './Form.vue'
    export default {
        name: 'EditOutlet',
        created() {
            this.editOutlet(this.$route.params.id)
        },
        methods: {
            ...mapActions('outlet', ['editOutlet', 'updateOutlet']),
            submit() {
                this.updateOutlet(this.$route.params.id).then(() => {
                    this.$router.push({ name: 'outlets.data' })
                })
            }
        },
        components: {
            'outlet-form': FormOutlets
        },
    }
</script>
