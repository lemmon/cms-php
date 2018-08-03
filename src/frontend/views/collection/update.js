const html = require('nanohtml')
const router = require('../../lib/router')

const handleSubmit = (e, { current }, state) => {
  e.preventDefault()
  const form = e.target
  for (const field of form) {
    console.log(field.name, field.value)
  }
}

module.exports = ({ current }, state) => html`
  <section class="span1">
    <div class="p05">
      <header class="p05 row items-center">
        <h1 class="p1 h3" style="line-height: 2rem;">${current.name}</h1>
        <div class="p1 div color-black-20 self-stretch"></div>
        <div class="p1 lh5"><a class="color-black-50 a-ul a-color-inherit" href="/${current.id}">back</a></div>
      </header>
      <form
        novalidate="true"
        onsubmit=${e => handleSubmit(e, { current }, state)}
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
    </div>
  </section>
`
