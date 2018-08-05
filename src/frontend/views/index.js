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
const MATCH_ACTION = RegExp('^/([^/]+)/([^/]+)$')

const renderDashboard = ({ schema }) => [
  sidebar({
    schema,
  }),
  views.dashboard(),
]

const renderSection = ({ schema, current, section }) => [
  sidebar({
    schema,
    current,
    section,
  }),
  router([
    [MATCH_SECTION, () => views.collection.index({ current })],
    [MATCH_ACTION, (_, _section, action) => views.collection.update({ current })],
  ])
]

module.exports = () => html`
  <body class="row">
    ${router([
      [MATCH_HOME, () => renderSection({
        schema: state.schema,
      })],
      [MATCH_ANY, ([_, section]) => findCurrent(section) && renderSection({
        schema: state.schema,
        current: state.current,
        section,
      }) || views.notfound()],
    ])}
  </body>
`

function findCurrent(section) {
  const {
    schema,
    current,
  } = state
  if (current && current.id === section) {
    return current
  }
  for (const item of schema.collections) {
    if (item.id === section) {
      return state.current = item
    }
  }
}
