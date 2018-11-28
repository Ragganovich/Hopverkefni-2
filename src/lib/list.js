import { empty } from './helpers.js'; /* eslint-disable-line*/

export default class List {
  constructor(lectureData) {
    this.container = document.querySelector('.list');
    this.lectures = lectureData.lectures;
  }

  load(filterHTML, filterCSS, filterJS) {
    empty(this.container);
    this.fillList(filterHTML, filterCSS, filterJS)
  }

  fill(type) {
    for (let i = 0; i < this.lectures.length; i += 1) {
      if (this.lectures[i].category === type) {
        const list = document.querySelector('.list');
        // búa til nýtt li element fyrir listann
        const node = document.createElement('DIV');
        node.className = 'thumbnail';
        node.id = this.lectures[i].slug;

        // setja thumbnail fyrirlestursins sem bakgrunnsmynd
        const thumbImg = this.lectures[i].thumbnail;
        if (thumbImg) {
          const imgUrl = `${thumbImg}`;
          const image = document.createElement('IMG');
          image.src = imgUrl;
          image.className = 'thumbnail__image';
          node.appendChild(image);
        }

        // búa til undir(yfir)titil
        const subtitle = document.createElement('H2');
        subtitle.className = 'thumbnail__subtitle';
        const subText = document.createTextNode(this.lectures[i].category);
        subtitle.appendChild(subText);

        // búa til titil
        const title = document.createElement('H1');
        title.className = 'thumbnail__title';
        const titleText = document.createTextNode(this.lectures[i].title);
        title.appendChild(titleText);

        // bæta titlum inn
        node.appendChild(subtitle);
        node.appendChild(title);
        list.appendChild(node);
      }
    }
  }

  fillList(filterHTML, filterCSS, filterJS) {
    if (!filterHTML && !filterCSS && !filterJS) {
      this.fill('html');
      this.fill('css');
      this.fill('javascript');
      return;
    }
    if (filterHTML) {
      this.fill('html');
    }
    if (filterCSS) {
      this.fill('css');
    }
    if (filterJS) {
      this.fill('javascript');
    }
  }

  // Setja upp event listeners fyrir thumbnails fyrir fyrirlestra
  initEventListeners() {
    this.container.children().addEventListener('click', () => {

    });
  }
}
