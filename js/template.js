(function (window) {
  'use strict';

  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  var $todoList = qs('.todo-list'),
  $todoItemCounter = qs('.todo-count > .count'),
  $clearCompleted = qs('.clear-completed'),
  $markAllCompleted = qs('#markAllCompleted');

  /**
   * Sets up defaults for all the Template methods such as a default template
   *
   * @constructor
   */
  function Template() {
    var LI = document.createElement('li');
    LI.innerHTML
    =	'<div class="view">'
    +		'<input class="toggle" type="checkbox">'
    +		'<label></label>'
    +		'<button class="destroy"></button>'
    +	'</div>';
    this.todoNode = LI;
  }

  Template.prototype = {

    countObj: {
      active: 0,
      completed: 0,
      total: 0,
    },

    /**
	 * Used to indicate elements by the filter.
	 * @param{string} To indicate elements.
	 **/
    setFilter: function (filter) {

      helpers.removeClass(qs('.filters li a.selected'), 'selected');
      helpers.addClass(qs('.filters li a[href="#/' + filter + '"]'), 'selected');

      var i = 0,
      len = $todoList.children.length,
      currentItem,
      hasCompleted;
      for (; i < len; i++) {
        currentItem = $todoList.children[i];
        hasCompleted = helpers.hasClass(currentItem, 'completed');
        if (filter === 'active') {
          if (!hasCompleted) {
            helpers.show(currentItem);
          } else {
            helpers.hide(currentItem);
          }
        } else if (filter === 'completed') {
          if (hasCompleted) {
            helpers.show(currentItem);
          } else {
            helpers.hide(currentItem);
          }
        } else {
          helpers.show(currentItem);
        }
      }
    },

    /**
	 * Set view with initial values.
	 */
    setView: function () {
      this.createTodos(storage.findAll());
      this.setCounter();
      this.callSetFilter();
      this.toggleMainAndFooter();
      this.toggleClearButton();
      this.toggleMarkAllCompletedBtn();
    },

    /**
	 * To show or hide by the completed count.
	 */
    toggleClearButton: function () {
      if (Template.prototype.countObj.completed > 0) {
        helpers.show($clearCompleted);
      } else {
        helpers.hide($clearCompleted);
      }
    },

    /**
	 * Create and append all todos on localStorage
	 */
    createTodos: function (todos) {
      var i,
      todoItem,
      currentItem,
      fragments = document.createDocumentFragment();
      for (i in todos) {
        currentItem = todos[i],
        todoItem = this.createTodo(currentItem);
        fragments.appendChild(todoItem);
        if (currentItem.completed === 'completed') {
          this.countObj.completed++;
        } else {
          this.countObj.total++;
          this.countObj.active++;
        }
      }

      $todoList.appendChild(fragments);
    },

    /**
	 * @param{object} The todo object to create new todo item.
	 * @returns {object} The item generated new html todo element.
	 *
	 */
    createTodo: function (todo) {
      var template = new Template(),
      item = template.todoNode;
      item.id = todo.id;
      item.className = todo.completed;
      qs('.toggle', item).checked = todo.checked;
      qs('label', item).innerHTML = todo.title;
      return item;
    },

    /**
	 * @param{string} The val to back up for new todo item.
	 */
    backupNewTodo: function (val) {
      this.newTodoBackup = val;
    },

    /**
	 * @param{object} The todo object to add on html.
	 */
    addTodo: function (todo) {
      var todoElem = Template.prototype.createTodo(todo);
      $todoList.appendChild(todoElem);
      storage.save(todo);
    },

    addEditedTodo: function (index, todo) {
      var todoElem = Template.prototype.createTodo(todo);
      $todoList.insertBefore(todoElem, $todoList.children[index]);
      storage.update(todo.id, todo);
    },

    /**
	 * @param{object} The element remove on html, localStorage and execute counters.
	 */
    removeTodo: function (element) {
      helpers.remove(element);
      storage.remove(element.id);
    },

    /**
	 * @param{string} The id is id of items.
	 * @param{string} The completed is completed class of items.
	 * @param{boolean} The checked is check status of items.
	 * @param{string} The title is current value of items.
	 * @returns {object} The object has created todo item object.
	 */
    createTodoObj: function (id, completed, checked, title) {
      return {
        id: id,
        completed: completed,
        checked: checked,
        title: title,
      };
    },

    /**
	 * The function remove all edited items.
	 */
    removeEditedItems: function () {
      var editedTodoItems = Array.prototype.slice.call(qsa('.editing'));
      editedTodoItems.forEach(function (editingTodoItem) {
        helpers.remove(editingTodoItem);
      });
    },

    /**
	 * The function remove all completed items.
	 */
    removeCompletedItems: function () {
      var completedTodoItems = Array.prototype.slice.call(qsa('.completed'));
      completedTodoItems.forEach(function (completedTodoItem) {
        this.removeTodo(completedTodoItem);
        this.decreaseCompletedCount();
        this.toggleClearButton();
        this.toggleMarkAllCompletedBtn();
        this.setCounter();
      }.bind(this));
    },

    /**
	 * The function create filter and pass setFilter fn.
	 */
    callSetFilter: function () {
      var hash = document.location.hash,
      filterArr = hash.split('/'),
      filter;
      if (!hash) {
        filter = hash;
      } else {
        filter = filterArr.length ? filterArr[1] : filterArr[0];
      }

      this.setFilter(filter);
    },

    /**
	 * The function make an input to use edit todo.
	 * @param{object} The label is html object element.
	 */
    makeEditInput: function (label) {
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'edit';
      input.value = label.innerHTML;
      helpers.addClass(label.parentNode.parentNode, 'editing');
      qs('.editing').appendChild(input);
      qs('.edit', qs('.editing')).focus();
    },

    /**
	 * The function remove editing mode.
	 */
    closeEditInput: function () {
      var editingTodo = qs('.editing');
      helpers.remove(qs('.edit', editingTodo));
      helpers.removeClass(editingTodo, 'editing');
    },

    /**
	 * The function increase total count.
	 */
    increaseTotalCount: function () {
      this.countObj.total++;
    },

    /**
	 * The function decrease total count.
	 */
    decreaseTotalCount: function () {
      this.countObj.total = this.countObj.total ? (this.countObj.total - 1) : 0;
    },

    /**
	 * The function increase completed count.
	 */
    increaseCompletedCount: function () {
      this.countObj.completed++;
    },

    /**
	 * The function decrease completed count.
	 */
    decreaseCompletedCount: function () {
      this.countObj.completed = this.countObj.completed ? (this.countObj.completed - 1) : 0;
    },

    /**
	 * The function set on html total count.
	 */
    setCounter: function () {
      $todoItemCounter.innerHTML = this.countObj.total;
    },

    /**
	 * The function show or hide .main and .footer elements.
	 */
    toggleMainAndFooter: function () {
      if (this.countObj.completed || this.countObj.total) {
        helpers
        .show(qs('.main'))
        .show(qs('.footer'));
      } else {
        helpers
        .hide(qs('.main'))
        .hide(qs('.footer'));
      }
    },

    /**
	 * The function check or uncheck items.
	 * @param{boolean} The checked is check status of items.
	 * @param{string} The parentId is id of items.
	 */
    toggleInput: function (checked, parentId) {

      var completed = '',
      title = qs('label', this.parentNode).innerHTML;

      if (checked) {
        completed = 'completed';
        helpers.addClass(this.parentNode.parentNode, 'completed');
        Template.prototype.decreaseTotalCount();
        Template.prototype.increaseCompletedCount();
      } else {
        helpers.removeClass(this.parentNode.parentNode, 'completed');
        Template.prototype.increaseTotalCount();
        Template.prototype.decreaseCompletedCount();
      }

      this.checked = checked;

      var todoObj = Template.prototype.createTodoObj(parentId, completed, checked, title);
      storage.update(parentId, todoObj);
      Template.prototype.setCounter();
      Template.prototype.toggleClearButton();
      Template.prototype.toggleMarkAllCompletedBtn();
    },

    /**
	 * The function show or hide $markAllCompleted element.
	 */
    toggleMarkAllCompletedBtn: function () {
      if (this.countObj.total && (this.countObj.total !== this.countObj.completed)) {
        helpers.show($markAllCompleted);
      } else {
        helpers.hide($markAllCompleted);
      }
    },

    /**
	 * The function marks all items as completed
	 */
    markAllCompleted: function () {
      var isNotCompletedElements = qsa('li:not(.completed)', $todoList),
		isNotCompletedTodoItems = Array.prototype.slice.call(isNotCompletedElements);
      isNotCompletedTodoItems.forEach(function (items) {
        this.toggleInput.call(qs('.toggle', items), true, items.id);
      }.bind(this));
    },
  };

  Template.prototype.setView();

  window.template = Template;
})(window);
