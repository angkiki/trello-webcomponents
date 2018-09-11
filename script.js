document.addEventListener("DOMContentLoaded", function(event) {
  var columnCounter = 0;

  const COLUMNS_HOLDER = document.getElementById('column-holder');
  const ADD_COLUMN_BUTTON = document.getElementById('add-column');

  ADD_COLUMN_BUTTON.addEventListener('click', function() {
    const NEW_COLUMN = document.createElement('trello-column');
    NEW_COLUMN.setAttribute('class', 'trello-column-no-' + columnCounter);
    COLUMNS_HOLDER.appendChild(NEW_COLUMN);

    columnCounter += 1;
  });

});
