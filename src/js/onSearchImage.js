const debounce = require('lodash.debounce');
const basicLightbox = require('basiclightbox');
import NewsApiService from './apiService';
import template from '../template/image-card.hbs';
import { postError } from './pnotify';

const inputRef = document.querySelector('.form-control');
const containerRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load more"]');
const clearPageBtn = document.querySelector('[data-action="clear page"]');

const DELAY = 1000;
// let currentShowImgIndex = null;
const newsApiService = new NewsApiService();

inputRef.addEventListener('input', debounce(onSearch, DELAY));
loadMoreBtn.addEventListener('click', onLoadMore);
clearPageBtn.addEventListener('click', clearPage);
clearPageBtn.addEventListener('click', clearInput);

loadMoreBtn.classList.add('is-hidden');
clearPageBtn.classList.add('is-hidden');

// containerRef.addEventListener('click', showBigImg);

function onSearch(event) {
  event.preventDefault();

  newsApiService.query = inputRef.value;

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

  loadMoreBtn.classList.remove('is-hidden');
  clearPageBtn.classList.remove('is-hidden');

  // console.log(hits[0].largeImageURL);

  if (hits.length === 0) {
    clearInput();
    clearPage();
    containerRef.innerHTML = '';
    console.log('catch');
    return postError('Некорректный запрос!');
  }

  // const largeImageUrl = hits.map((item, index) => {
  //   console.log(item, index);
  //   return item, index;
  // });
}

// function scrollDown() {
//   var windowCoords = document.documentElement.clientHeight;
//   (function scroll() {
//     if (window.pageYOffset < windowCoords) {
//       window.scrollBy(0, 20);
//       setTimeout(scroll, 0);
//     }
//     if (window.pageYOffset > windowCoords) {
//       window.scrollTo(0, windowCoords);
//     }
//   })();
// }

function clearPage() {
  containerRef.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  clearPageBtn.classList.add('is-hidden');
}
function clearInput() {
  inputRef.value = '';
}
// function onLargeImage(url) {
//   const instance = basicLightbox.create(`
//     <img src="${url}" width="800" height="600">
//     `);
//   instance.show();
// }

// function showBigImg(evt) {
//   if (evt.target !== evt.currentTarget) {
//     console.log('hello');
//   }
// }
