document.querySelector('body').innerHTML = `
    <div id="app">
        <${COMP}
            ${PROPS.length
                ? PROPS.map(prop => `:${prop.key}="${prop.type === 'String'?"'": ""}${prop.value}${prop.type === 'String'?"'": ""}" `).join('')
                : ''} />
    </div>
`

const Component = require(LOCA)
const Vue = require('vue/dist/vue.js')

Vue.component(Component.default.name, Component.default)

new Vue({ el: '#app' })