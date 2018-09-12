document.addEventListener("DOMContentLoaded", function(event) {
  var columnCounter = 1;

  const COLUMNS_HOLDER = document.getElementById('column-holder');
  const ADD_COLUMN_BUTTON = document.getElementById('add-column');

  ADD_COLUMN_BUTTON.addEventListener('click', function() {
    const NEW_COLUMN = document.createElement('trello-column');
    NEW_COLUMN.setAttribute('class', 'trello-column-no-' + columnCounter);
    COLUMNS_HOLDER.appendChild(NEW_COLUMN);

    columnCounter += 1;
  });


  // POPULATING THE INDEX HTML WITH DB DATA
  // for (let i = 0; i < db.columns.length; i++) {
  //   let newColumn = document.createElement("trello-column");
  //   COLUMNS_HOLDER.appendChild(newColumn);
  //
  //   newColumn.setAttribute('class', 'trello-column-no-' + columnCounter);
  //   newColumn.children[0].children[0].textContent = db.columns[i].title;
  //
  //   for (let j = 0; j < db.cards.length; j++) {
  //     if (db.cards[j].columnId == db.columns[i].id) {
  //       let newCard = document.createElement("trello-card");
  //       newColumn.children[1].appendChild(newCard);
  //       newCard.children[0].children[0].textContent = db.cards[j].title;
  //       newCard.children[0].children[1].textContent = db.cards[j].description;
  //     };
  //   };
  //
  //   columnCounter += 1;
  // };
});
