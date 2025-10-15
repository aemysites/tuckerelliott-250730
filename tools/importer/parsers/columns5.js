/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns5)'];

  // 2. Get children
  const children = Array.from(element.children);
  let logoImg = null;
  if (children[0]?.tagName === 'IMG') {
    logoImg = children[0].cloneNode(true);
  }
  const mainContent = children.find(child => child.tagName === 'DIV');
  if (!mainContent) return;

  // Find the flex row with columns
  let flexRow = null;
  for (const div of mainContent.querySelectorAll('div')) {
    if (
      div.classList.contains('flex') &&
      div.className.includes('s1200:flex-row') &&
      div.children.length === 3
    ) {
      flexRow = div;
      break;
    }
  }
  if (!flexRow) return;

  // Get the 3 main flex children (left, nav, right)
  const flexCols = Array.from(flexRow.children);
  const leftCol = flexCols[0];
  const navCols = flexCols[1];
  const rightCol = flexCols[2];

  // --- Column 1: Logo, awards, currency, app, copyright ---
  const col1Content = document.createElement('div');
  if (logoImg) col1Content.appendChild(logoImg);
  if (leftCol) col1Content.appendChild(leftCol.cloneNode(true));

  // --- Columns 2, 3, 4: Navigation columns ---
  let navSections = [];
  if (navCols) {
    navSections = Array.from(navCols.children).filter(child => child.classList.contains('js-FooterAccordion'));
  }
  while (navSections.length < 3) navSections.push(document.createElement('div'));

  // --- Column 5: Stay Connected ---
  let col5Content = document.createElement('div');
  if (rightCol) {
    col5Content.appendChild(rightCol.cloneNode(true));
  }

  // 3. Build the table rows
  const columnsRow = [col1Content, navSections[0].cloneNode(true), navSections[1].cloneNode(true), navSections[2].cloneNode(true), col5Content];

  // 4. The final row: legal/policy links (horizontal row at the bottom)
  let policyRowDiv = null;
  for (const acc of mainContent.querySelectorAll('.js-FooterAccordion')) {
    if (acc.className.includes('border-t-gray-2')) {
      policyRowDiv = acc;
      break;
    }
  }
  let policyLinks = [];
  if (policyRowDiv) {
    const ul = policyRowDiv.querySelector('ul');
    if (ul) {
      policyLinks = [ul.cloneNode(true)];
    }
  }
  if (policyLinks.length === 0) policyLinks = [document.createElement('div')];

  // 5. Assemble the table
  const rows = [
    headerRow,
    columnsRow,
    policyLinks
  ];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  if (element.parentNode) {
    element.replaceWith(table);
  }
}
