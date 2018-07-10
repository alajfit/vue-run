document.querySelector('body').innerHTML = `<div id="app"><${COMP} /></div>`

const Component = require(LOCA)
const Vue = require('vue/dist/vue.js')

Vue.component(Component.default.name, Component.default)

new Vue({ el: '#app' })