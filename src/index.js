import List from './lib/list.js'; /* eslint-disable-line*/
import { empty } from './lib/helpers.js'; /*eslint-disable-line*/

// Breytur sem halda utan um stöðu sía, true þýðir að sýna eigi breyturnar
let filterHTML = true;
let filterCSS = true;
let filterJS = true;

// Breyta sem heldur utan um json upplýsingar, er annað hvort allt lecture json fylki
// eða bara einn fyrirlestur, eftir því hvort við erum á index.html eða fyrirlestur.html
let lectureData;

// Listener sem notaður verður til að bregaðst við þegar fyrirlestur er valinn
function thumbnailListener(evt) {
  const lecture = evt.currentTarget.id;
  const { lectures } = lectureData;
  for (let i = 0; i < lectures.length; i += 1) {
    if (lectures[i].slug === lecture) {
      localStorage.setItem('lecture', JSON.stringify(lectures[i]));
      break;
    }
  }
  document.location.href = `fyrirlestur.html?slug=${lecture}`;
}

// Náð í JSON fyrir fyrirlestra og það parse-að
function loadJSON(callback) {
  const r = new XMLHttpRequest();
  r.overrideMimeType('application/json');
  r.open('GET', './lectures.json', true);

  r.onreadystatechange = () => {
    if (r.readyState === 4 && r.status === 200) {
      callback(r.responseText);
    }
  };
  r.send(null);
}
if (document.querySelector('.front-page')) {
  loadJSON((response) => {
    const jsonResponse = JSON.parse(response);
    lectureData = jsonResponse;
    const list = new List(lectureData);
    list.load(filterHTML, filterCSS, filterJS);
    list.initEventListeners(thumbnailListener);
  });
}

// Ef um fyrirlestrarsíðu er að ræða setur þetta upp síðuna, annars bara mynd í header
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  const header = page.querySelector('.header');

  if (isLecturePage) {
    lectureData = JSON.parse(localStorage.getItem('lecture'));
    if (lectureData.image) {
      // Mynd í haus sett upp
      header.style.backgroundImage = `url(${lectureData.image})`;
    }
    // Titill og undir(yfir)titill settir upp
    const subtitle = document.createTextNode(lectureData.category);
    const title = document.createTextNode(lectureData.title);
    header.querySelector('.header__subtitle').appendChild(subtitle);
    header.querySelector('.header__title').appendChild(title);

    // Ef fyrirlestur er kláraður, breyta útliti á takka í footer
    let finished = localStorage.getItem('finished');
    if (finished) {
      finished = JSON.parse(finished);
      if (finished[lectureData.slug]) {
        const footButton = document.querySelector('.footer__finish');
        footButton.textContent = '';
        const span = document.createElement('SPAN');
        const finishedText = document.createTextNode('\u2713 Kláraður fyrirlestur');
        span.appendChild(finishedText);
        footButton.appendChild(span);
      }
    }

    // Efni fyrirlesturs sett upp
    const contentSpace = document.querySelector('.lecture__content');
    const { content } = lectureData;
    for (let i = 0; i < content.length; i += 1) {
      if (content[i].type === 'youtube') {
        // Myndband sett upp
        const node = document.createElement('DIV');
        node.className = 'video';
        const padDiv = document.createElement('DIV');
        padDiv.className = 'video__padding';
        const video = document.createElement('IFRAME');
        video.className = 'video__embed';
        video.src = content[i].data;
        video.frameBorder = 0;
        padDiv.appendChild(video);
        node.appendChild(padDiv);
        contentSpace.appendChild(node);
      } else if (content[i].type === 'text') {
        // Texti settur upp
        const strings = content[i].data.split('\n');
        for (let j = 0; j < strings.length; j += 1) {
          const node = document.createElement('P');
          node.className = 'text';
          const textNode = document.createTextNode(strings[j]);
          node.appendChild(textNode);
          contentSpace.appendChild(node);
        }
      } else if (content[i].type === 'quote') {
        // Tilvitnun sett upp
        const node = document.createElement('DIV');
        node.className = 'quote';
        const blockQuote = document.createElement('BLOCKQUOTE');
        blockQuote.className = 'quote__text';
        const quoteText = document.createTextNode(content[i].data);
        blockQuote.appendChild(quoteText);
        node.appendChild(blockQuote);
        // Gáð hvort citation er til staðar og sett upp ef svo er
        if (content[i].attribute) {
          const cite = document.createElement('CITE');
          cite.className = 'quote__cite';
          const citeText = document.createTextNode(content[i].attribute);
          cite.appendChild(citeText);
          node.appendChild(cite);
        }
        contentSpace.appendChild(node);
      } else if (content[i].type === 'image') {
        // Mynd sett upp
        const node = document.createElement('FIGURE');
        node.className = 'figure';
        const image = document.createElement('IMG');
        image.className = 'figure__image';
        image.src = content[i].data;
        node.appendChild(image);
        // Gáð hvort myndatexti sé til staðar og settur upp ef er
        if (content[i].caption) {
          const caption = document.createElement('FIGCAPTION');
          caption.className = 'figure__caption';
          caption.textContent = content[i].caption;
          node.appendChild(caption);
        }
        contentSpace.appendChild(node);
      } else if (content[i].type === 'heading') {
        // Fyrirsögn sett upp
        const node = document.createElement('H2');
        node.className = 'heading';
        const headingText = document.createTextNode(content[i].data);
        node.appendChild(headingText);
        contentSpace.appendChild(node);
      } else if (content[i].type === 'list') {
        // Listi settur upp
        const node = document.createElement('UL');
        node.className = 'ul';
        for (let j = 0; j < content[i].data.length; j += 1) {
          const listItem = document.createElement('LI');
          listItem.className = 'ul__li';
          const itemText = document.createTextNode(content[i].data[j]);
          listItem.appendChild(itemText);
          node.appendChild(listItem);
        }
        contentSpace.appendChild(node);
      } else if (content[i].type === 'code') {
        // Kóði settur upp
        const node = document.createElement('PRE');
        node.className = 'code';
        const code = document.createElement('CODE');
        code.className = 'code__text';
        const codeText = document.createTextNode(content[i].data);
        code.appendChild(codeText);
        node.appendChild(code);
        contentSpace.appendChild(node);
      }
    }
  } else {
    header.style.backgroundImage = 'url(img/header.jpg)';
  }
});

