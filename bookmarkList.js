import store from './store.js';
import api from './api.js';


/**
 * 
 * @param {*} item 
 */
const generateBookmarkElement = function (bookmark) {
  let bookmarkExamine = '';

  if (bookmark.id === store.idExamine) {
    bookmarkExamine = `
        <div class='bookmark-examine-box>
            <p class='bookmark-desc'>${bookmark.desc}</p>
            <div class='button-container'>
                <button class='js-bookmark-edit'>Edit</button>
                <button class='js-bookmark-delete'>Delete</button>
            </div>
        </div>
      `;
  }

  return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
      ${bookmark.title}
        <div class="bookmark-bar-rating">
            <h3>Rating: ${bookmark.rating}</h3>
            <div class="bookmark-bar-fill" style="width: 100%"></div>
        </div>
        ${bookmarkExamine}
    </li>`;
};

const generateBookmarkForm = function () {
  let filter = generateRatingsMenu(store.ratingsFilter);
  return `
    <span id="#js-error-message"></span>
    <form id="js-bookmark-form">
    <fieldset>
        <legend>Test</legend>
        <button class="js-bookmark-new">Add a Bookmark</button>
        <label>Minimum Rating: </label>
        <select id="filterList">
            ${filter}
        </select>
        <div class="bookmark-container" id="js-bookmark-list">
        </div>
    <fieldset>
    </form>
  `;
};

const generateRatingsMenu = function (rating) {
  let ratingHtml = '';
  for (let i = 1; i < 6; i++) {
    if (rating === i) {
      ratingHtml += `<option value="${i}" selected>${i}</option>`;
    } else {
      ratingHtml += `<option value="${i}">${i}</option>`;
    }
  }
  return ratingHtml;
};


const generateNewBookmark = function () {
  let bookmarkTitle = '';
  let bookmarkUrl = '';
  let bookmarkDesc = '';
  let bookmarkRating = 3;

  if (store.objectEdit === {}) {
    bookmarkTitle = store.objectEdit.title;
    bookmarkUrl = store.objectEdit.url;
    bookmarkDesc = store.objectEdit.desc;
    bookmarkRating = store.objectEdit.rating;
  }

  let ratingHtml = generateRatingsMenu(bookmarkRating);


  return `
        <span id="#js-error-message"></span>
        <form class="js-bookmark-form">
        <fieldset>
        <legend>Add a Bookmark</legend>
            <label for="name">Name:</label>
            <input required type="text" name="name" id="bookmark-name" value="${bookmarkTitle}"></input>
            <br/>

            <label for="url">URL:</label>
            <input required type="url" name="url" id="bookmark-url" value="${bookmarkUrl}"></input>
            <br/>
            
            <label>Rating: </label>
            <select id="bookmark-rating">
                ${ratingHtml}
            </select>
            <br/>

            <label for="desc">Bookmark Description: </label>
            <input required type="text" name="desc" id="bookmark-desc" value="${bookmarkDesc}"></input>

            <div class="button-container">
                <button type="submit" class="js-bookmark-add">Submit</button>
                <button class="js-bookmark-cancel" formnovalidate>Cancel</button>
            </div>
        </fieldset>
        </form>
  `;
};

const generateBookmarkString = function (bookmarkList) {
  const list = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return list.join('');
};

const render = function () {
  // Filter item list based upon store's rating filter
  let bookmarkList = [...store.bookmarks];
  bookmarkList = bookmarkList.filter(bookmark => bookmark.rating >= store.ratingsFilter);

  let htmlString = '';

  if (store.editFlag) {
    htmlString = generateNewBookmark();
  } else {
    htmlString = generateBookmarkForm();
    htmlString += generateBookmarkString(bookmarkList);
  }


  // insert that HTML into the DOM
  $('#js-bookmark-form').html(htmlString);
};

const handleNewBookmarkSubmit = function () {
  $('#js-bookmark-form').submit('.js-bookmark-add', function (event) {
    event.preventDefault();
    const newBookmarkName = $('#bookmark-name').val();
    const newBookmarkUrl = $('#bookmark-url').val();
    const newBookmarkDesc = $('#bookmark-desc').val();
    const newBookmarkRating = $('#bookmark-rating').val();

    let newBookmark = {
      title: newBookmarkName,
      url: newBookmarkUrl,
      desc: newBookmarkDesc,
      rating: newBookmarkRating
    };
    
    if(store.objectEdit === {}) {
      api.updateBookmark(store.objectEdit.id, newBookmark)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.json());
        })
        .then(bookmarkData => {
          store.findAndUpdate(store.objectEdit.id, newBookmark);
          store.toggleEdit();
          render();            
        })
        .catch(error => {
          $('#js-error-message').text(`Something went wrong: ${error.message}`);
        });
    } else {
      api.createBookmark(newBookmark)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.json());
        })
        .then(bookmarkData => {
          store.addBookmark(bookmarkData);
          store.toggleEdit();
          render();
        })
        .catch(error => {
          $('#js-error-message').text(`Something went wrong: ${error.message}`);
        });
    }
  });
};

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleDeleteBookmark = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  $('#js-bookmark-form').on('click', '.js-bookmark-delete', event => {
    event.preventDefault();
    // get the index of the item in store.items
    const id = getBookmarkIdFromElement(event.currentTarget);
    // delete the item
    api.deleteBookmark(id)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.json());
      })
      .then(data => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        $('#js-error-message').text(`Something went wrong: ${error.message}`);
      });
  });
};

const handleBookmarkExamineClicked = function () {
  $('#js-bookmark-form').on('click', '.js-bookmark-element', event => {
    store.idExamine = getBookmarkIdFromElement(event.currentTarget);
    render();
  });
};

const handleBookmarkEditClicked = function () {
  $('#js-bookmark-form').on('click', '.js-bookmark-edit', event => {
    store.objectEdit = store.findById(store.idExamine);
    store.toggleEdit();
  });
};

const handleNewBookmarkClicked = function () {
  $('#js-bookmark-form').on('click', '.js-bookmark-new', event => {
    store.objectEdit = {};
    store.toggleEdit();
    render();
  });
};

const handleNewBookmarkCancelClicked = function () {
  $('#js-bookmark-form').on('click', '.js-bookmark-cancel', event => {
    store.toggleEdit();
    render();
  });
};

const handleRatingFilterSelect = function () {
  $('#js-bookmark-form').on('change','#filterList', event => {
    store.ratingsFilter = $(event.currentTarget).val();
    render();
  });
};

const bindEventListeners = function () {
  handleRatingFilterSelect();
  handleBookmarkExamineClicked();
  handleNewBookmarkSubmit();
  handleDeleteBookmark();
  handleBookmarkEditClicked();
  handleNewBookmarkClicked();
  handleNewBookmarkCancelClicked();
};

export default {
  render,
  bindEventListeners
};