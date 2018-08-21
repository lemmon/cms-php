const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Field extends Component {

  constructor(props) {
    super()
    this.name = props.name
    this.value = props.value
    this.state = {
      initialValue: undefined,
      touched: false,
      validating: false,
      errors: null,
    }
    this.update(props)
  }

  createElement(props) {
    return html`
      <label class="field ${this.state.touched && this.state.errors && `field-error` || ``}">
        <div
          class="field-label f2 fw500 color-black-40 bg-white"
        >${this.name}</div>
        ${this.state.errors && html`
          <div
            class="field-note f2 fw500 color-black-40 bg-white"
          >${this.state.errors[0]}</div>
        ` || props.required && html`
        <div
          class="field-note f2 fw500 color-black-40 bg-white"
        >required</div>
        ` || ``}
        <div class="field-textarea">
          <textarea
            name=${this.name}
            class="field-input field-border p1 lh4 bg-white"
            oninput=${e => this.handleInput(e, props)}
            onfocus=${e => this.handleFocus(e, props)}
            onblur=${e => this.handleBlur(e, props)}
            onkeypress=${e => {
              if (e.keyCode === 13 && !props.multiline) {
                e.preventDefault()
              }
              if (props.onkeypress) {
                props.onkeypress(e)
              }
            }}
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
      this.value && this.value
        .replace(/</g, '&lt;')
        .replace(/</g, '&lt;')
        + '.'
      || '.'
  }

  update(props) {
    if (props.onupdate) {
      props = props.onupdate(props)
    }
    if (props.value !== undefined && props.value !== this.value) {
      this.value = props.value
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

  sanitize(props) {
    // trim
    this.value = this.value && this.value.trim()
    // multiline
    if (this.value && !props.multiline) {
      this.value = this.value.replace(/\s+/g, ' ')
    }
    // value
    this.state.initialValue = this.value
  }

  validate(props, sanitize = true) {
    this.state.touched = true
    this.state.validating = true
    return new Promise((resolve, reject) => {
      const errors = []
      // sanitize
      if (this.state.initialValue !== this.value) {
        this.sanitize(props)
      }
      // required
      if (props.required && !this.value) {
        errors.push(`field is required`)
      }
      // resolve
      if (errors.length === 0) {
        // no errors
        this.state.errors = null
        resolve(this)
      } else {
        // found errors
        this.state.errors = errors
        reject(errors)
      }
      this.state.validating = false
      this.render(props)
    })
  }

  handleInput(e, props) {
    if (this.state.errors) {
      this.state.errors = null
      this.element.classList.remove('field-error')
    }
    this.value = e.target.value
    this.updateValue()
  }

  handleFocus(e, props) {
    this.state.initialValue = this.value
    if (props.onfocus) {
      props.onfocus(this)
    }
  }

  handleBlur(e, props) {
    this.state.touched = true
    if (props.onchange && this.state.initialValue !== this.value) {
      this.sanitize(props)
      props.onchange(this)
    }
    if (props.onblur) {
      props.onblur(this)
    }
    this.validate(props, false).catch( err => {} )
  }
}