// Event listeners fyrir síurnar þrjár settar inn ef þær eru til staðar
if (document.querySelector('#filter-html')) {
  document.querySelector('#filter-html').addEventListener('click', () => {
    filterHTML = !filterHTML;
    const list = new List(lectureData);
    list.load(filterHTML, filterCSS, filterJS);
    list.initEventListeners(thumbnailListener);
  });
}

if (document.querySelector('#filter-css')) {
  document.querySelector('#filter-css').addEventListener('click', () => {
    filterCSS = !filterCSS;
    const list = new List(lectureData);
    list.load(filterHTML, filterCSS, filterJS);
    list.initEventListeners(thumbnailListener);
  });
}

if (document.querySelector('#filter-js')) {
  document.querySelector('#filter-js').addEventListener('click', () => {
    filterJS = !filterJS;
    const list = new List(lectureData);
    list.load(filterHTML, filterCSS, filterJS);
    list.initEventListeners(thumbnailListener);
  });
}

// event listener fyrir "klára fyrirlestur" takka ef við erum á fyrirlestur.html síðunni

if (document.querySelector('.lecture-page')) {
  document.querySelector('.footer__finish').addEventListener('click', () => {
    // Gáð hvort upplýsingar um kláraða fyrirlestra séu til í storage
    if (localStorage.getItem('finished')) {
      // Ef svo er eru upplýsingar uppfærðar og geymdar aftur
      const finished = JSON.parse(localStorage.getItem('finished'));
      if (finished[lectureData.slug]) {
        finished[lectureData.slug] = false;
        // Breyta takka til að sýna að fyrirlestur er ekki búinn
        const footButton = document.querySelector('.footer__finish');
        empty(footButton);
        footButton.textContent = 'Klára fyrirlestur';
      } else {
        finished[lectureData.slug] = true;
        // Breyta takka til að sýna að fyrirlestur er búinn
        const footButton = document.querySelector('.footer__finish');
        footButton.textContent = '';
        const span = document.createElement('SPAN');
        span.className = 'span';
        const finishedText = document.createTextNode('\u2713 Kláraður fyrirlestur');
        span.appendChild(finishedText);
        footButton.appendChild(span);
      }
      localStorage.setItem('finished', JSON.stringify(finished));
    } else {
      // Ef ekki þá eru hlutur undir upplýsingarnar búnar til og hann geymdur á formi strengs
      const finished = {};
      finished[lectureData.slug] = true;
      localStorage.setItem('finished', JSON.stringify(finished));
      // Breyta takka til að sýna að fyrirlestur er búinn
      const footButton = document.querySelector('.footer__finish');
      footButton.textContent = '';
      const span = document.createElement('SPAN');
      const finishedText = document.createTextNode('\u2713 Kláraður fyrirlestur');
      span.appendChild(finishedText);
      footButton.appendChild(span);
    }
  });
}
