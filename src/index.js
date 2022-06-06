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

let perPage = paxabeyApi.perPage;
let inputValue = null;

function onSubmitSearchImages(e) {
  e.preventDefault();
  inputValue = e.currentTarget.elements['searchQuery'].value;

  paxabeyApi.page = 1;

  paxabeyApi
    .searchImage(inputValue)
    .then(({ data } = {}) => {
      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (galleryEl.innerHTML !== '') {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      galleryEl.innerHTML = templateFunction(data.hits);

      if (data.hits.length >= paxabeyApi.perPage) {
        btnLoadMoreEl.classList.remove('is-hidden');
      }

      let lightbox = new SimpleLightbox('.gallery a');
    })
    .catch(error => {
      console.log(error);
    });
}

function onClickLoadMoreBtn(e) {
  paxabeyApi.page += 1;
  paxabeyApi
    .searchImage(inputValue)
    .then(({ data } = {}) => {
      perPage += data.hits.length;

      galleryEl.insertAdjacentHTML('beforeend', templateFunction(data.hits));

      if (perPage === data.totalHits) {
        btnLoadMoreEl.classList.add('is-hidden');
        return Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      let lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    })
    .catch(error => {
      console.log(error);
    });
}
