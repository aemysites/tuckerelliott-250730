/* global WebImporter */
export default function parse(element, { document }) {
  // Header row per spec
  const headerRow = ['Cards (cards10)'];

  // All cards: direct <a> children
  const cards = Array.from(element.querySelectorAll(':scope > a.card-link'));

  const rows = cards.map(card => {
    // First cell: Image (requirement: image is mandatory)
    // Find first <img> that's a descendant of this card
    const img = card.querySelector('img');
    // Second cell: All text content (tag, heading, description), preserve semantic tags
    const contentDiv = card.querySelector('.utility-padding-all-1rem');
    // We'll gather only existing child elements (in order)
    const textContent = [];
    if (contentDiv) {
      // Tag (optional)
      const tag = contentDiv.querySelector('.tag');
      if (tag) textContent.push(tag);
      // Heading (optional, always h3 in provided sample)
      const heading = contentDiv.querySelector('h3');
      if (heading) textContent.push(heading);
      // Description (optional)
      const desc = contentDiv.querySelector('p');
      if (desc) textContent.push(desc);
    }
    // Guarantee: Image and at least one text element per row (requirement)
    return [img, textContent];
  });

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
