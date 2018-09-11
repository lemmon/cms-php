const html = require('nanohtml')
const Field = require('./field')

module.exports = class TextField extends Field {

  createElement() {
    return html`
      <label class="field ${this.state.touched && this.state.errors && `field-error` || ``}">
        <div
          class="field-label f4 fw500 color-black-40 bg-white"
        >${this.props.label}</div>
        ${this.state.errors && html`
          <div
            class="field-note f4 fw500 color-black-40 bg-white"
          >${this.state.errors[0]}</div>
        ` || this.props.required && html`
        <div
          class="field-note f4 fw500 color-black-40 bg-white"
        >required</div>
        ` || ``}
        <div class="field-textarea">
          <textarea
            name=${this.name}
            class="field-input field-border p1 lh4 bg-white"
            disabled=${!!this.props.disabled}
            oninput=${e => this.handleInput(e)}
            onfocus=${e => this.handleFocus(e)}
            onblur=${e => this.handleBlur(e)}
            onkeypress=${e => {
              if (e.keyCode === 13 && !this.props.multiline) {
                e.preventDefault()
              }
              if (this.props.onkeypress) {
                this.props.onkeypress(e)
              }
            }}
          >${this.value || ``}</textarea>
          <div class="p1 lh4 row">
            ${this.props.multiline && html`<div style="width: 0;">1<br>2<br>3<br></div>` || ``}
            <div class="span1 field-preview"></div>
          </div>
        </div>
      </label>
    `
  }

  updateValue() {
    this._elementPreview.innerHTML =
      this.value && this.value
        .replace(/</g, '&lt;')
        .replace(/</g, '&lt;')
        + '.'
      || '.'
  }

  load(el) {
    this._elementPreview = el.querySelector('.field-preview')
    this.updateValue()
  }

  afterupdate(el) {
    this._elementPreview = el.querySelector('.field-preview')
    this.updateValue()
  }

  sanitize() {
    super.sanitize(() => {
      // trim
      this.value = this.value && this.value.trim()
      // multiline
      if (this.value && !this.props.multiline) {
        this.value = this.value.replace(/\s+/g, ' ')
      }
      // update preview
      this.updateValue()
    })
  }

  handleInput(e) {
    super.handleInput(e)
    this.updateValue()
  }
}
