export function fill(type, lectureData) {
  const { lectures } = lectureData;
  for (let i = 0; i < lectures.length; i += 1) {
    if (lectures[i].category === type) {
      const list = document.querySelector('.list');
      // búa til nýtt li element fyrir listann
      const node = document.createElement('DIV');
      node.className = 'thumbnail';
      node.id = lectures[i].slug;

      // setja thumbnail fyrirlestursins sem bakgrunnsmynd
      const thumbImg = lectures[i].thumbnail;
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
      const subText = document.createTextNode(lectures[i].category);
      subtitle.appendChild(subText);

      // búa til titil
      const title = document.createElement('H1');
      title.className = 'thumbnail__title';
      const titleText = document.createTextNode(lectures[i].title);
      title.appendChild(titleText);

      // bæta titlum inn
      node.appendChild(subtitle);
      node.appendChild(title);
      list.appendChild(node);
    }
  }
}

export function fillList(lectureData, filterHTML, filterCSS, filterJS) {
  if (!filterHTML && !filterCSS && !filterJS) {
    fill('html', lectureData);
    fill('css', lectureData);
    fill('javascript', lectureData);
    return;
  }
  if (filterHTML) {
    fill('html', lectureData);
  }
  if (filterCSS) {
    fill('css', lectureData);
  }
  if (filterJS) {
    fill('javascript', lectureData);
  }
}
