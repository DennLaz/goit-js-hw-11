import axios from 'axios';

export class PixabeyApi {
  #ROOT_URL = 'https://pixabay.com/api/';
  #API_KEY = '27863220-3ac241b372460d79544818f8f';

  constructor() {
    this.page = 1;
    this.perPage = 40;
  }

  searchImage(request) {
    return axios.get(`${this.#ROOT_URL}`, {
      params: {
        key: `${this.#API_KEY}`,
        q: `${request}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.perPage,
        page: this.page,
      },
    });
  }
}
