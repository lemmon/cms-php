const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Input extends Component {

  constructor(props) {
    super()
    this.value = props.value || ''
  }

  createElement(props) {
    return html`
      <label class="field">
        <div
          class="field-label f2 fw500 color-black-40 bg-white"
        >${props.name}</div>
        <div class="field-textarea">
          <textarea
            name=${props.name}
            class="field-input field-border p1 lh4 bg-white"
            oninput=${e => this.handleInput(e, props)}
            onchange=${e => this.handleChange(e, props)}
            onfocus=${e => this.handleFocus(e, props)}
            onblur=${e => this.handleBlur(e, props)}
            >${this.value || ``}</textarea>
          <div class="p1 lh4 row">
            ${props.multiline && html`<div style="width: 0;">1<br>2<br>3<br></div>` || ``}
            <div class="span1 field-preview"></div>
          </div>
        </div>
      </label>
    `
  }

  updateValue() {
    this.elementPreview.innerHTML =
      this.value
        .replace(/</g, '&lt;')
        .replace(/</g, '&lt;')
        + '.'
  }

  update(props) {
    if (props.value !== undefined) {
      this.value = props.value || ''
    }
    return true
  }

  load(el) {
    this.elementPreview = el.querySelector('.field-preview')
    this.updateValue()
  }

  afterupdate(el) {
    this.elementPreview = el.querySelector('.field-preview')
    this.updateValue()
  }

  handleInput(e, props) {
    this.value = e.target.value
    this.updateValue()
  }

  handleChange(e, props) {
  }

  handleFocus(e, props) {
  }

  handleBlur(e, props) {
    this.value = e.target.value.trim()
    if (props.onchange) {
      props.onchange(this.value)
    }
    this.render(Object.assign(props, {
      value: props.value !== undefined ? this.value : undefined
    }))
  }
}
