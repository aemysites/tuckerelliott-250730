/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards25)'];
  const cells = [headerRow];

  // Get all direct child divs (each possible card container)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  cardDivs.forEach((cardDiv) => {
    // Find the image (mandatory).
    const img = cardDiv.querySelector('img');
    if (!img) return; // Only process if an image is present (required for the block)

    // Find any text content (title, description, etc.)
    let textContent = null;
    // Preferably inside a .utility-padding-all-2rem wrapper, else try .utility-position-relative
    let contentBlock = cardDiv.querySelector('.utility-padding-all-2rem');
    if (!contentBlock) {
      // Some cards may not have .utility-padding-all-2rem, try .utility-position-relative
      contentBlock = cardDiv.querySelector('.utility-position-relative');
    }
    if (contentBlock) {
      textContent = contentBlock;
    } else {
      // If no text, return empty fragment
      textContent = document.createDocumentFragment();
    }

    cells.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
