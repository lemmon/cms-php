const html = require('nanohtml')
const router = require('../../lib/router')
const render = require('../../render')

const Form = require('../components/form')

module.exports = ({ collection, action, id }) => html`
  <section class="span1">
    <div class="p05">
      <header class="p05 row items-center">
        <h1 class="p1 h3" style="line-height: 2rem;">${collection.name}</h1>
        <div class="p1 div color-black-20 self-stretch"></div>
        <div class="p1 lh5"><a class="color-black-50 a-ul a-color-inherit" href="/${collection.id}">back</a></div>
      </header>
      ${render.component(Form, {
        collection,
        action,
        id,
      }, `${collection.id}__${action}`)}
    </div>
  </section>
`
