(function() {
  class TrelloCard extends HTMLElement {
    constructor() {
      super();

      // for showing/hiding the description
      this.addEventListener('click', this.toggleDescription);
      this.descriptionIsVisible = false;

      // binding of functions
      this.titleClick = this.titleClick.bind(this);
      this.descClick = this.descClick.bind(this);
      this.createInput = this.createInput.bind(this);
      this.titleBlur = this.titleBlur.bind(this);
      this.descBlur = this.descBlur.bind(this);
      this.toggleDescription = this.toggleDescription.bind(this);
    };

    connectedCallback() {
      // DIV FOR HOLDING THE COLUMNS TITLE
      const CARD_CONTENT_HOLDER = document.createElement("div");
      CARD_CONTENT_HOLDER.setAttribute('class', 'card-contents-holder');

      CARD_CONTENT_HOLDER.appendChild(this.createTitle());
      CARD_CONTENT_HOLDER.appendChild(this.createDesc());
      this.appendChild(CARD_CONTENT_HOLDER);
    };


    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      event handlers
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // clicked on card title
    titleClick(event) {
      event.stopPropagation();
      const CURRENT_TITLE = event.target.textContent;

      // this.children[0] #=> <div class='card-contents-holder'></div>
      this.children[0].removeChild(event.target);
      this.children[0].insertBefore(this.createInput(CURRENT_TITLE, "title"), this.children[0].children[0]);

      // get the input and focus
      // children[0] for the h4 tag
      this.children[0].children[0].focus();
      this.children[0].children[0].setSelectionRange(0, CURRENT_TITLE.length);
    };

    // clicked on card description
    descClick(event) {
      event.stopPropagation();
      const CURRENT_TITLE = event.target.textContent;

      // this.children[0] #=> <div class='card-contents-holder'></div>
      this.children[0].removeChild(event.target);
      this.children[0].appendChild(this.createInput(CURRENT_TITLE, "desc"));

      // get the input and focus
      // children[1] for the p tag
      this.children[0].children[1].focus();
      this.children[0].children[1].setSelectionRange(0, CURRENT_TITLE.length);
    };

    // card title blur
    titleBlur(event) {
      const INPUT_VALUE = event.target.value;

      // this.children[0] #=> <div class='card-contents-holder'></div>
      this.children[0].removeChild(event.target);
      this.children[0].insertBefore(this.createTitle(INPUT_VALUE), this.children[0].children[0]);
    };

    // card description blur
    descBlur(event) {
      const INPUT_VALUE = event.target.value;

      // this.children[0] #=> <div class='card-contents-holder'></div>
      this.children[0].removeChild(event.target);
      const NEW_DESC = this.createDesc(INPUT_VALUE);
      NEW_DESC.style.display = "block";
      this.children[0].appendChild(NEW_DESC);
    };

    toggleDescription(event) {
      if (this.descriptionIsVisible) {
        this.descriptionIsVisible = false;
        this.children[0].children[1].style.display = "none"
      } else {
        this.descriptionIsVisible = true;
        this.children[0].children[1].style.display = "block"
      }
    };

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      custom functions
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // create card title
    createTitle(value = "Card Title") {
      const TITLE = document.createElement("h4");
      TITLE.textContent = value;
      TITLE.addEventListener('click', this.titleClick);

      return TITLE;
    };

    // create card description
    createDesc(value = "Enter Description") {
      const DESC = document.createElement("p");
      DESC.textContent = value;
      DESC.addEventListener('click', this.descClick);

      return DESC;
    };

    // create input, 2nd argument is to determine
    // which event handler to attach
    createInput(value, type) {
      const INPUT = document.createElement("input");
      INPUT.setAttribute('type', 'text');
      INPUT.setAttribute('value', value);

      if (type === "title") { var blurFunc = this.titleBlur };
      if (type === "desc") { var blurFunc = this.descBlur };

      INPUT.addEventListener('blur', blurFunc);

      return INPUT;
    };
  };

  window.customElements.define('trello-card', TrelloCard);
})();
