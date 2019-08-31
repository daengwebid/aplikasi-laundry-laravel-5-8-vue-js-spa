<template>
    <div class="container">
        <section class="content-header">
            <h1>
                Manage Transaction
            </h1>
            <breadcrumb></breadcrumb>
        </section>

        <section class="content">
            <div class="row">
                <router-view></router-view>
            </div>
        </section>
    </div>
</template>
<script>
    import Breadcrumb from '../../components/Breadcrumb.vue'
    export default {
        name: 'IndexTransaction',
        components: {
            'breadcrumb': Breadcrumb
        }
    }
</script>
