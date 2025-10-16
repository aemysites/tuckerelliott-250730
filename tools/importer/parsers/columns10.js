/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns10)'];

  // Get the top-level logo image (branding) if present
  const brandingImg = element.querySelector(':scope > img');

  // Find the main wrapper for the columns
  const mainDiv = element.querySelector('div');
  if (!mainDiv) return;

  // The main flex row contains two children: the left columns (logo/nav) and the right column (newsletter/social)
  const flexRow = mainDiv.querySelector('div.flex');
  if (!flexRow) return;

  // The left columns (logo/awards/currency/app/copyright + nav columns)
  const leftColumns = flexRow.querySelector('div.flex');
  const nav = flexRow.querySelector('nav');
  const rightColumn = flexRow.children[1];

  // --- Column 1: Logo, awards, currency, app, copyright ---
  let col1 = leftColumns ? leftColumns.children[0] : null;
  // Prepend branding image if present
  if (col1 && brandingImg) {
    const col1Clone = col1.cloneNode(true);
    col1Clone.insertBefore(brandingImg.cloneNode(true), col1Clone.firstChild);
    col1 = col1Clone;
  }

  // --- Column 2: Plan a Voyage ---
  const planAccordion = nav ? nav.children[0] : null;
  // --- Column 3: Destinations ---
  const destAccordion = nav ? nav.children[1] : null;
  // --- Column 4: Virgin Voyages ---
  const vvAccordion = nav ? nav.children[2] : null;
  // --- Column 5: Stay Connected (newsletter/social) ---
  // This is the rightColumn

  // --- Bottom row: Policies links ---
  let bottomLinksRow = null;
  const bottomAccordions = mainDiv.querySelectorAll('.js-FooterAccordion');
  if (bottomAccordions.length > 0) {
    bottomLinksRow = bottomAccordions[bottomAccordions.length - 1];
  }

  // Compose the columns array for the main row
  const columns = [];
  if (col1) columns.push(col1);
  if (planAccordion) columns.push(planAccordion);
  if (destAccordion) columns.push(destAccordion);
  if (vvAccordion) columns.push(vvAccordion);
  if (rightColumn) columns.push(rightColumn);

  // The main content row (5 columns)
  const mainRow = columns;

  // The bottom row: policies links (single cell spanning all columns)
  let bottomRow = [];
  if (bottomLinksRow) {
    // Create a cell with colspan = columns.length
    const td = document.createElement('td');
    td.colSpan = columns.length;
    td.appendChild(bottomLinksRow);
    bottomRow = [td];
  } else {
    // If no bottom links, create an empty spanning cell
    const td = document.createElement('td');
    td.colSpan = columns.length;
    bottomRow = [td];
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    mainRow,
    bottomRow
  ], document);

  // Final fix: Ensure bottom row is a single cell (no extra <td>s)
  const trs = table.querySelectorAll('tr');
  if (trs.length > 2) {
    const bottomTr = trs[2];
    while (bottomTr.children.length > 1) {
      bottomTr.removeChild(bottomTr.lastChild);
    }
  }

  element.replaceWith(table);
}
