const debounce = require('lodash.debounce');
const basicLightbox = require('basiclightbox');
import 'basiclightbox/dist/basicLightbox.min.css';
import NewsApiService from './apiService';
import template from '../template/image-card.hbs';
import { postError } from './pnotify';

const inputRef = document.querySelector('.form-control');
const containerRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load more"]');
const clearPageBtn = document.querySelector('[data-action="clear page"]');

const DELAY = 1000;
const newsApiService = new NewsApiService();

inputRef.addEventListener('input', debounce(onSearch, DELAY));
loadMoreBtn.addEventListener('click', onLoadMore);
clearPageBtn.addEventListener('click', clearPage);
clearPageBtn.addEventListener('click', clearInput);
containerRef.addEventListener('click', onLargeImage);

loadMoreBtn.classList.add('is-hidden');
clearPageBtn.classList.add('is-hidden');

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
  // const lastCard = document.querySelector('.photo-card:last-child');

  newsApiService.fetchArticles().then(renderPage).then(scrollDown);
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
}
function scrollDown() {
  // const windowCoords = document.documentElement.clientHeight;
  const lastCard = document.querySelector('.photo-card:last-child');

  window.scrollBy({
    top: lastCard.offsetTop + containerRef.clientHeight,
    // top: containerRef.scrollHeight - containerRef.clientHeight,
    // lastCard.scrollTop = lastCard.scrollHeight - lastCard.clientHeight;
    behavior: 'smooth',
  });
}

function clearPage() {
  containerRef.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  clearPageBtn.classList.add('is-hidden');
}
function clearInput() {
  inputRef.value = '';
}

function onLargeImage(event) {
  if (event.target !== event.currentTarget) {
    // console.log(event.target);
    const url = event.target.dataset.source;
    console.log(url);
    if (url) {
      const instance = basicLightbox.create(`
      <img src="${url}" width="800" height="600">
  `);
      instance.show();
    }
  }
}

// function scrollDown() {
//   const lastCard = document.querySelector('.photo-card:last-child');
//   console.log(lastCard);
//   if (lastCard) {
//     // console.log(lastCard.offsetTop);
//     // let scrollHeight = Math.max(
//     //   document.body.scrollHeight,
//     //   document.documentElement.scrollHeight,
//     //   document.body.offsetHeight,
//     //   document.documentElement.offsetHeight,
//     //   document.body.clientHeight,
//     //   document.documentElement.clientHeight,
//     // );
//     // console.log(scrollHeight);
//     window.scrollTo({
//       top: lastCard.offsetTop,
//       behavior: 'smooth',
//     });
//   }
// }
