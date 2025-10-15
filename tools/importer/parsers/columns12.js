/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main content wrapper
  const mainDiv = element.querySelector(':scope > div');
  if (!mainDiv) return;

  // Find the main row of columns (the flex container)
  const flexRow = mainDiv.querySelector(':scope > div');
  if (!flexRow) return;

  // --- COLUMN 1: Logo, badges, currency, app links, copyright ---
  const col1 = flexRow.children[0];

  // --- COLUMN 2: Plan a Voyage ---
  // --- COLUMN 3: Destinations ---
  // --- COLUMN 4: Virgin Voyages ---
  let col2 = null, col3 = null, col4 = null;
  const navCol = flexRow.querySelector('nav');
  if (navCol) {
    const accs = Array.from(navCol.querySelectorAll(':scope > div.js-FooterAccordion'));
    col2 = accs[0] || '';
    col3 = accs[1] || '';
    col4 = accs[2] || '';
  }

  // --- COLUMN 5: Stay Connected ---
  let col5 = null;
  for (const d of flexRow.children) {
    if (d.textContent.trim().toLowerCase().includes('stay connected')) {
      col5 = d;
      break;
    }
  }
  if (!col5) col5 = '';

  // --- LEGAL/POLICY LINKS ROW ---
  // Find the last .js-FooterAccordion > ul inside mainDiv
  let legalLinksSection = null;
  const allAccordions = Array.from(mainDiv.querySelectorAll('.js-FooterAccordion ul'));
  for (const ul of allAccordions.reverse()) {
    if (ul.textContent.toLowerCase().includes('accessibility statement')) {
      legalLinksSection = ul;
      break;
    }
  }
  if (!legalLinksSection) {
    legalLinksSection = mainDiv.querySelector('ul:last-of-type');
  }

  // Compose table rows
  const headerRow = ['Columns (columns12)'];
  const mainRow = [col1, col2, col3, col4, col5];
  // Ensure 5 columns
  while (mainRow.length < 5) mainRow.push('');

  // Legal/policy links row (single cell spanning all columns)
  let legalRow = [];
  if (legalLinksSection) {
    legalRow = [legalLinksSection];
  }

  // Build cells array
  const cells = [headerRow, mainRow];
  if (legalRow.length) {
    cells.push(legalRow);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
