/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns5)'];

  // Find the main container inside the footer
  const mainContainer = element.querySelector('div[class*="max-w-"]');
  if (!mainContainer) return;

  // Find the flex row that contains the columns
  const flexRows = Array.from(mainContainer.querySelectorAll('div[class*="flex"]'));
  // Pick the first flex row with more than 2 children
  const flexRow = flexRows.find(row => row.children.length >= 3);
  if (!flexRow) return;

  const flexChildren = Array.from(flexRow.children);
  if (flexChildren.length < 3) return;

  // Column 1: logo, awards, currency, app, copyright
  const leftCol = flexChildren[0];
  // Column 2-4: navigation accordions
  const navCols = flexChildren[1];
  // Column 5: stay connected
  const rightCol = flexChildren[2];

  // Get navigation accordions (Plan a Voyage, Destinations, Virgin Voyages)
  const navAccordions = navCols.querySelectorAll('div[class*="js-FooterAccordion"]');
  const navColCells = Array.from(navAccordions).slice(0, 3);

  // Compose the columns row
  const columnsRow = [
    leftCol,
    ...navColCells,
    rightCol,
  ];

  // Find the policy/legal links accordion (with top border)
  const policyAccordion = mainContainer.querySelector('div[class*="js-FooterAccordion"][class*="border-t-"]');

  // Build the table rows
  const rows = [
    headerRow,
    columnsRow,
  ];
  if (policyAccordion) {
    rows.push([
      policyAccordion, '', '', '', ''
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
