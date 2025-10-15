/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block parsing
  const cardsArea = element.querySelector('.js-OverviewCardsArea');
  if (!cardsArea) return;

  const cardItems = Array.from(cardsArea.querySelectorAll('.js-OverviewCardsItem'));
  if (!cardItems.length) return;

  const cells = [];
  cells.push(['Cards (cards9)']);

  cardItems.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;

    const title = card.querySelector('h2');
    const desc = card.querySelector('p');
    // Find the outer link for the card
    const cardLink = card.querySelector('a.js-CardLink');
    let cta = null;
    if (cardLink) {
      // Find the CTA button inside the link
      const btn = cardLink.querySelector('button');
      if (btn) {
        // Create a link element for CTA, using button text and cardLink href
        cta = document.createElement('a');
        cta.href = cardLink.href;
        cta.textContent = btn.textContent;
        cta.setAttribute('target', cardLink.getAttribute('target') || '_self');
        cta.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Learn More');
        cta.style.color = '#d1003f';
        cta.style.textDecoration = 'underline';
      }
    }

    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);
    if (cta) textCell.appendChild(cta);

    cells.push([img, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
