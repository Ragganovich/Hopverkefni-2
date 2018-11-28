import List from './lib/list.js'; /* eslint-disable-line*/
import { fillList } from './lib/fill.js'; /* eslint-disable-line*/

// Breytur sem halda utan um stöðu sía, true þýðir að sýna eigi breyturnar
let filterHTML = true;
let filterCSS = true;
let filterJS = true;

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

let lectureData;
loadJSON((response) => {
  const jsonResponse = JSON.parse(response);
  lectureData = jsonResponse;
  fillList(lectureData, filterHTML, filterCSS, filterJS);
});

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  if (isLecturePage) {

  } else {
    const list = new List();
    list.load();
  }
});

// Event listeners fyrir síurnar þrjár
document.querySelector('.filter-html').addEventListener('click', () => {
  filterHTML = !filterHTML;
  const list = new List();
  list.load();
  fillList(lectureData, filterHTML, filterCSS, filterJS);
});

document.querySelector('.filter-css').addEventListener('click', () => {
  filterCSS = !filterCSS;
  const list = new List();
  list.load();
  fillList(lectureData, filterHTML, filterCSS, filterJS);
});

document.querySelector('.filter-js').addEventListener('click', () => {
  filterJS = !filterJS;
  const list = new List();
  list.load();
  fillList(lectureData, filterHTML, filterCSS, filterJS);
});
