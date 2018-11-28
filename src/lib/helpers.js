export function empty(element) { /* eslint-disable-line*/
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
