/* global WebImporter */
export default function parse(element, { document }) {
  const cardsContainer = element.querySelector('.js-RegionCards');
  if (!cardsContainer) return;

  const cardItems = Array.from(cardsContainer.querySelectorAll('.js-RegionCardsItem'));
  if (!cardItems.length) return;

  const rows = [];
  rows.push(['Cards (cards10)']);

  cardItems.forEach(cardItem => {
    const cardLink = cardItem.querySelector('a.js-CardLink');
    if (!cardLink) return;

    // Image: first img inside the link
    const img = cardLink.querySelector('img');
    // Get the href for CTA
    const href = cardLink.getAttribute('href');

    // Text: h2 (title) and p (description) inside the overlay div
    const overlay = cardLink.querySelector('div.absolute');
    let title = overlay ? overlay.querySelector('h2') : null;
    let desc = overlay ? overlay.querySelector('p') : null;
    // Arrow icon (SVG image)
    let arrowIcon = overlay ? overlay.querySelector('img[src^="data:image/svg+xml"]') : null;

    // Compose text cell: title, desc, arrow icon (not wrapped in link)
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);
    if (arrowIcon) textCell.appendChild(arrowIcon.cloneNode(true));

    rows.push([
      img,
      textCell
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
