<template>
    <div>
        <h1>Testing Component with Props</h1>
        <p>{{ name }}</p>
        <p v-if="showage">{{ age }}</p>
    </div>
</template>

<script>
    export default {
        name: 'props-component',
        props: {
            name: {
                type: String
            },
            age: {
                type: Number
            },
            showage: {
                type: Boolean
            }
        }
    }
</script>

