(function (window) {
  'use strict';

  var ENTER_KEY = 13,
  ESCAPE_KEY = 27,
  Template = window.template || {};

  qs('.new-todo').addEventListener('focus', function () {
    Template.prototype.backupNewTodo(this.value);
  });

  qs('.new-todo').addEventListener('keypress', function (event) {
    if (event.keyCode === ENTER_KEY && helpers.trim(this.value)) {
      var todoObj = Template.prototype.createTodoObj(new Date().getTime(), '', '', this.value);
      Template.prototype.addTodo(todoObj);
      Template.prototype.increaseTotalCount();
      Template.prototype.decreaseCompletedCount();
      Template.prototype.setCounter();
      Template.prototype.toggleMainAndFooter();
      Template.prototype.toggleClearButton();
      Template.prototype.toggleMarkAllCompletedBtn();
      this.value = '';
    }
  });

  qs('.new-todo').addEventListener('keyup', function (event) {
    if (event.keyCode === ESCAPE_KEY) {
      this.value = Template.prototype.newTodoBackup;
    }
  });

  qs('.todo-list').addEventListener('click', function (event) {
    var target = event.target;
    if (target && target.nodeName === 'BUTTON') {
      var todoElem = target.parentNode.parentNode;
      Template.prototype.removeTodo(todoElem);

      if (helpers.hasClass(todoElem, 'completed')) {
        Template.prototype.decreaseCompletedCount();
      } else {
        Template.prototype.decreaseTotalCount();
      }

      Template.prototype.toggleClearButton();
      Template.prototype.toggleMarkAllCompletedBtn();
      Template.prototype.setCounter();
    }

    if (target && target.nodeName === 'INPUT' && helpers.hasClass(target, 'toggle')) {
      var input = target;
      Template.prototype.toggleInput.call(input, input.checked, input.parentNode.parentNode.id);
    }
  });

  qs('.todo-list').addEventListener('keyup', function (event) {
    var target = event.target;
    if (target && helpers.hasClass(target, 'edit')) {
      if (event.keyCode === ENTER_KEY && helpers.trim(target.value)) {

        var input = target,
        completed = (helpers.hasClass(input.parentNode, 'completed')) ? 'completed' : '',
        checked = input.parentNode.querySelector('.toggle').checked,
        index = helpers.getIndex(this, input),
        parentId = input.parentNode.id,
        todoObj = Template.prototype.createTodoObj(parentId, completed, checked, input.value);

        Template.prototype.addEditedTodo(index, todoObj);
        helpers.remove(input);
        Template.prototype.removeEditedItems();
      }

      if (event.keyCode === ESCAPE_KEY && helpers.trim(target.value)) {
        helpers.removeClass(target.parentNode, 'editing');
        helpers.remove(target);
      }
    }
  });

  window.addEventListener('hashchange', function () {
    Template.prototype.callSetFilter();
  });

  qs('.todo-list').addEventListener('dblclick', function (event) {
    var target = event.target;
    if (target && target.nodeName === 'LABEL') {

      // if there is a element that on html
      if (qs('.editing') !== null) {
        Template.prototype.closeEditInput();
      }

      Template.prototype.makeEditInput.call(this, target);
    }
  });

  qs('.clear-completed').addEventListener('click', function () {
    Template.prototype.removeCompletedItems();
    Template.prototype.toggleMainAndFooter();
    helpers.hide(this);
  });

  qs('#markAllCompleted').addEventListener('click', function () {
    Template.prototype.markAllCompleted();
    helpers.hide(this);
  });

})(window);
