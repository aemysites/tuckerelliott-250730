/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  const cardsContainer = element.querySelector('.js-RegionCards');
  if (!cardsContainer) return;

  const cardItems = cardsContainer.querySelectorAll('.js-RegionCardsItem');

  cardItems.forEach((cardItem) => {
    const cardLink = cardItem.querySelector('a.js-CardLink');
    if (!cardLink) return;

    // Compose card image (first column)
    const cardImg = cardLink.querySelector('img');
    let imageCell = cardImg ? cardImg.cloneNode(true) : '';

    // Compose text content (title, description, arrow icon)
    const textOverlay = cardLink.querySelector('div.absolute.z-2');
    const textCell = document.createElement('div');
    if (textOverlay) {
      const title = textOverlay.querySelector('h2');
      if (title) textCell.appendChild(title.cloneNode(true));
      const desc = textOverlay.querySelector('p');
      if (desc) textCell.appendChild(desc.cloneNode(true));
      // Arrow icon (always present, last image in overlay)
      const arrowIcon = textOverlay.querySelector('div[aria-hidden="true"] img');
      if (arrowIcon) textCell.appendChild(arrowIcon.cloneNode(true));
    }
    // Wrap text cell with link
    if (cardLink.href) {
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.setAttribute('target', cardLink.target || '_self');
      if (cardLink.getAttribute('aria-label')) {
        link.setAttribute('aria-label', cardLink.getAttribute('aria-label'));
      }
      link.appendChild(textCell);
      rows.push([imageCell, link]);
    } else {
      rows.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
