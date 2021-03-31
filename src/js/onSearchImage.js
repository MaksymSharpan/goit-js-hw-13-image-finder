const debounce = require('lodash.debounce');
const basicLightbox = require('basiclightbox');
import NewsApiService from './apiService';
import template from '../template/image-card.hbs';
import { postError } from './pnotify';
// import { lightboxFunc } from './basicLightbox';

const inputRef = document.querySelector('.form-control');
const containerRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load more"]');
const clearPageBtn = document.querySelector('[data-action="clear page"]');
const DELAY = 1000;

const newsApiService = new NewsApiService();

inputRef.addEventListener('input', debounce(onSearch, DELAY));
loadMoreBtn.addEventListener('click', onLoadMore);
clearPageBtn.addEventListener('click', clearPage);

// const options = {
//   headers: {
//     Authorization: '20935726-589ec499a748a6b46fa10a9d7',
//   },
// };

function onSearch(event) {
  event.preventDefault();

  newsApiService.query = inputRef.value;
  // if (newsApiService.query === ' ') {
  //   return alert('введи что-то нормальное');
  // }
  // console.log(typeof newsApiService.query);

  newsApiService.resetPage();
  newsApiService.fetchArticles().then(hits => {
    clearPage();
    renderPage(hits);
  });
}

function onLoadMore() {
  newsApiService.fetchArticles().then(renderPage);
}

function renderPage(hits) {
  const markup = template(hits);
  containerRef.insertAdjacentHTML('beforeend', markup);
}

function clearPage() {
  containerRef.innerHTML = '';
}
