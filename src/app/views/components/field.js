const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Field extends Component {

  constructor(props) {
    super()
    this.name = props.name
    this.value = props.value
    this.state = {
      inputValue: null,
      touched: false,
      focus: false,
      validating: false,
      errors: null,
    }
    this.update(props)
  }

  createElement(field, opt = {}) {
    return html`
      <label
        class="field field-border ${
          this.state.focus && `field-focus` || ``
        } bg-white ${
          opt.max && `max${opt.max}` || ``
        } ${
          this.state.touched && this.state.errors && `field-invalid` || ``
        }"
      >
        <div
          class="field-label f4 fw500 color-black-40 bg-white"
        >${this.props.label}</div>
        ${this.state.errors && html`
          <div
            class="field-note f4 fw500 color-black-40 bg-white"
          >${this.state.errors[0]}</div>
        ` || this.props.required && html`
          <div class="field-note f4 fw500 color-black-40 bg-white">required</div>
        ` || ``}
        ${field}
      </label>
    `
  }

  update(props) {
    if (props.onupdate) {
      props = props.onupdate(props)
    }
    if (props.value !== undefined && this.value !== props.value) {
      this.value = props.value
    }
    this.props = props
    return true
  }

  sanitize(sanitize) {
    if (this.state.inputValue !== null) {
      // sanitize
      this.value = sanitize
        ? sanitize(this.state.inputValue)
        : this.state.inputValue
      // input value
      this.state.inputValue = null
      // onchange event
      if (this.props.onchange) {
        this.props.onchange(this)
      }
    }
  }

  validate(validate) {
    this.state.touched = true
    this.state.validating = true
    return new Promise((resolve, reject) => {
      const errors = []
      // sanitize
      this.sanitize()
      // required
      if (this.props.required && !this.value) {
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
    }).then(() => (
      validate && validate(this)
    )).catch(err => {
      if (!this.state.errors) {
        this.state.errors = []
      }
      this.state.errors.push(err.message)
    }).finally(() => {
      this.state.validating = false
    }).then(() => (
      this
    ))
  }

  isValid() {
    return !this.state.errors
  }

  handleInput(e) {
    // input
    this.state.inputValue = e.target.value
    // errors
    if (this.state.errors) {
      this.state.errors = null
      this.element.classList.remove('field-invalid')
    }
  }

  handleFocus(e) {
    if (this.state.focus) {
      clearTimeout(this.state.focus)
    } else {
      this.element.classList.add('field-focus')
    }
  }

  handleBlur(e) {
    this.state.focus = setTimeout(() => {
      this.state.focus = false
      this.validate().then(() => {
        this.render(this.props)
      })
      this.element.classList.remove('field-focus')
    })
  }
}
