var todosAPI = (function () {
  'use strict';

  var prefix = 'todos-vanillajs';
  var deletedItemIndex;

  var drop = function () {
    localStorage.clear();
  };

  var deleteItem = function (todo) {

    var data = localStorage.getItem(prefix);
    var parsedData = JSON.parse(data);

    if (data !== null) {
      var i;
      for (i in parsedData) {
        if (parseInt(parsedData[i].id) === parseInt(todo.id)) {
          parsedData.splice(i, 1);
          deletedItemIndex = i;
        }
      }

      localStorage.setItem(prefix, JSON.stringify(parsedData));

      return deletedItemIndex;

    } else {

      localStorage.clear();
    }

  };

  var setItem = function (from, todo) {

    var data = localStorage.getItem(prefix);
    var parsedData = JSON.parse(data);

    if (parsedData === null) {
      parsedData = [];
    }

    if (from !== undefined) {
      parsedData.splice(from, 0, todo);
	  debugger;
    } else {
      parsedData.unshift(todo);
      deletedItemIndex = undefined;
    }

    localStorage.setItem(prefix, JSON.stringify(parsedData));
  };

  var getItem = function (todo) {

    var data = localStorage.getItem(prefix);
    var parsedData = JSON.parse(data);
    var foundItem;

    if (data !== null) {
      var i;
      for (i in parsedData) {
        if (parseInt(parsedData[i].id) === parseInt(todo.id)) {
          foundItem = parsedData[i];
          break;
        }
      }
    }

    return foundItem;
  };

  var getAll = function () {
    return JSON.parse(localStorage.getItem(prefix));
  };

  return {
    drop: drop,
    deleteItem: deleteItem,
    setItem: setItem,
    getItem: getItem,
    getAll: getAll,
  };

})();
