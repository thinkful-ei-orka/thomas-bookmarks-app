/*
*
*   Store.js -- Store to handle our source of truth with this app.
*       All bookmarks contain:
*           id: unique identifier
*           title: bookmarks's title
*           url: url of the bookmark
*           desc: description of the bookmark
*           rating (optional): 1-5 rating on the bookmark
*
*/

const bookmarks = [];
let filterRatings = false;

const findById = function (id) {
  return this.bookmarkList.find(bookmark => bookmark.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarkList.push(bookmark);
};

const findAndUpdate = function (id, newData) {
  let bookmark = this.findById(id);
  Object.assign(bookmark, newData);
};

const findAndDelete = function (id) {
  this.bookmarkList = this.bookmarkList.filter(bookmark => bookmark.id !== id);
};

const toggleCheckedFilter = function () {
  this.filterRatings = !this.filterRatings;
};

export default {
  bookmarks,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  toggleCheckedFilter
};