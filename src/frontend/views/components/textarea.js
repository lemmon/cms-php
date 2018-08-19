const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Field extends Component {

  constructor(props) {
    super()
    this.name = props.name
    this.value = props.value || null
    this.touched = false
    this.validating = false
    this.valid = undefined
    this.errors = null
    this.update(props)
  }

  createElement(props) {
    return html`
      <label class="field ${this.touched && this.errors && `field-error` || ``}">
        <div
          class="field-label f2 fw500 color-black-40 bg-white"
        >${props.name}</div>
        ${this.errors && html`
          <div
            class="field-note f2 fw500 color-black-40 bg-white"
          >${this.errors[0]}</div>
        ` || props.required && html`
        <div
          class="field-note f2 fw500 color-black-40 bg-white"
        >required</div>
        ` || ``}
        <div class="field-textarea">
          <textarea
            name=${props.name}
            class="field-input field-border p1 lh4 bg-white"
            oninput=${e => this.handleInput(e, props)}
            onchange=${e => this.handleChange(e, props)}
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
      this.value = props.value || null
      this.valid = undefined
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

  validate(props, force = false) {
    this.touched = true
    this.validating = true
    return new Promise((resolve, reject) => {
      const errors = []
      // required
      if (props.required && !this.value) {
        errors.push(`field is required`)
      }
      // resolve
      if (errors.length === 0) {
        // no errors
        this.valid = true
        this.errors = null
        resolve(this)
      } else {
        // found errors
        this.valid = false
        this.errors = errors
        reject(errors)
      }
      this.validating = false
      this.render(props)
    })
  }

  handleInput(e, props) {
    if (this.errors) {
      this.valid = undefined
      this.errors = null
      this.element.classList.remove('field-error')
    }
    this.value = e.target.value
    this.updateValue()
  }

  handleChange(e, props) {
    if (props.onchange) {
      props.onchange(this)
    }
  }

  handleFocus(e, props) {
    if (props.onfocus) {
      props.onfocus(this)
    }
  }

  handleBlur(e, props) {
    this.touched = true
    this.value = e.target.value.trim()
    if (!props.multiline) {
      this.value = this.value.replace(/\s+/g, ' ')
    }
    if (props.onblur) {
      props.onblur(this)
    }
    this.validate(props).catch(err => {})
  }
}
