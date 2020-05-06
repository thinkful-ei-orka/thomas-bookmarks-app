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
        <div class='bookmark-examine-box'>
            <p class='bookmark-desc'>${bookmark.desc}</p>
            <div class='button-container'>
                <a href="${bookmark.url}" class='js-bookmark-visit button'>Visit</a>
                <button class='js-bookmark-edit'>Edit</button>
                <button class='js-bookmark-delete'>Delete</button>
            </div>
        </div>
      `;
  }

  return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-bar">
            <h3 class="bookmark-bar-title">${bookmark.title}</h3>
            <div class="bookmark-bar-rating">
                <div class="bookmark-bar-fill" style="width: ${bookmark.rating * 20}%"></div>
                <h4 class="bookmark-rating-title">Rating: ${bookmark.rating}</h4>
            </div>
        </div>
        ${bookmarkExamine}
    </li>`;
};

const generateBookmarkForm = function (bookmarks) {
  let filter = generateRatingsMenu(store.ratingsFilter);
  let list = '';
  let error = store.getErrorMessage();
  if (bookmarks) {
    list = bookmarks;
  }

  return `
    ${error}
    <fieldset>
        <legend>lilac</legend>
        <div class="bookmark-bar bookmark-top-bar">
            <button class="js-bookmark-new">Add a Bookmark</button>
            <div class="filter-bar">
                <label for="filterList">Minimum Rating: </label>
                <select id="filterList">
                    ${filter}
                </select>
            </div>
        </div>
        <div class="bookmark-container" id="js-bookmark-list">
            ${list}
        </div>
    </fieldset>
  `;
};

const generateRatingsMenu = function (rating) {
  let ratingHtml = '';
  let ratingNumber = parseInt(rating);
  for (let i = 1; i < 6; i++) {
    if (ratingNumber === i) {
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
  let bookmarkLegend = 'Add a Bookmark';
  let bookmarkEdit = '<button type="submit" class="js-bookmark-add">Submit</button>';
  let bookmarkForm = 'js-bookmark-add-form';
  let error = store.getErrorMessage();

  if (store.objectEdit) {
    bookmarkTitle = store.objectEdit.title;
    bookmarkUrl = store.objectEdit.url;
    bookmarkDesc = store.objectEdit.desc;
    bookmarkRating = store.objectEdit.rating;
    bookmarkLegend = 'Edit a Bookmark';
    bookmarkEdit = '<button type="submit" class="js-bookmark-edit-submit">Submit</button>';
    bookmarkForm = 'js-bookmark-edit-form';
  }

  let ratingHtml = generateRatingsMenu(bookmarkRating);


  return `
        ${error}
        <form class="${bookmarkForm}">
        <fieldset>
        <legend>${bookmarkLegend}</legend>
            <div class="bookmark-name-box">
            <label for="name">Name:</label>
            <input required type="text" name="name" id="bookmark-name" value="${bookmarkTitle}"></input>
            </div>

            <div class="bookmark-url-box">
            <label for="url">URL:</label>
            <input required type="url" name="url" id="bookmark-url" value="${bookmarkUrl}"></input>
            </div>
            
            <label>Rating: </label>
            <select id="bookmark-rating">
                ${ratingHtml}
            </select>

            <div class="bookmark-desc-box">
            <label for="desc">Bookmark Description: </label>
            <textarea required rows="10" name="desc" id="bookmark-desc-entry">${bookmarkDesc}</textarea>
            </div>

            <div class="button-container">
                ${bookmarkEdit}
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
    htmlString = generateBookmarkString(bookmarkList);
    htmlString = generateBookmarkForm(htmlString);
  }

  // insert that HTML into the DOM
  $('#js-bookmark-form').html(htmlString);
};

const handleNewBookmarkSubmit = function () {
  $('#js-bookmark-form').on('submit', '.js-bookmark-add-form', function (event) {
    event.preventDefault();
    let newBookmark = getBookmarkFromElements();

    api.createBookmark(newBookmark)
      .then(bookmarkData => {
        store.addBookmark(bookmarkData);
        store.clearErrorMessage();
        store.toggleEdit();
        render();
      })
      .catch(error => {
        store.setErrorMessage(error.message);
        render();
      });
    
  });
};



const handleEditBookmarkSubmit = function () {
  $('#js-bookmark-form').on('submit','.js-bookmark-edit-form', function (event) {
    event.preventDefault();
    let editBookmark = getBookmarkFromElements();

    api.updateBookmark(store.objectEdit.id, editBookmark)
      .then(bookmarkData => {
        store.findAndUpdate(store.objectEdit.id, editBookmark);
        store.clearErrorMessage();
        store.toggleEdit();
        render();            
      })
      .catch(error => {
        store.setErrorMessage(error.message);
        render();
      });
  });
};


const getBookmarkFromElements = function () {
  const newBookmarkName = $('#bookmark-name').val();
  const newBookmarkUrl = $('#bookmark-url').val();
  const newBookmarkDesc = $('#bookmark-desc-entry').val();
  const newBookmarkRating = $('#bookmark-rating').val();

  let newBookmark = {
    title: newBookmarkName,
    url: newBookmarkUrl,
    desc: newBookmarkDesc,
    rating: newBookmarkRating
  };

  return newBookmark;
};

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleDeleteBookmark = function () {
  $('#js-bookmark-form').on('click', '.js-bookmark-delete', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    api.deleteBookmark(id)
      .then(data => {
        store.clearErrorMessage();
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        store.setErrorMessage(error.message);
        render();
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
    delete store.objectEdit;
    store.toggleEdit();
    render();
  });
};

const handleNewBookmarkCancelClicked = function () {
  $('#js-bookmark-form').on('click', '.js-bookmark-cancel', event => {
    event.preventDefault();
    store.clearErrorMessage();
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
  handleEditBookmarkSubmit();
};

export default {
  render,
  bindEventListeners
};