/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns2)'];

  // Find the form that contains the columns content
  const form = element.querySelector('form');
  if (!form) return;

  // Find the main row with the three columns
  const mainRow = form.querySelector('div.bg-white');
  if (!mainRow) return;

  // The first two columns are inside a flex container
  const columnsContainer = mainRow.querySelector('div.flex');
  if (!columnsContainer) return;
  const columnDivs = columnsContainer.querySelectorAll(':scope > div');

  // Column 1: Regions selector
  let col1 = '';
  if (columnDivs.length > 0) {
    const btn1 = columnDivs[0].querySelector('button');
    if (btn1) {
      // Label: find the span with 'Regions'
      let label = '';
      let value = '';
      const labelSpan = btn1.querySelector('span.font-common.text-13');
      if (labelSpan) label = labelSpan.textContent.trim();
      const strong = btn1.querySelector('strong');
      if (strong) value = strong.textContent.trim();
      // Compose cell with label, value, and arrow
      col1 = document.createElement('div');
      if (label) {
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        col1.appendChild(labelEl);
        col1.appendChild(document.createElement('br'));
      }
      if (value) {
        const valueEl = document.createElement('strong');
        valueEl.textContent = value;
        col1.appendChild(valueEl);
      }
      // Add arrow icon
      const arrowEl = document.createElement('span');
      arrowEl.textContent = ' \u25BC';
      col1.appendChild(arrowEl);
    }
  }

  // Column 2: Travel Dates selector
  let col2 = '';
  if (columnDivs.length > 1) {
    const btn2 = columnDivs[1].querySelector('button');
    if (btn2) {
      let label = '';
      let value = '';
      const labelSpan = btn2.querySelector('span.font-common.text-13');
      if (labelSpan) label = labelSpan.textContent.trim();
      const strong = btn2.querySelector('strong');
      if (strong) value = strong.textContent.trim();
      // Compose cell with label, value, and arrow
      col2 = document.createElement('div');
      if (label) {
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        col2.appendChild(labelEl);
        col2.appendChild(document.createElement('br'));
      }
      if (value) {
        const valueEl = document.createElement('strong');
        valueEl.textContent = value;
        col2.appendChild(valueEl);
      }
      // Add arrow icon
      const arrowEl = document.createElement('span');
      arrowEl.textContent = ' \u25BC';
      col2.appendChild(arrowEl);
    }
  }

  // Third column: The Explore button
  let col3 = '';
  const exploreBtn = mainRow.querySelector('button[type="submit"]');
  if (exploreBtn) {
    const btnText = exploreBtn.querySelector('span.block.relative');
    let text = btnText ? btnText.textContent.trim() : exploreBtn.textContent.trim();
    col3 = document.createElement('strong');
    col3.textContent = text.toUpperCase();
  }

  // Build the cells for the columns row
  const columnsRow = [col1, col2, col3];

  // Build the table
  const cells = [
    headerRow,
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
