<template>
    <div>{{ name }}</div>
</template>

<script>
    export default {
        name: 'props-component',
        props: {
            name: {
                type: String
            }
        }
    }
</script>

