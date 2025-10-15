/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards8) block: 2 columns, multiple rows, each row = 1 card (image, text)
  const headerRow = ['Cards (cards8)']; // single column header row per guidelines
  const rows = [headerRow];

  // Find the parent container for cards
  const cardsContainer = element.querySelector('.js-DualBanner');
  if (!cardsContainer) return;

  // Each direct child div of cardsContainer is a card
  const cardDivs = Array.from(cardsContainer.children).filter(child => child.tagName === 'DIV');

  cardDivs.forEach(cardDiv => {
    // Find the anchor (whole card is a link)
    const anchor = cardDiv.querySelector('a');
    if (!anchor) return;

    // IMAGE (first column)
    // Find the main image inside the card
    const img = anchor.querySelector('img');
    let imageEl = null;
    if (img && img.src && !img.src.startsWith('data:image/svg+xml')) {
      imageEl = img;
    }

    // TEXT (second column)
    // Find the overlay text (usually in a div with absolute positioning)
    let textDiv = null;
    const absTextDivs = anchor.querySelectorAll('div');
    for (const d of absTextDivs) {
      if (d.className && d.className.includes('absolute') && d.className.includes('text-white')) {
        textDiv = d;
        break;
      }
    }
    // Fallback: if not found, use the anchor's text
    let textContent = '';
    if (textDiv) {
      textContent = textDiv.textContent.trim();
    } else {
      textContent = anchor.textContent.trim();
    }

    // Find the CTA button (the circular button with the arrow icon)
    let ctaImg = null;
    const ctaDivs = anchor.querySelectorAll('div');
    for (const d of ctaDivs) {
      if (d.className && d.className.includes('rounded-full')) {
        const arrowImg = d.querySelector('img[src^="data:image/svg+xml"]');
        if (arrowImg) {
          ctaImg = arrowImg.cloneNode(true);
          break;
        }
      }
    }

    // Compose text cell: title as heading, then CTA icon only (no invented text)
    const textCell = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = textContent;
    textCell.appendChild(title);
    if (ctaImg && anchor.href) {
      textCell.appendChild(document.createElement('br'));
      const ctaLink = document.createElement('a');
      ctaLink.href = anchor.href;
      ctaLink.setAttribute('target', anchor.target || '_self');
      ctaLink.appendChild(ctaImg);
      textCell.appendChild(ctaLink);
    }

    // Add row: [image, textCell]
    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
