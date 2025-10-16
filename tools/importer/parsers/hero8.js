/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero8)'];

  // 2. Background image row
  let bgImgRow = [];
  const heroSlide = element.querySelector('.js-HeroSlide');
  let bgImg = null;
  if (heroSlide) {
    const multimedia = heroSlide.querySelector('.Multimedia');
    if (multimedia) {
      const picture = multimedia.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          bgImg = img;
        }
      }
    }
  }
  bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row: headline and all promo text from promo image alt
  let contentRow = [];
  const contentElements = [];
  if (heroSlide) {
    // Headline
    const heading = heroSlide.querySelector('h1');
    if (heading) contentElements.push(heading);

    // Promo image alt text (contains all promo text)
    const promoPic = heroSlide.querySelector('.ContentAlignmentCol picture img');
    if (promoPic && promoPic.alt && promoPic.alt.trim()) {
      // Try to extract all promo lines from alt text using common delimiters
      // If the alt text contains multiple lines, split and add each as a div
      // If not, just add the alt text
      let lines = promoPic.alt.split(/\n|\r|\u2022|\||\.|\-/).map(l => l.trim()).filter(Boolean);
      if (lines.length > 1) {
        lines.forEach(line => {
          const div = document.createElement('div');
          div.textContent = line;
          contentElements.push(div);
        });
      } else {
        const div = document.createElement('div');
        div.textContent = promoPic.alt.trim();
        contentElements.push(div);
      }
    }
  }
  contentRow = [contentElements.length ? contentElements : ''];

  // Compose table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
