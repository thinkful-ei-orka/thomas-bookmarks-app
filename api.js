/*
*
*   API.js -- Simple JS file to interact with the bookmark API.
*
*/

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/ThomasDavis';

const getBookmarks = function() {
  return fetch(`${BASE_URL}/bookmarks`);
};

const createBookmark = function(bookmark) {
  let newBookmark = JSON.stringify( { bookmark } );
  return fetch(`${BASE_URL}/bookmarks`,
    {method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: newBookmark  });
};

const updateBookmark = function(id, updateData) {
  let newData = JSON.stringify(updateData);
  return fetch(`${BASE_URL}/bookmarks/${id}`,
    {method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: newData
    });
};

const deleteBookmark = function(id) {
  return fetch(`${BASE_URL}/bookmarks/${id}`,
    {method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    });
};

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};

