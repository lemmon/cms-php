const html = require('nanohtml')
const router = require('../../lib/router')

module.exports = ({ current, section }, { schema }) => html`
  <aside class="span1 max16 p05">
    <div class="p05">
      <nav class="lh5">
        <ul>
          <li><a
            class="a-anchor ${!current && !section && 'ul' || ''}"
            href="/"
          ><span class="a-ul">Dashboard</span></a></li>
        </ul>
      </nav>
    </div>
    <div class="p05">
      <h2 class="lh5 fw500 color-black-40">Collections</h2>
      <nav class="lh5">
        <ul>
          ${schema.collections.map(item => html`
            <li><a
              class="a-anchor ${item === current && 'ul' || ''}"
              href="/${item.id}"
            ><span class="a-ul">${item.name}</span></a></li>
          `)}
        </ul>
      </nav>
    </div>
  </aside>
`
