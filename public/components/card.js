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
      this.titleBlur = this.titleBlur.bind(this);
      this.descBlur = this.descBlur.bind(this);
      this.toggleDescription = this.toggleDescription.bind(this);
      this.deleteCard = this.deleteCard.bind(this);
    };

    connectedCallback() {
      // DIV FOR HOLDING THE COLUMNS TITLE
      const CARD_CONTENT_HOLDER = document.createElement("div");
      CARD_CONTENT_HOLDER.setAttribute('class', 'card-contents-holder');

      CARD_CONTENT_HOLDER.appendChild(this.createTitle());
      CARD_CONTENT_HOLDER.appendChild(this.createDesc());
      this.appendChild(CARD_CONTENT_HOLDER);

      // BUTTON
      const DELETE_BUTTON = document.createElement("button");
      DELETE_BUTTON.textContent = "Delete";
      DELETE_BUTTON.addEventListener('click', this.deleteCard);

      this.appendChild(DELETE_BUTTON);

      // setting trello-card attribute
      this.setAttribute('draggable', true);
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
      const CARD_ID = this.getCardId(this.id);

      fetch("http://localhost:3000/cards").then(r => r.json()).then(data => {
        var duplicate = false;
        var oldCardName = null;

        for (let i = 0; i < data.length; i++) {
          if (INPUT_VALUE === data[i].title) {
            duplicate = true;
          };

          if (CARD_ID == data[i].id) {
            oldCardName = data[i].title;
          };
        };

        return duplicate ? oldCardName : INPUT_VALUE;
      }).then(result => {
          // this.children[0] #=> <div class='card-contents-holder'></div>
          this.children[0].removeChild(event.target);
          this.children[0].insertBefore(this.createTitle(result), this.children[0].children[0]);

          fetch("http://localhost:3000/cards/" + CARD_ID, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
              title: result
            })
          });
      })

    };

    // card description blur
    descBlur(event) {
      const INPUT_VALUE = event.target.value;
      const CARD_ID = this.getCardId(this.id);

      // this.children[0] #=> <div class='card-contents-holder'></div>
      this.children[0].removeChild(event.target);
      const NEW_DESC = this.createDesc(INPUT_VALUE);
      NEW_DESC.style.display = "block";
      this.children[0].appendChild(NEW_DESC);

      fetch("http://localhost:3000/cards/" + CARD_ID, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          description: INPUT_VALUE
        })
      });
    };

    toggleDescription(event) {
      if (this.descriptionIsVisible) {
        this.descriptionIsVisible = false;
        this.children[0].children[1].style.display = "none"
      } else {
        this.descriptionIsVisible = true;
        this.children[0].children[1].style.display = "inline-block"
      }
    };

    deleteCard() {
      const CARD_ID = this.getCardId(this.id);
      fetch("http://localhost:3000/cards/" + CARD_ID, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }).then(response => {
        if (response.status === 200) {
          this.parentNode.removeChild(this);
        }
      });
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
    createDesc(value = "Enter a Description") {
      const DESC = document.createElement("p");
      DESC.textContent = value;
      DESC.addEventListener('click', this.descClick);

      return DESC;
    };

    // create input, 2nd argument is to determine
    // which event handler to attach and whether
    // create a input or textarea
    createInput(value, type) {
      if (type === "title") {
        var blurFunc = this.titleBlur
        var input = document.createElement("input");
        input.setAttribute('type', 'text');
        input.setAttribute('value', value);
      } else if (type === "desc") {
        var blurFunc = this.descBlur
        var input = document.createElement("textarea");
        input.setAttribute('type', 'text');
        input.textContent = value;
      };

      input.addEventListener('blur', blurFunc);

      return input;
    };

    // return the number for card id
    getCardId(fullId) {
      fullId = fullId.split('-');
      return fullId[fullId.length - 1];
    }
  };

  window.customElements.define('trello-card', TrelloCard);
})();
