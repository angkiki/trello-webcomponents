(function() {
  class TrelloColumn extends HTMLElement {
    constructor() {
      super();

      // binding of functions
      this.titleClick = this.titleClick.bind(this);
      this.inputBlur = this.inputBlur.bind(this);
    };

    connectedCallback() {
      const DIV_HOLDER = document.createElement("div");
      DIV_HOLDER.setAttribute('class', 'column-title-holder');

      DIV_HOLDER.appendChild(this.createTitle());
      this.appendChild(DIV_HOLDER);
    };

    disconnectedCallback() {};

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      event handlers
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // click event handler for clicking on the title
    titleClick(event) {
      const CURRENT_TITLE = event.target.textContent;
      this.children[0].removeChild(event.target);
      this.children[0].appendChild(this.createInput(CURRENT_TITLE));
    };

    // on blur event handler for input tag
    inputBlur(event) {
      const INPUT_VALUE = event.target.value;
      this.children[0].removeChild(event.target);
      this.children[0].appendChild(this.createTitle(INPUT_VALUE));
    }


    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      custom functions
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // creates the input tag with the current title
    createInput(value) {
      const INPUT = document.createElement("input");
      INPUT.setAttribute('type', 'text');
      INPUT.setAttribute('value', value);
      INPUT.setAttribute('autofocus', true);
      INPUT.addEventListener('blur', this.inputBlur);

      return INPUT;
    }

    // creates the title tag
    createTitle(value = "Enter A Title") {
      const TITLE = document.createElement("h3");
      TITLE.textContent = value;
      TITLE.addEventListener('click', this.titleClick);

      return TITLE;
    }
  }

  window.customElements.define('trello-column', TrelloColumn);
})();
