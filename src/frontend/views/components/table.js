const html = require('nanohtml')
const Component = require('nanocomponent')
const api = require('../../api')

const loader = require('../partials/loader')

const nothing = () => html`
  <div>n/a</div>
`

const table = ({ collection, data }) => {
  const mainField = collection.fields[0]
  return data.length && html`
    <div class="field-bt b-black-10 lh4">${data.map(item => html`
      <div class="p1 field-bb b-black-10"><a
        class="a-ul"
        href=${linkTo(`/${collection.name}/${item.id}`)}
      >${
        item[mainField.name] || html`<span class="color-black-50">n/a</span>`
      }</a></div>
    `)}</div>
  ` || nothing()
}

module.exports = class Table extends Component {

  constructor(props) {
    super()
    const { collection } = props
    this.state = {}
    api.get(`/${collection.name}.json`).then(res => {
      this.state.data = res.data
      this.render(props)
    })
  }

  createElement({ collection }) {
    const {
      data,
    } = this.state
    return data ? table({
      collection,
      data,
    }) : loader()
  }

  update() {
    return true
  }
}
