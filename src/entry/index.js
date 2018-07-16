document.querySelector('body').innerHTML = `<div id="app"></div>`

Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.debug = true

const app = new Vue({ 
    template: `<div ref="container"></div>`,
    el: '#app'
})

const ComponentClass = Vue.extend(require(LOCA).default)
const propsData = {}
PROPS.forEach(prop => propsData[prop.key] = prop.value)

const instance = new ComponentClass({
    propsData
})
instance.$slots.default = ['Slot Default Content!']
instance.$mount()
app.$refs.container.appendChild(instance.$el)