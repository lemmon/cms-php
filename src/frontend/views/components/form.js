const html = require('nanohtml')
const Component = require('nanocomponent')

module.exports = class Form extends Component {
  constructor() {
    super()
  }

  createElement({ current, onsubmit }) {
    return html`
      <form
        novalidate="true"
        onsubmit=${onsubmit}
      >
        <div class="p05">
          ${current.fields.map(field => {
            return html`
              <div class="p1 max40"><label class="block" style="position: relative;">
                <div
                  class="f2 fw500 color-black-40 bg-white"
                  style="
                    line-height: 1rem;
                    position: absolute;
                    left: .5rem;
                    top: -.5rem;
                    padding: 0 .5rem;
                  "
                >${field.name}</div>
                <input
                  type="text"
                  name=${field.name}
                  value=""
                  class="p1 lh4 ba b-black-10 bg-white"
                  style="
                    display: block;
                    width: 100%;
                    font-family: inherit;
                    font-size: inherit;
                  "
                />
              </label></div>
            `
          })}
          <div class="p1">
            <button
              class="bg-blue color-white p1 lh4"
              style="
                display: block;
                border: 0;
                font-family: inherit;
                font-size: inherit;
              "
            >Submit Form</button>
          </div>
        </div>
      </form>
    `
  }

  update() {
    return true
  }
}
