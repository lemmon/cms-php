const html = require('nanohtml')
const router = require('../../lib/router')

const Form = require('../components/form')

module.exports = ({ current }, state, render) => html`
  <section class="span1">
    <div class="p05">
      <header class="p05 row items-center">
        <h1 class="p1 h3" style="line-height: 2rem;">${current.name}</h1>
        <div class="p1 div color-black-20 self-stretch"></div>
        <div class="p1 lh5"><a class="color-black-50 a-ul a-color-inherit" href="/${current.id}">back</a></div>
      </header>
      ${render.component(Form, {
        current,
        onsubmit: e => handleSubmit(e, { current }, state, render),
      }, `${current.id}__update`)}
    </div>
  </section>
`

function handleSubmit(e, { current }, state, render) {
  e.preventDefault()
  const form = e.target
  console.log(current)
  for (const field of form) {
    console.log(field.name, field.value)
  }
}
