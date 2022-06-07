import { PixabeyApi } from './js/searchImage';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import templateFunction from './templates/template.hbs';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onSubmitSearchImages);
btnLoadMoreEl.addEventListener('click', onClickLoadMoreBtn);

const paxabeyApi = new PixabeyApi();

let perPageSum;
let inputValue = null;
let lightbox;

async function onSubmitSearchImages(e) {
  e.preventDefault();

  inputValue = e.currentTarget.elements['searchQuery'].value;

  btnLoadMoreEl.classList.add('is-hidden');

  paxabeyApi.page = 1;

  perPageSum = paxabeyApi.perPage;

  try {
    const { data } = await paxabeyApi.searchImage(inputValue);

    if (data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (galleryEl.innerHTML !== '') {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (data.hits.length < perPageSum) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    galleryEl.innerHTML = templateFunction(data.hits);

    lightbox = new SimpleLightbox('.gallery a');

    if (data.hits.length >= paxabeyApi.perPage) {
      btnLoadMoreEl.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }

  // paxabeyApi
  //   .searchImage(inputValue)
  //   .then(({ data } = {}) => {
  // if (data.hits.length === 0) {
  //   return Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // }

  // if (galleryEl.innerHTML !== '') {
  //   Notify.success(`Hooray! We found ${data.totalHits} images.`);
  // }

  // galleryEl.innerHTML = templateFunction(data.hits);

  // lightbox = new SimpleLightbox('.gallery a');

  // if (data.hits.length >= paxabeyApi.perPage) {
  //   btnLoadMoreEl.classList.remove('is-hidden');
  // }
  // })
  //   .catch(error => {
  //     console.log(error);
  //   });
}

async function onClickLoadMoreBtn(e) {
  paxabeyApi.page += 1;
  try {
    const { data } = await paxabeyApi.searchImage(inputValue);

    perPageSum += data.hits.length;

    galleryEl.insertAdjacentHTML('beforeend', templateFunction(data.hits));

    lightbox.refresh();

    if (perPageSum >= data.totalHits) {
      btnLoadMoreEl.classList.add('is-hidden');
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    console.log(err);
  }

  // paxabeyApi
  //   .searchImage(inputValue)
  //   .then(({ data } = {}) => {
  // perPageSum += data.hits.length;

  // galleryEl.insertAdjacentHTML('beforeend', templateFunction(data.hits));

  // lightbox.refresh();

  // if (perPageSum >= data.totalHits) {
  //   btnLoadMoreEl.classList.add('is-hidden');
  //   return Notify.info(
  //     "We're sorry, but you've reached the end of search results."
  //   );
  // }
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });
}
