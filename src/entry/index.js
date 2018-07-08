const entry = (componentName, fileImport) =>
    `
        document.querySelector('body').innerHTML = '<div id="app"><${componentName} /></div>'

        import Test from '${fileImport}'
        import Vue from 'vue/dist/vue.js'
    `

module.exports = entry
