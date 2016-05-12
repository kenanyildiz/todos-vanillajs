(function (window) {
  'use strict';

  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  var $todoList = qs('.todo-list');
  var $todoItemCounter = qs('.todo-count');
  var $clearCompleted = qs('.clear-completed');
  var $toggleAll = qs('.toggle-all');
  var $newTodo = qs('.new-todo');

  function Template() {
    var LI = document.createElement('li');
    LI.id = '{{id}}';
    LI.className = '{{completed}}';
    LI.innerHTML
    =	'<div class="view">'
    +		'<input class="toggle" type="checkbox">'
    +		'<label></label>'
    +		'<button class="destroy"></button>'
    +	'</div>';
    this.todoNode = LI;
  }

  Template.prototype.countObj = {
    active: 0,
    completed: 0,
    total: 0,
  };

  Template.prototype.setFilter = function (filter) {

    qs('.filters li a.selected').classList.remove('selected');

    qs('.filters li a[href="#/' + filter + '"]').classList.add('selected');

    for (var i = 0; i < $todoList.children.length; i++) {
      var currentItem = $todoList.children[i];
      var completedIndexOf = currentItem.className.indexOf('completed');
      var hasCompleted = (completedIndexOf !== -1);
      if (filter === 'active') {
        if (!hasCompleted) {
          this.show(currentItem);
        } else {
          this.hide(currentItem);
        }
      } else if (filter === 'completed') {
        if (hasCompleted) {
          this.show(currentItem);
        } else {
          this.hide(currentItem);
        }
      } else {
        this.show(currentItem);
      }

    }

  };

  Template.prototype.show = function (element) {
    element.style.display = 'block';
    return this;
  };

  Template.prototype.hide = function (element) {
    element.style.display = 'none';
    return this;
  };

  Template.prototype.setView = function () {
    this.createTodos(todosAPI.getAll());
    this.callSetFilter();
    this.toggleClearButton(this.countObj.completed);
  };

  Template.prototype.toggleClearButton = function (completed) {
    if (completed > 0) {
      this.show($clearCompleted);
    } else {
      this.hide($clearCompleted);
    }
  };

  Template.prototype.createTodos = function (todos) {

    var i;
    for (i in todos) {
      var todoItem = this.createTodo('localStorage', todos[i]);
      $todoList.appendChild(todoItem, $todoList.children[todos[i].position]);
      if (todos[i].completed === 'completed') {
        this.countObj.completed++;
      } else {
        this.countObj.total++;
        this.countObj.active++;
      }
    }

    this.setCounter();

  };

  Template.prototype.createTodo = function (from, todo) {
    var template = new Template();
    var item = template.todoNode;
    item.id = todo.id;
    item.className = todo.completed;
    qs('.toggle', item).checked = todo.checked;
    qs('label', item).innerHTML = todo.title;
    if (from !== 'localStorage') {
      todosAPI.setItem(from, todo);
    }

    return item;
  };

  Template.prototype.trim = function (val) {
    return val.trim();
  };

  Template.prototype.backupNewTodo = function (val) {
    this.oldValue = val;
  };

  Template.prototype.getIndex = function (elem) {
    var nodeList = Array.prototype.slice.call($todoList.children);
    return nodeList.indexOf(elem.parentNode);
  };

  Template.prototype.addTodo = function (from, todo) {
    var newTodo = Template.prototype.createTodo(from, todo);
    $todoList.insertBefore(newTodo, $todoList.children[todo.position]);
  };

  Template.prototype.removeTodo = function (button) {
    this.removeChild(button.parentNode.parentNode);
    todosAPI.deleteItem({ id: button.parentNode.parentNode.id });

    // Parent item has no completed class
    if (button.parentNode.parentNode.className.indexOf('completed') === -1) {
      Template.prototype.decreaseTotalCount();
      Template.prototype.decreaseCompletedCount();
    }

    Template.prototype.toggleMainAndFooter(Template.prototype.countObj.completed || Template.prototype.countObj.total);

  };

  Template.prototype.callSetFilter = function () {
    var hash = document.location.hash;
    var filterArr = hash.split('/');
    var filter = filterArr.length > 1 ? filterArr[1] : filterArr[0];
    Template.prototype.setFilter(filter);
  };

  Template.prototype.makeEditInput = function (label) {
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit';
    input.value = label.innerHTML;
    label.parentNode.parentNode.classList.add('editing');
    label.parentNode.parentNode.appendChild(input);
  };

  Template.prototype.removeEditInput = function (target) {
    target.parentNode.removeChild(target);
  };

  Template.prototype.increaseTotalCount = function () {
    this.countObj.total++;
    $todoItemCounter.firstElementChild.innerHTML = this.countObj.total;
  };

  Template.prototype.decreaseTotalCount = function () {

    if (this.countObj.total > 0) {
      this.countObj.total--;
    } else {
      this.countObj.total = 0;
    }

    $todoItemCounter.firstElementChild.innerHTML = this.countObj.total;

  };

  Template.prototype.increaseCompletedCount = function () {
    this.countObj.completed++;
    this.toggleClearButton(this.countObj.completed);
  };

  Template.prototype.decreaseCompletedCount = function () {

    if (this.countObj.completed > 0) {
      this.countObj.completed--;
    } else {
      this.countObj.completed = 0;
    }

    this.toggleClearButton(this.countObj.completed);

  };

  Template.prototype.setCounter = function () {
    $todoItemCounter.firstElementChild.innerHTML = this.countObj.total;
    this.toggleMainAndFooter(this.countObj.completed || this.countObj.total);
  };

  Template.prototype.toggleMainAndFooter = function (status) {

    if (status) {
      this.show(qs('.main'))
      .show(qs('.footer'));
    } else {
      this.hide(qs('.main'))
      .hide(qs('.footer'));
    }
  };

  Template.prototype.toggleInput = function (checked, parentId) {

    var todoItem = {
      id: parentId,
      completed: checked ? 'completed' : '',
      checked: checked,
      title: qs('label', this.parentNode).innerHTML,
      position: 0,
    };

    if (checked) {
      this.parentNode.parentNode.classList.add('completed');
      Template.prototype.decreaseTotalCount();
      Template.prototype.increaseCompletedCount();
    } else {
      this.parentNode.parentNode.classList.remove('completed');
      Template.prototype.increaseTotalCount();
      Template.prototype.decreaseCompletedCount();
    }

    var deletedItemIndex = todosAPI.deleteItem({ id: parentId });
    todosAPI.setItem(deletedItemIndex, todoItem);

    this.toggleClearButton(this.countObj.completed);

  };

  Template.prototype.setView();

  window.template = Template;
})(window);
