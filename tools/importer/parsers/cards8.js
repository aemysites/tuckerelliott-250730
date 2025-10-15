/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards8) block header
  const headerRow = ['Cards (cards8)'];

  // Find the parent container for cards
  const cardsContainer = element.querySelector('.js-DualBanner');
  if (!cardsContainer) return;

  // Each card is a direct child div of .js-DualBanner
  const cardDivs = Array.from(cardsContainer.children);

  // Collect rows for each card
  const rows = cardDivs.map(cardDiv => {
    // Each card has an anchor
    const anchor = cardDiv.querySelector('a');
    if (!anchor) return null;

    // Image: always the first img inside the anchor
    const img = anchor.querySelector('img');

    // Text: inside a div with absolute positioning and text-white
    const textDiv = anchor.querySelector('div.text-white');
    let title = '';
    if (textDiv) {
      // Extract only the text content, not the presentational div
      title = textDiv.textContent.trim();
      // Create a heading element for semantic correctness
      const heading = document.createElement('h3');
      heading.textContent = title;
      title = heading;
    }

    // CTA: The arrow button is a span containing an img (SVG), inside a round white div
    // Find the circular CTA button (div with rounded-full and bg-white)
    const ctaButton = anchor.querySelector('div.rounded-full.bg-white');
    let ctaLink = null;
    if (ctaButton && anchor.href) {
      // Wrap the CTA button with a link using the anchor's href
      ctaLink = document.createElement('a');
      ctaLink.href = anchor.href;
      ctaLink.target = anchor.target || '_self';
      ctaLink.appendChild(ctaButton.cloneNode(true));
    }

    // First cell: image (mandatory)
    // Second cell: title (mandatory as heading) + CTA button (icon, not text link)
    const cell1 = img ? img : '';
    const cell2Content = [];
    if (title) cell2Content.push(title);
    if (ctaLink) cell2Content.push(ctaLink);

    return [cell1, cell2Content];
  }).filter(Boolean);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
