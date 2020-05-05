import api from './api.js';
import bookmarkList from './bookmarkList.js';
import store from './store.js';


const main = function () {
  api.getBookmarks()
    .then(res => res.json())
    .then(bookmarks => {
      bookmarks.forEach(bookmark => store.addBookmark(bookmark));
      bookmarkList.render();
    });
  
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};

$(main);