(function (window) {
  'use strict';

  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;
  var Template = window.template || {};

  document.querySelector('.new-todo').addEventListener('focus', function () {
    Template.prototype.backupNewTodo(this.value);
  });

  document.querySelector('.new-todo').addEventListener('keypress', function (event) {
    if (event.keyCode === ENTER_KEY && Template.prototype.trim(this.value)) {
      var todoObj = {
        id: new Date().getTime(),
        completed: '',
        checked: '',
        title: this.value,
        position: 0,
      };
      Template.prototype.addTodo('new', todoObj);
      Template.prototype.increaseTotalCount();
      Template.prototype.decreaseCompletedCount();
      Template.prototype.toggleMainAndFooter(Template.prototype.countObj.completed || Template.prototype.countObj.total);
      this.value = '';
    }
  });

  document.querySelector('.new-todo').addEventListener('keyup', function (event) {
    if (event.keyCode === ESCAPE_KEY) {
      this.value = Template.prototype.oldValue;
    }
  });

  document.querySelector('.todo-list').addEventListener('click', function (event) {
    if (event.target && event.target.nodeName == 'BUTTON') {
      Template.prototype.removeTodo.call(this, event.target);
    }

    if (event.target && event.target.nodeName == 'INPUT' && event.target.className.indexOf('toggle') !== -1) {
      var input = event.target;
      Template.prototype.toggleInput.call(input, input.checked, input.parentNode.parentNode.id);
    }
  });

  document.querySelector('.todo-list').addEventListener('keyup', function (event) {

    if (event.target.className.indexOf('edit') !== -1) {
      if (event.keyCode === ENTER_KEY && Template.prototype.trim(event.target.value)) {
        var input = event.target;
        var todoObj = {
          id: new Date().getTime(),
          completed: (input.parentNode.className.indexOf('completed') !== -1) ? 'completed' : '',
          checked: input.parentNode.querySelector('.toggle').checked,
          title: input.value,
          position: Template.prototype.getIndex(input),
        };
        Template.prototype.addTodo(Template.prototype.getIndex(input), todoObj);
        Template.prototype.increaseTotalCount();
        Template.prototype.decreaseCompletedCount();
        Template.prototype.removeEditInput(input);

        var childrens = this.children;
        for (var i = 0; i < childrens.length; i++) {
          var currentElement = childrens[i];
          if (currentElement.className.indexOf('editing') !== -1) {
            todosAPI.deleteItem({ id: currentElement.id });
            this.removeChild(currentElement);
            Template.prototype.decreaseTotalCount();
            Template.prototype.increaseCompletedCount();
            i--;
          }
        }
      }
    }

  });

  window.addEventListener('hashchange', function () {
    Template.prototype.callSetFilter();
  });

  document.querySelector('.todo-list').addEventListener('dblclick', function (event) {
    if (event.target && event.target.nodeName == 'LABEL') {
      var label = event.target;
      Template.prototype.makeEditInput.call(this, label);
    }
  });

  document.querySelector('.clear-completed').addEventListener('click', function () {
    var childrens = document.querySelector('.todo-list').children;
    for (var i = 0; i < childrens.length; i++) {
      if (childrens[i].className.indexOf('completed') !== -1) {
        todosAPI.deleteItem({ id: childrens[i].id });
        childrens[i].parentNode.removeChild(childrens[i]);
        i--;
      }
    }

    Template.prototype.hide(this);
  });

})(window);
