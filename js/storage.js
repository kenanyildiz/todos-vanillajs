var storage = (function (prefix) {
  'use strict';

  /**
   * Drop the all items on localStorage
   * */
  var drop = function () {
    localStorage.clear();
  };

  /**
   * Remove the todo item which has that id
   * @param{string} The id to remove that item
   * */
  var remove = function (id) {

    var i,
    items = localStorage.getItem(prefix),
    parsedItems = JSON.parse(items);

    if (parsedItems !== null) {
      for (i in parsedItems) {
        if (parseInt(parsedItems[i].id) === parseInt(id)) {
          parsedItems.splice(i, 1);
          break;
        }
      }

      localStorage.setItem(prefix, JSON.stringify(parsedItems));
    }
  };

  /**
   * To save an item on localStorage.
   * @param{string} The from to remove item from correct position.
   * @param{object} The todo object to add on localStorage.
   * */
  var save = function (todo) {

    var items = localStorage.getItem(prefix),
    parsedItems = JSON.parse(items);

    if (parsedItems === null) {
      parsedItems = [];
    }

    parsedItems.push(todo);

    localStorage.setItem(prefix, JSON.stringify(parsedItems));
  };

  /**
   * Update item to get an id and todo which has that id on localStorage
   * @param{string} The id to get that item
   * @param{object} The todo object to update that item
   * */
  var update = function (id, todo) {

    var i,
    items = localStorage.getItem(prefix),
    parsedItems = JSON.parse(items);

    if (parsedItems !== null) {
      for (i in parsedItems) {
        if (parseInt(parsedItems[i].id) === parseInt(id)) {
          parsedItems.splice(i, 1, todo);
          break;
        }
      }
    }

    localStorage.setItem(prefix, JSON.stringify(parsedItems));
  };

  /**
   * Find item to get an item which has that id on localStorage
   * @param{string} The id to get that item
   * */
  var find = function (id) {

    var i,
    foundItem,
    items = localStorage.getItem(prefix),
    parsedItems = JSON.parse(items);

    if (parsedItems !== null) {
      for (i in parsedItems) {
        if (parseInt(parsedItems[i].id) === parseInt(id)) {
          foundItem = parsedItems[i];
          break;
        }
      }
    }

    return foundItem;
  };

  /**
   * Find all items on localStorage;
   * returns {object} Object of all items items.
   * */
  var findAll = function () {
    return JSON.parse(localStorage.getItem(prefix));
  };

  return {
    drop: drop,
    remove: remove,
    save: save,
    update: update,
    find: find,
    findAll: findAll,
  };

})('todos-vanillajs');
