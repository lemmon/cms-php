const html = require('nanohtml')

module.exports = (props) => html`
  <button
    class="
      button button-over
      ${props.style && `button-${props.style}` || ``}
      bg-${props.color || `blue`}
      color-${props.style ? props.color || `blue` : `white`}
      p1 lh4
    "
    type=${props.type || 'button'}
    name=${props.name || ''}
    value=${props.value  || ''}
    ${props.disabled || props.loading ? `disabled` : ``}
    ${props.loading ? `data-loading` : ``}
    onclick=${props.onclick}
  ><span
    class="
      button-caption
      color-${props.style ? `white` : `inherit`}
    ">${props.caption}</span></button>
`
