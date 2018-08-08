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
    <div class="bt b-black-10 lh4">${data.map(item => html`
      <div class="p1 bb b-black-10"><a
        class="a-ul"
        href="/${collection.id}/${item.id}"
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
    api.get(`/${collection.id}.json`).then(res => {
      this.data = res
      this.render(props)
    })
  }

  createElement({ collection }) {
    return this.data ? table({
      collection,
      data: this.data,
    }) : loader()
  }

  update() {
    return true
  }
}
