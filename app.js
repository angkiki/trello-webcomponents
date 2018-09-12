(function() {

  class App extends HTMLElement {
    constructor() {
      super();

      // global variable
      this.draggedNode = null;

      this.drop = this.drop.bind(this);
      this.mousedown = this.mousedown.bind(this);
      this.addColumn = this.addColumn.bind(this);
      this.createControlBar = this.createControlBar.bind(this);
    };

    connectedCallback() {
      // this.addEventListener("dragover", this.dragover);
      // this.addEventListener("dragenter", this.dragenter);
      // this.addEventListener("drop", this.drop);
      this.addEventListener("mousedown", this.mousedown);

      this.createControlBar();

      // populate data
      this.loadData();
    }

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      event handlers
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // adding columns
    addColumn() {
      // checking all the column titles to prevent duplicates
      fetch("http://localhost:3000/columns").then(r => r.json()).then(data => {
        var name = "New Column";
        var counter = 0;
        var duplicate = 0;

        while (counter < data.length) {
          if (data[counter].title === name) {
            duplicate += 1;
            name = "New Column (" + duplicate + ")";
            counter = 0;
          };
          counter += 1;
        };
        return name;
      }).then(result => {
        return fetch("http://localhost:3000/columns/", {
           method: "POST",
           headers: {
             "Content-Type": "application/json; charset=utf-8"
           },
           body: JSON.stringify({ title: result})
         });
      }).then(response => {
        if (response.status === 201) {
          this.loadData();
        }
      });
    };

    // drag and drop events
    dragover(event) {
      event.preventDefault()
    };

    dragenter(event) {
      event.preventDefault()
    };

    drop(event) {
      const COL_ID = parseInt(this.findTrelloColumn(event.target).id);
      const CARD_ID = this.getCardId(this.draggedNode.id);

      fetch("http://localhost:3000/cards").then(r => r.json()).then(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == CARD_ID && data[i].columnId != COL_ID) {
            fetch("http://localhost:3000/cards/" + CARD_ID, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                columnId: parseInt(COL_ID)
              })
            }).then(response => {
                if (response.status === 200) {
                  this.loadData();
                  return;
                }
            })
          }
        }
      })
      // console.log("DROP THIS CARD:", this.draggedNode);
      // console.log("INTO THIS COL:", this.findTrelloColumn(event.target));
    };

    mousedown(event) {
      this.draggedNode = this.findTrelloCard(event.target);
    };

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      custom functions
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // loading of columns from db
    loadData() {
      console.log("HELLO!");
      while (this.children[1].firstChild) {
          this.children[1].removeChild(this.children[1].firstChild);
      };

      fetch("http://localhost:3000/columns").then(r => r.json()).then(data => {
        for (let i = 0; i < data.length; i++) {
          let newCol = document.createElement("trello-column");
          this.children[1].appendChild(newCol);
          newCol.setAttribute('id', data[i].id);
          newCol.children[0].children[0].textContent = data[i].title;

          // attach dropping event handlers
          newCol.addEventListener("dragover", this.dragover);
          newCol.addEventListener("dragenter", this.dragenter);
          newCol.addEventListener("drop", this.drop);
        };
      }).then(
        this.loadCards()
      );
    };

    // loading of cards from db
    loadCards() {
      fetch("http://localhost:3000/cards").then(r => r.json()).then(data => {
        for (let i = 0; i < data.length; i++) {
          let col = document.getElementById(data[i].columnId);
          let newCard = document.createElement('trello-card');
          col.children[1].appendChild(newCard);

          newCard.children[0].children[0].textContent = data[i].title;
          newCard.children[0].children[1].textContent = data[i].description;
          newCard.setAttribute('id', 'card-' + data[i].id);
        }
      });
    };

    // creating of control bar and columns holder
    createControlBar() {
      // creating control bar and its child elements
      const CONTROL_BAR = document.createElement('div');
      CONTROL_BAR.setAttribute('id', 'control-bar');
      this.appendChild(CONTROL_BAR);

      const TITLE = document.createElement('h3');
      CONTROL_BAR.appendChild(TITLE);
      TITLE.textContent = "Trello - Webcomponents";

      const BUTTON = document.createElement('button');
      CONTROL_BAR.appendChild(BUTTON);
      BUTTON.setAttribute('id', 'add-column');
      BUTTON.textContent = "Add Column";
      BUTTON.addEventListener('click', this.addColumn);

      const COLUMN_HOLDER = document.createElement('div');
      COLUMN_HOLDER.setAttribute('id', 'trello-column-holder');
      this.appendChild(COLUMN_HOLDER);
    };

    // to return the entire trello-card element
    findTrelloCard(target) {
      var node = target;

      while(node.tagName !== "TRELLO-CARD") {
        node = node.parentNode;

        if (node.tagName === "BODY") {
          return null;
        };
      }

      return node;
    };

    // to return the entire trello-column element
    findTrelloColumn(target) {
      var node = target;

      while(node.tagName !== "TRELLO-COLUMN") {
        node = node.parentNode;

        if (node.tagName === "BODY") {
          return;
        };
      };

      return node;
    };

    // return the number for card id
    getCardId(fullId) {
      fullId = fullId.split('-');
      return fullId[fullId.length - 1];
    };
  };

  window.customElements.define("trello-app", App);
})();
