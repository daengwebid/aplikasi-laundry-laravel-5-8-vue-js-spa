<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Edit Courier</h3>
            </div>
            <div class="panel-body">
                <courier-form ref="courierForm"></courier-form>
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
    import FormCourier from './Form.vue'
    export default {
        name: 'EditCourier',
        methods: {
            submit() {
                this.$refs.courierForm.submit()
            }
        },
        components: {
            'courier-form': FormCourier
        },
    }
</script>
