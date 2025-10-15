/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter((el) => el.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Columns (columns6)'];

  // 2. Find main container (less specific selector)
  const mainContainer = element.querySelector('div[class*="max-w-"]');
  let flexRow = mainContainer && mainContainer.querySelector('div.flex');

  let col1 = null, col2 = null, col3 = null, col4 = null, col5 = null;

  if (flexRow) {
    // Get all direct child divs of the flex row
    const flexCols = getDirectChildren(flexRow, 'div');
    // Column 1: logo, awards, currency, app, copyright
    col1 = flexCols[0];
    // Column 2: Plan a Voyage
    // Column 3: Destinations
    // Column 4: Virgin Voyages
    // Column 5: Stay Connected (newsletter, social icons)
    const nav = flexRow.querySelector('nav.js-FooterItems');
    if (nav) {
      const navAccordions = nav.querySelectorAll('.js-FooterAccordion');
      col2 = navAccordions[0];
      col3 = navAccordions[1];
      col4 = navAccordions[2];
    }
    // For col5, find the div with heading containing 'Stay connected'
    // Only use the div that contains the 'Stay connected' heading
    col5 = Array.from(flexCols).find(div => {
      const heading = div.querySelector('p');
      return heading && /Stay connected/i.test(heading.textContent);
    });
    // If not found, do not fallback to the last flexCol (prevents empty column)
  }

  // Defensive fallback: If any column is missing, create a placeholder
  function safeCol(col) {
    return col || document.createElement('div');
  }

  // 3. Bottom row: The horizontal policy links
  let bottomLinks = null;
  if (mainContainer) {
    const bottomAccordions = mainContainer.querySelectorAll('.js-FooterAccordion');
    if (bottomAccordions.length) {
      const lastAccordion = bottomAccordions[bottomAccordions.length - 1];
      const ul = lastAccordion.querySelector('ul');
      if (ul) {
        bottomLinks = ul;
      }
    }
  }

  // 4. Build the columns row (5 columns)
  // Only include columns that are not empty
  const columnsRow = [safeCol(col1), safeCol(col2), safeCol(col3), safeCol(col4)];
  if (col5) columnsRow.push(col5);

  // 5. Build the bottom row (policy links, full width)
  let bottomRow = [];
  if (bottomLinks) {
    bottomRow = [bottomLinks];
  }

  // 6. Compose the table
  const rows = [headerRow, columnsRow];
  if (bottomRow.length) rows.push(bottomRow);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
