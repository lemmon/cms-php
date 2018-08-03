const html = require('nanohtml')
const router = require('../../lib/router')

module.exports = ({ current }, state) => {
  return html`
    <section class="span1">
      <header class="row justify-between items-center">
        <h1 class="px1 h4">${current.name}</h1>
        <div class="p1 lh5"><a class="a-ul" href="/${current.id}">back</a></div>
      </header>
    </section>
  `
}
