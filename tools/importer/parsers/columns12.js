/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns12)'];

  // Find the main container using a less specific selector
  // The main container is the first div with class containing 'max-w['
  const mainContainer = element.querySelector('div[class*="max-w["]');
  if (!mainContainer) return;

  // Find the main flex row for columns (look for a div with 'flex' and 'flex-col')
  let mainFlex = null;
  const flexCandidates = mainContainer.querySelectorAll('div');
  for (const div of flexCandidates) {
    if (div.className && div.className.includes('flex') && div.className.includes('flex-col')) {
      // Heuristic: must have at least 2 children divs
      const divChildren = Array.from(div.children).filter(c => c.tagName === 'DIV');
      if (divChildren.length >= 3) {
        mainFlex = div;
        break;
      }
    }
  }
  if (!mainFlex) return;

  // Get the three main columns
  const mainColumns = Array.from(mainFlex.children).filter(child => child.tagName === 'DIV');
  if (mainColumns.length < 3) return;

  // Column 1: Branding, awards, currency, app links, copyright
  const brandingCol = mainColumns[0];
  // Column 2: Navigation columns (Plan a Voyage, Destinations, Virgin Voyages)
  const navCol = mainColumns[1];
  // Column 3: Newsletter, social, etc
  const newsletterCol = mainColumns[2];

  // Wrap each column's content in a <div> for the cell
  const brandingDiv = document.createElement('div');
  Array.from(brandingCol.childNodes).forEach((n) => brandingDiv.appendChild(n.cloneNode(true)));

  const navDiv = document.createElement('div');
  Array.from(navCol.childNodes).forEach((n) => navDiv.appendChild(n.cloneNode(true)));

  const newsletterDiv = document.createElement('div');
  Array.from(newsletterCol.childNodes).forEach((n) => newsletterDiv.appendChild(n.cloneNode(true)));

  // Bottom row: Policy/legal links (outside the main columns)
  // Find the last .js-FooterAccordion with a border-top
  let policyRow = null;
  const accordionDivs = element.querySelectorAll('.js-FooterAccordion');
  for (const div of accordionDivs) {
    if (div.className && div.className.includes('border-t-')) {
      policyRow = div;
    }
  }
  let policyDiv = null;
  if (policyRow) {
    policyDiv = document.createElement('div');
    const ul = policyRow.querySelector('ul');
    if (ul) policyDiv.appendChild(ul.cloneNode(true));
  }

  // Build the table rows
  const contentRow = [brandingDiv, navDiv, newsletterDiv];
  const rows = [headerRow, contentRow];
  if (policyDiv) {
    rows.push([policyDiv, '', '']);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  if (table) element.replaceWith(table);
}
