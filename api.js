/*
*
*   API.js -- Simple JS file to interact with the bookmark API.
*
*/

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/ThomasDavis';

const bookmarkApiFetch = function(...args) {
  let error = false;
  return fetch(...args)
    .then(response => {
      //Check if we get an error
      if (!response.ok) {
        error = { code: response.status };
      }

      return response.json();
    })
    .then(data => {
      //if we had an error, reject our Promise with our error
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      //No errors?  Send the data back correctly!
      return data;
    });
};

const getBookmarks = function() {
  return bookmarkApiFetch(`${BASE_URL}/bookmarks`);
};

const createBookmark = function(bookmark) {
  let newBookmark = JSON.stringify(bookmark);
  return bookmarkApiFetch(`${BASE_URL}/bookmarks`,
    { method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: newBookmark});
};

const updateBookmark = function(id, updateData) {
  let newData = JSON.stringify(updateData);
  return bookmarkApiFetch(`${BASE_URL}/bookmarks/${id}`,
    {method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: newData
    });
};

const deleteBookmark = function(id) {
  return bookmarkApiFetch(`${BASE_URL}/bookmarks/${id}`,
    {method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    });
};

export default {
  bookmarkApiFetch,
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};

