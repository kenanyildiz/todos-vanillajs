'use strict';
var helpers = {
  show: function (element) {
    element.style.display = 'block';
    return this;
  },

  hide: function (element) {
    element.style.display = 'none';
    return this;
  },

  trim: function (val) {
    return val.trim();
  },

  getIndex: function (parent, elem) {
    var nodeList = Array.prototype.slice.call(parent.children);
    return nodeList.indexOf(elem.parentNode);
  },

  addClass: function (element, toBeAddedClass) {
    element.classList.add(toBeAddedClass);
    return this;
  },

  removeClass: function (element, toBeRemovedClass) {
    element.classList.remove(toBeRemovedClass);
    return this;
  },

  hasClass: function (element, toBeCheckedClass) {
    return (element.className && element.className.indexOf(toBeCheckedClass) > -1);
  },

  remove: function (element) {
    element.remove();
    return this;
  },

};
