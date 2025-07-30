/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check that we have a container
  const container = element.querySelector('.container');
  if (!container) return;

  // There may be nested grids (left column: big card, right column: vertical stack of cards)
  // So we want all .utility-link-content-block elements in all .w-layout-grid children
  let cardElements = [];

  // Get all first-level grids
  const grids = Array.from(container.querySelectorAll(':scope > .w-layout-grid'));
  grids.forEach(grid => {
    // If this grid has direct card children, collect them
    cardElements.push(...Array.from(grid.children).filter(child => child.classList.contains('utility-link-content-block')));
    // If any children are grids, collect their card children too
    Array.from(grid.children).forEach(child => {
      if (child.classList.contains('w-layout-grid')) {
        cardElements.push(...Array.from(child.children).filter(c => c.classList.contains('utility-link-content-block')));
      }
    });
  });

  // The header row as in the example
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  cardElements.forEach(card => {
    // Extract image for the left cell
    let image = null;
    // Typically inside a div with utility-aspect-*, but can fallback to any img inside card
    const aspect = card.querySelector('[class*="utility-aspect"]');
    if (aspect) {
      image = aspect.querySelector('img');
    }
    if (!image) {
      image = card.querySelector('img');
    }

    // For right cell: heading (any h2-h6), p, button or link with .button
    let title = card.querySelector('h1, h2, h3, h4, h5, h6');
    let desc = card.querySelector('p');
    let cta = card.querySelector('.button, button, a.button');
    // Exclude CTA if it's inside the image/aspect area
    if (cta && aspect && aspect.contains(cta)) cta = null;

    // Compose content for right cell
    const textNodes = [];
    if (title) textNodes.push(title);
    if (desc) textNodes.push(desc);
    if (cta) textNodes.push(cta);
    // If nothing found (should not happen), fallback to card text
    if (!textNodes.length) {
      // Try to collect any text content
      textNodes.push(...Array.from(card.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim()));
    }
    rows.push([
      image ? image : '',
      textNodes.length === 1 ? textNodes[0] : textNodes
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
