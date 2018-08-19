const html = require('nanohtml')
const router = require('../lib/router')
const state = require('../state')
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
const MATCH_ACTION = RegExp('^/([^/]+)/([a-z]{1,9})$')
const MATCH_ENTRY = RegExp('^/([^/]+)/([a-f0-9]{10})$')

const renderDashboard = ({ schema }) => [
  sidebar({
    schema,
  }),
  views.dashboard(),
]

const renderSection = ({ schema, collection, section }) => [
  sidebar({
    schema,
    collection,
    section,
  }),
  router([
    [MATCH_SECTION, () => views.collection.index({ collection })],
    [MATCH_ACTION, ([_, _section, action]) => views.collection.update({ collection, action })],
    [MATCH_ENTRY, ([_, _section, id]) => views.collection.update({ collection, id, action: 'update' })],
  ])
]

module.exports = () => html`
  <body class="row">
    ${router([
      [MATCH_HOME, () => renderDashboard({
        schema: state.schema,
      })],
      [MATCH_ANY, ([_, section]) => findcollection(section) && renderSection({
        schema: state.schema,
        collection: state.collection,
        section,
      }) || views.notfound()],
    ])}
  </body>
`

function findcollection(section) {
  const {
    schema,
    collection,
  } = state
  if (collection && collection.name === section) {
    return collection
  }
  for (const collection of schema.collections) {
    if (collection.name === section) {
      return state.collection = collection
    }
  }
}
