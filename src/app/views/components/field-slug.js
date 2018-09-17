const html = require('nanohtml')
const TextField = require('./field-text')

module.exports = class SlugField extends TextField {

  update(props) {
    return super.update(Object.assign(props, {
      multiline: false,
    }))
  }

  sanitize() {
    super.sanitize(input => {
      return input
        .replace(/\W+/g, ' ').trim()
        .replace(/\s/g, '-').toLowerCase()
        || null
    })
  }
}
