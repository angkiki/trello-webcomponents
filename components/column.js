(function() {
  class TrelloColumn extends HTMLElement {
    constructor() {
      super();

      // binding of functions
      this.titleClick = this.titleClick.bind(this);
      this.inputBlur = this.inputBlur.bind(this);
      this.deleteColumn = this.deleteColumn.bind(this);
    };

    connectedCallback() {
      // DIV FOR HOLDING THE COLUMNS TITLE
      const COLUMN_TITLE_HOLDER = document.createElement("div");
      COLUMN_TITLE_HOLDER.setAttribute('class', 'column-title-holder');

      COLUMN_TITLE_HOLDER.appendChild(this.createTitle());
      this.appendChild(COLUMN_TITLE_HOLDER);

      // DIV FOR HOLDING THE CARDS

      // DELETE BUTTON
      const DELETE_BUTTON = document.createElement("button");
      DELETE_BUTTON.textContent = "Delete";
      DELETE_BUTTON.addEventListener('click', this.deleteColumn);

      this.appendChild(DELETE_BUTTON);
    };

    disconnectedCallback() {};

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      event handlers
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@


    // click event handler for clicking on the title
    titleClick(event) {
      const CURRENT_TITLE = event.target.textContent;

      // this.children[0] #=> <div class='column-title-holder'></div>
      this.children[0].removeChild(event.target);
      this.children[0].appendChild(this.createInput(CURRENT_TITLE));

      // get the input and focus
      this.children[0].children[0].focus();
      this.children[0].children[0].setSelectionRange(0, CURRENT_TITLE.length);
    };

    // on blur event handler for input tag
    inputBlur(event) {
      const INPUT_VALUE = event.target.value;

      // this.children[0] #=> <div class='column-title-holder'></div>
      this.children[0].removeChild(event.target);
      this.children[0].appendChild(this.createTitle(INPUT_VALUE));
    }

    deleteColumn(event) {
      this.parentNode.removeChild(this);
    };

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      custom functions
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // creates the input tag with the current title
    createInput(value) {
      const INPUT = document.createElement("input");
      INPUT.setAttribute('type', 'text');
      INPUT.setAttribute('value', value);
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
