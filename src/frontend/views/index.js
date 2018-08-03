const html = require('nanohtml')
const router = require('../lib/router')
const views = {
  dashboard: require('./sections/dashboard'),
  collection: {
    index: require('./collection/index'),
    update: require('./collection/update'),
  },
  notfound: require('./sections/notfound'),
}
const sidebar = require('./partials/sidebar')

const MATCH_ANY = RegExp('^/([^/]+)?')
const MATCH_HOME = RegExp('^/$')
const MATCH_SECTION = RegExp('^/([^/]+)$')
const MATCH_ACTION = RegExp('^/([^/]+)/([^/]+)$')

function findIt(section, schema) {
  for (const item of schema.collections) {
    if (item.id === section) {
      return item
    }
  }
}

module.exports = (state, render) => router([
  [MATCH_ANY, ([_, section]) => {
    const { schema } = state
    if (!state.current || state.current.id !== section) {
      state.current = findIt(section, schema)
    }
    const { current } = state
    return html`
      <body class="row">
        ${sidebar({
          section,
          current,
        }, state)}
        ${
          current && router([
            [MATCH_SECTION, () => views.collection.index({ current }, state)],
            [MATCH_ACTION, (_, _section, action) => views.collection.update({ current }, state)],
          ]) || section && views.notfound(state)
            || views.dashboard(state)
        }
      </body>
    `
  }],
])
