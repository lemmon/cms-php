const html = require('nanohtml')
const router = require('../../lib/router')
const render = require('../../render')

const Form = require('../components/form')

module.exports = ({ current }) => html`
  <section class="span1">
    <div class="p05">
      <header class="p05 row items-center">
        <h1 class="p1 h3" style="line-height: 2rem;">${current.name}</h1>
        <div class="p1 div color-black-20 self-stretch"></div>
        <div class="p1 lh5"><a class="color-black-50 a-ul a-color-inherit" href="/${current.id}">back</a></div>
      </header>
      ${render.component(Form, {
        current,
        onsubmit: e => handleSubmit(e, { current }),
      }, `${current.id}__update`)}
    </div>
  </section>
`

function handleSubmit(e, { current }) {
  e.preventDefault()
  const form = e.target
  const data = {}
  for (const field of form) {
    if (field.name && field.value) {
      data[field.name] = field.value
    }
  }
  console.log(data)
}
