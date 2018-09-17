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
          onkeydown=${e => {
            switch (e.keyCode) {
              case 38: e.preventDefault(); this.increase(1, 1); break
              case 40: e.preventDefault(); this.increase(-1, 0); break
            }
          }}
        /></div>
        <div class="div color-black-10 py05"></div>
        <div class="p025 ac" style="width: 2rem;">
          <button
            type="button"
            class="button button-transparent lh4 color-black-20"
            onclick=${e => {
              this.increase(1, 1)
            }}
            onmousedown=${e => {
              e.preventDefault()
              this.sanitize()
              this.element.querySelector('input').focus()
            }}
            onfocus=${e => this.handleFocus(e)}
            onblur=${e => this.handleBlur(e)}
            tabindex="-1"
          ><span class="button-caption color-black-50">\u2191</span></button>
          <button
            type="button"
            class="button button-transparent lh4 color-black-20"
            onclick=${e => {
              this.increase(-1, 0)
            }}
            onmousedown=${e => {
              e.preventDefault()
              this.sanitize()
              this.element.querySelector('input').focus()
            }}
            onfocus=${e => this.handleFocus(e)}
            onblur=${e => this.handleBlur(e)}
            tabindex="-1"
          ><span class="button-caption color-black-50">\u2193</span></button>
        </div>
      </div>
    `, {
      max: 16,
    })
  }

  increase(inc = 1, def = 1) {
    this.value = Number.isInteger(this.value) ? this.value + inc : def
    this.state.inputValue = null
    this.state.touched = true
    this.element.querySelector('input').value = this.value
    // errors
    if (this.state.errors) {
      this.state.errors = null
      this.element.classList.remove('field-invalid')
    }
    // onchange event
    if (this.props.onchange) {
      this.props.onchange(this)
    }
  }

  sanitize() {
    return super.sanitize(input => {
      const res = input.match(/^\s*\-?[\s\d]+$/) && parseInt(input.replace(/\s+/g, ''))
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
