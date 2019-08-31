<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Create New Transaction</h3>
            </div>
            <div class="panel-body">
                <transaction-form ref="form"></transaction-form>
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Create Transaction
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapState, mapMutations } from 'vuex'
    import FormTransaction from './Form.vue'
    export default {
        name: 'AddTransaction',
        methods: {
            submit() {
                this.$refs.form.submit()
            }
        },
        components: {
            'transaction-form': FormTransaction
        }
    }
</script>
