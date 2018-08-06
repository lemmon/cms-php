const html = require('nanohtml')
const Component = require('nanocomponent')

const loader = require('../partials/loader')

const nothing = () => html`
  <div>n/a</div>
`

const table = ({ current, data }) => {
  const mainField = current.fields[0]
  return data.length && html`
    <div class="bt b-black-10 lh4">${data.map(item => html`
      <div class="p1 bb b-black-10"><a
        class="a-ul"
        href="/${current.id}/${item.id}"
      >${
        item[mainField.name] || html`<span class="color-black-50">n/a</span>`
      }</a></div>
    `)}</div>
  ` || nothing()
}

module.exports = class Table extends Component {

  constructor(props) {
    super()
    const { current } = props
    const url = `${window.root}/${current.id}.json`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    }).then(res => (
      res.json()
    )).then(res => {
      this.data = res
      this.render(props)
    })
  }

  createElement({ current }) {
    return this.data ? table({
      current,
      data: this.data,
    }) : loader()
  }

  update() {
    return true
  }
}
