/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns
  const columns = element.querySelectorAll(':scope > div > div > div');
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  // Find the main content wrapper (first direct child div)
  let leftContent = leftCol.querySelector(':scope > div');
  if (!leftContent) leftContent = leftCol; // fallback for robustness

  // Gather only the meaningful content in order, omitting empty <p> and wrappers
  let leftCellContent = [];
  if (leftContent) {
    // Heading (first div)
    const heading = leftContent.querySelector('div');
    if (heading && heading.textContent.trim()) {
      leftCellContent.push(heading.cloneNode(true));
    }
    // Main headline (first h2)
    const headline = leftContent.querySelector('h2');
    if (headline) leftCellContent.push(headline.cloneNode(true));
    // Description paragraph (first non-empty p)
    const allPs = leftContent.querySelectorAll('p');
    for (const p of allPs) {
      if (p.textContent.trim().length > 0) {
        leftCellContent.push(p.cloneNode(true));
        break;
      }
    }
    // Ordered list (steps)
    const ol = leftContent.querySelector('ol');
    if (ol) leftCellContent.push(ol.cloneNode(true));
    // CTA button (first a[href] that is a button)
    const allLinks = leftContent.querySelectorAll('a[href]');
    for (const a of allLinks) {
      if (a.textContent.trim().toLowerCase().includes('book now')) {
        leftCellContent.push(a.cloneNode(true));
        break;
      }
    }
  }

  // --- RIGHT COLUMN ---
  // Find image element
  let img = columns[1].querySelector('img');
  let rightCellContent = img ? [img] : [];

  // --- TABLE CONSTRUCTION ---
  const headerRow = ['Columns (columns16)'];
  const contentRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
