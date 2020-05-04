import api from './api';
import bookmarkList from './bookmarkList';
import store from './store';


const main = function () {
  api.getItems()
    .then(res => res.json())
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addItem(bookmark));
      bookmarkList.render();
    });
  
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};

$(main);