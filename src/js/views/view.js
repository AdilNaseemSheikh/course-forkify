import icons from "url:../../img/icons.svg";
export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderError();
      return;
    }
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   this.renderError();
    //   return;
    // }
    this._data = data;
    const newMarkup = this._generateMarkup();
    // converting string html to real DOM node, this is virtual dom, available only in our memory
    const newDom = document.createRange().createContextualFragment(newMarkup);
    let newElements = newDom.querySelectorAll("*");
    console.log(newElements);
    // converting nodelist to array
    newElements = Array.from(newElements);
    // this is actual dom, available on browser
    let curElements = this._parentElement.querySelectorAll("*");

    curElements = Array.from(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // second check checks if the node is text or something else
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // now curEl is the one that is currently on the page (live)
        curEl.textContent = newEl.textContent;
      }
      // update all the attribute of the node as well (dataset)
      if (!newEl.isEqualNode(curEl)) {
        // convert newEl.attributes object to array, loop over it and copy its content to curEl
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
          // console.log(attr.name,' : ', attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
