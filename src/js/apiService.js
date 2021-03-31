// import { query } from 'express';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '20935726-589ec499a748a6b46fa10a9d7';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchArticles() {
    console.log('До запроса: ', this);
    return fetch(
      `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${KEY}`,
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('ERROOOOORRRRRRR');
        }
        // console.dir(response);
        return response.json();
      })
      .then(({ hits }) => {
        console.log({ hits });
        this.incrementPage();
        // console.log(this);
        return hits;
      });
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

// function fetchImages(imageSearch) {
//   return fetch(
//     `${BASE_URL}?image_type=photo&orientation=horizontal&q=${imageSearch}&page=1&per_page=12&key=${KEY}`,
//   ).then(response => {
//     if (!response.ok) {
//       throw new Error('ERROOOOORRRRRRR');
//     }
//     console.dir(response);
//     return response.json();
//   });
// }
// export default { fetchImages };
