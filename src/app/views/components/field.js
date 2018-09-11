const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Field extends Component {

  constructor(props) {
    super()
    this.name = props.name
    this.value = props.value
    this.state = {
      initialValue: props.value,
      touched: false,
      validating: false,
      errors: null,
    }
    this.update(props)
  }

  update(props) {
    if (props.onupdate) {
      props = props.onupdate(props)
    }
    if (props.value !== undefined && props.value !== this.value) {
      this.value = props.value
    }
    this.props = props
    return true
  }

  sanitize(sanitize) {
    if (sanitize && this.state.initialValue !== this.value) {
      // custom sanitize
      sanitize()
      // onchange event
      if (this.props.onchange) {
        this.props.onchange(this)
      }
    }
    // initial value
    this.state.initialValue = this.value
  }

  validate() {
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
      this.state.validating = false
      this.render(this.props)
    })
  }

  handleInput(e) {
    this.value = e.target.value
    if (this.state.errors) {
      this.state.errors = null
      this.element.classList.remove('field-invalid')
    }
    if (this.props.onchange) {
      this.props.onchange(this)
    }
  }

  handleFocus(e) {
    if (this.props.onfocus) {
      this.props.onfocus(this)
    }
  }

  handleBlur(e) {
    this.state.touched = true
    this.sanitize()
    if (this.props.onblur) {
      this.props.onblur(this)
    }
    this.validate().catch( err => {} ) // TODO: report error
  }
}
