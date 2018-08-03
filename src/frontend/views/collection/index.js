const html = require('nanohtml')
const router = require('../../lib/router')

module.exports = ({ current, section }, state) => {
  return html`
    <section class="span1">
      <header class="row items-center">
        <h1 class="px1 h4">${current.name}</h1>
        <div class="p1 div color-black-20 self-stretch"></div>
        <div class="p1 lh5"><a class="a-ul" href="/${current.id}/create">Create new\u2026</a></div>
      </header>
    </section>
  `
}
