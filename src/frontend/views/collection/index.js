const html = require('nanohtml')
const router = require('../../lib/router')
const render = require('../../render')

const Table = require('../components/table')

module.exports = ({ collection }) => {
  return html`
    <section class="span1">
      <div class="p05">
        <header class="p05 row items-center">
          <h1 class="p1 h3" style="line-height: 2rem;">${collection.name}</h1>
          <div class="p1 div color-black-20 self-stretch"></div>
          <div class="p1 lh5"><a class="color-black-50 a-ul a-color-inherit" href="/${collection.id}/create">Create new\u2026</a></div>
        </header>
        <div class="p05">
          <div class="p1">
            ${render.component(Table, {
              collection,
            }, collection.id)}
          </div>
        </div>
      </div>
    </section>
  `
}
