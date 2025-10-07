/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs
  const directDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Identify logo/copyright divs and nav columns
  let logoDiv = null;
  let copyrightDiv = null;
  const navDivs = [];

  for (const div of directDivs) {
    if (!logoDiv && div.querySelector('a[href*="mongodb.com"] img')) {
      logoDiv = div;
      continue;
    }
    if (!copyrightDiv && div.textContent && div.textContent.trim().match(/^©.*MongoDB/)) {
      copyrightDiv = div;
      continue;
    }
    // Only push divs that have a heading and a list (these are the nav columns)
    if (div.querySelector('p') && div.querySelector('ul')) {
      navDivs.push(div);
    }
  }

  // Compose the first column: logo + copyright
  const leftColumn = document.createElement('div');
  if (logoDiv) {
    Array.from(logoDiv.childNodes).forEach(node => leftColumn.appendChild(node.cloneNode(true)));
  }
  if (copyrightDiv) {
    leftColumn.appendChild(copyrightDiv.cloneNode(true));
  }

  // Compose nav columns: each navDiv is a column (all content)
  const navColumns = navDivs.map(div => {
    const col = document.createElement('div');
    Array.from(div.childNodes).forEach(node => col.appendChild(node.cloneNode(true)));
    return col;
  });

  // Table header
  const headerRow = ['Columns (columns6)'];
  // Table content row: one cell per column
  const contentRow = [leftColumn, ...navColumns];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
