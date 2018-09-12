(function() {
  class App extends HTMLElement {

    constructor() {
      super();

      // global variable
      this.draggedNode = null;

      this.drop = this.drop.bind(this);
      this.mousedown = this.mousedown.bind(this);
    };

    connectedCallback() {
      this.addEventListener("dragover", this.dragover);
      this.addEventListener("dragenter", this.dragenter);
      this.addEventListener("drop", this.drop);
      this.addEventListener("mousedown", this.mousedown);

      this.preloadColumns();
    }

    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@
    //      event handlers
    // @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@

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
    preloadColumns() {
      fetch("http://localhost:3000/columns").then(
        r => r.json()
      ).then(
        data => {
          for (let i = 0; i < data.length; i++) {
            let newCol = document.createElement("trello-column");
            this.appendChild(newCol);
            newCol.setAttribute('id', data[i].id);
            newCol.children[0].children[0].textContent = data[i].title;
          };
      }).then(
        this.loadCards()
      );
    };

    loadCards() {
      fetch("http://localhost:3000/cards").then(
        r => r.json()
      ).then(
        data => {
          for (let i = 0; i < data.length; i++) {
            let col = document.getElementById(data[i].columnId);
            let newCard = document.createElement('trello-card');
            col.children[1].appendChild(newCard);

            newCard.children[0].children[0].textContent = data[i].title;
            newCard.children[0].children[1].textContent = data[i].description;
          }
      });
    };

  };

  window.customElements.define("trello-app", App);
})();
