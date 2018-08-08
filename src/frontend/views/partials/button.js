const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = (props) => html`
  <button
    class="
      button button-over
      bg-${props.bgColor || 'blue'}
      color-white
      p1 lh4
    "
    type=${props.type || 'button'}
    name=${props.name || ''}
    value=${props.value  || ''}
    ${props.disabled || props.loading ? `disabled` : ``}
    ${props.loading ? `data-loading` : ``}
    onclick=${props.onclick}
  >${props.caption}</button>
`
