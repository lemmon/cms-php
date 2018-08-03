const html = require('nanohtml')
const router = require('../../lib/router')

module.exports = ({ current, section }, state) => {
  return html`
    <section class="span1">
      <div class="p05">
        <header class="p05 row items-center">
          <h1 class="p1 h3" style="line-height: 2rem;">${current.name}</h1>
          <div class="p1 div color-black-20 self-stretch"></div>
          <div class="p1 lh5"><a class="color-black-50 a-ul a-color-inherit" href="/${current.id}/create">Create new\u2026</a></div>
        </header>
        <div class="p05">

        </div>
      </div>
    </section>
  `
}
