/* global WebImporter */
export default function parse(element, { document }) {
  // Find the flex row container for columns
  const flexRow = element.querySelector('.flex');
  let leftCol = null, rightCol = null;
  if (flexRow) {
    // Find direct child divs (columns)
    const cols = Array.from(flexRow.children).filter(el => el.tagName === 'DIV');
    if (cols.length >= 2) {
      [leftCol, rightCol] = cols;
    }
  }

  // --- LEFT COLUMN ---
  let leftContent = leftCol;
  if (leftCol) {
    // Find the deepest content container
    const deep = leftCol.querySelector('div > div');
    if (deep) leftContent = deep;
  }

  // Extract left column elements
  const leftColElements = [];
  if (leftContent) {
    // Section label (small heading)
    const sectionLabel = leftContent.querySelector('.uppercase, [class*=uppercase]');
    if (sectionLabel) leftColElements.push(sectionLabel);
    // Main heading
    const mainHeading = leftContent.querySelector('h2');
    if (mainHeading) leftColElements.push(mainHeading);
    // Subheading (first p)
    const ps = leftContent.querySelectorAll('p');
    if (ps.length > 0) leftColElements.push(ps[0]);
    if (ps.length > 1) leftColElements.push(ps[1]);
    // CTA button
    const cta = leftContent.querySelector('a');
    if (cta) leftColElements.push(cta);
  }

  // --- RIGHT COLUMN ---
  let rightColElements = [];
  if (rightCol) {
    // Find all images (including nested)
    rightColElements = Array.from(rightCol.querySelectorAll('img'));
  }

  // --- TABLE BUILD ---
  const headerRow = ['Columns (columns24)'];
  const contentRow = [leftColElements, rightColElements];
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
