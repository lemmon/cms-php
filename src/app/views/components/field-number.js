const html = require('nanohtml')
const Field = require('./field')

module.exports = class NumberField extends Field {

  createElement() {
    return super.createElement(html`
      <div class="field-number row">
        <div class="span1"><input
          type="text"
          inputmode="numeric"
          name=${this.name}
          value=${
            this.state.inputValue
            || Number.isInteger(this.value) && this.value.toString()
            || this.value
            || ''
          }
          class="field-input p1 lh4 ar"
          disabled=${!!this.props.disabled}
          oninput=${e => this.handleInput(e)}
          onfocus=${e => this.handleFocus(e)}
          onblur=${e => this.handleBlurInput(e)}
          onkeypress=${e => {
          }}
        /></div>
        <div class="div color-black-10 py05"></div>
        <div class="p025 ac" style="width: 2rem;">
          <button
            type="button"
            class="button button-clear lh4 color-black-40"
            onfocus=${e => this.handleFocus(e)}
            onblur=${e => this.handleBlur(e)}
          >\u2191</button>
          <button
            type="button"
            class="button button-clear lh4 color-black-40"
            onfocus=${e => this.handleFocus(e)}
            onblur=${e => this.handleBlur(e)}
          >\u2193</button>
        </div>
      </div>
    `, {
      max: 16,
    })
  }

  sanitize() {
    return super.sanitize(input => {
      const res = input.match(/^[\s\d]+$/) && parseInt(input.replace(/\s+/g, ''))
      return Number.isInteger(res) ? res : input.trim() || null
    })
  }

  validate() {
    return super.validate(validateNumber)
  }

  handleBlurInput(e) {
    this.handleBlur(e)
    setTimeout(() => {
      if (this.state.focus) {
        this.validate().then(() => {
          if (!this.isValid()) {
            this.element.classList.toggle('field-invalid', this.errors)
          }
        })
      }
    })
  }
}

function validateNumber(c) {
  if (c.value && !Number.isInteger(c.value)) {
    throw Error('not a number')
  }
}
