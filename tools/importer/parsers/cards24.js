/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards24)'];

  // Find all card links (immediate children)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a.utility-link-content-block'));

  // Build the table rows for each card
  const rows = cardLinks.map((card) => {
    // First cell: the image in the .utility-aspect-2x3 container
    let image = null;
    const imageDiv = card.querySelector(':scope > div.utility-aspect-2x3');
    if (imageDiv) {
      image = imageDiv.querySelector('img');
    }
    // Second cell: text content (tag/date + heading)
    const textContent = [];
    // Tag+date line
    const tagDateDiv = card.querySelector(':scope > div.flex-horizontal');
    if (tagDateDiv) {
      textContent.push(tagDateDiv);
    }
    // Heading
    const heading = card.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
    if (heading) {
      textContent.push(heading);
    }
    return [image, textContent];
  });
  
  // Compose table data
  const tableData = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace the original element
  element.replaceWith(block);
}
