/*
*
*   Store.js -- Store to handle our source of truth with this app.
*       All bookmarks contain:
*           id: unique identifier
*           title: bookmarks's title
*           url: url of the bookmark
*           desc: description of the bookmark
*           rating: 1-5 rating on the bookmark
*
*/

const bookmarks = [];
let editFlag = false;
let ratingsFilter = 1;
let objectEdit = {};
let examineId = undefined;
let errorMessage = '';

const findById = function (id) {
  return this.bookmarks.find(bookmark => bookmark.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const toggleEdit = function () {
  this.editFlag = !this.editFlag;
};

const findAndUpdate = function (id, newData) {
  let bookmark = this.findById(id);
  Object.assign(bookmark, newData);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
};

const clearErrorMessage = function () {
  this.errorMessage = '';
};

const setErrorMessage = function (message) {
  this.errorMessage = message;
};

const getErrorMessage = function () {
  if (this.errorMessage) {
    return `<div id="js-error-message">${this.errorMessage}</div>`;
  }
  return '';
};

export default {
  bookmarks,
  ratingsFilter,
  objectEdit,
  examineId,
  toggleEdit,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  clearErrorMessage,
  setErrorMessage,
  getErrorMessage
};