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
      this.addEventListener("dragover", this.dragover);
      this.addEventListener("dragenter", this.dragenter);
      this.addEventListener("drop", this.drop);
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
      console.log("DROPPED:", event.target);
      // console.log(this.children[1]);
      // console.log("TO DROP:");
      console.log("DRAGGED:",this.draggedNode);
    };

    mousedown(event) {
      // console.log(event.target.parentNode);
      this.draggedNode = event.target.parentNode;
      // console.log("-------")
      console.log("Dragged: ", this.draggedNode);
    };

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      custom functions
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

    // loading of columns from db
    loadData() {
      while (this.children[1].firstChild) {
          this.children[1].removeChild(this.children[1].firstChild);
      };

      fetch("http://localhost:3000/columns").then(r => r.json()).then(data => {
        for (let i = 0; i < data.length; i++) {
          let newCol = document.createElement("trello-column");
          this.children[1].appendChild(newCol);
          newCol.setAttribute('id', data[i].id);
          newCol.children[0].children[0].textContent = data[i].title;
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
          newCard.setAttribute('id', 'card' + data[i].id);
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
  };

  window.customElements.define("trello-app", App);
})();
