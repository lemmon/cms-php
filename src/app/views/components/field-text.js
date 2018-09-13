const html = require('nanohtml')
const Field = require('./field')

module.exports = class TextField extends Field {

  createElement() {
    return super.createElement(html`
      <div class="field-textarea">
        <textarea
          name=${this.name}
          class="field-input p1 lh4"
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
        >${this.state.inputValue || this.value || ''}</textarea>
        <div class="p1 lh4 row" style="color: transparent;">
          ${this.props.multiline && html`<div style="width: 0;">1<br>2<br>3<br></div>` || ``}
          <div class="span1 field-preview"></div>
        </div>
      </div>
    `)
  }

  updateValue() {
    this._elementPreview.innerHTML =
      (this.state.inputValue || this.value || '')
        .replace(/</g, '&lt;')
        .replace(/</g, '&lt;')
        + '.'
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
    super.sanitize(input => {
      // trim
      input = input.trim()
      // multiline
      if (this.props.multiline) {
        input = input
          .replace(/ +$/mg, '')
          .replace(/\n{3,}/g, '\n\n')
      } else {
        input = input.replace(/\s+/g, ' ')
      }
      //
      return input || null
    })
  }

  handleInput(e) {
    super.handleInput(e)
    this.updateValue()
  }
}
