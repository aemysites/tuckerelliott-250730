/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns2)'];

  // Find the form that contains the columns content
  const form = element.querySelector('form');
  if (!form) return;

  // Find the main flex row for the columns
  const flexRow = form.querySelector('div.bg-white.flex');
  if (!flexRow) return;

  // Find the two dropdown columns
  const colButtons = flexRow.querySelectorAll('button');
  if (colButtons.length < 2) return;

  // Column 1: Regions (label + value)
  const col1 = document.createElement('div');
  {
    let label = '', value = '';
    // Get label text
    const labelEl = colButtons[0].querySelector('span.font-common.text-13');
    if (labelEl) label = labelEl.textContent.trim();
    // Get value text
    const valueEl = colButtons[0].querySelector('strong');
    if (valueEl) value = valueEl.textContent.trim();
    // Add label and value as separate lines
    if (label) col1.appendChild(document.createTextNode(label));
    if (label && value) col1.appendChild(document.createElement('br'));
    if (value) col1.appendChild(document.createTextNode(value));
  }

  // Column 2: Travel Dates (label + value)
  const col2 = document.createElement('div');
  {
    let label = '', value = '';
    const labelEl = colButtons[1].querySelector('span.font-common.text-13');
    if (labelEl) label = labelEl.textContent.trim();
    const valueEl = colButtons[1].querySelector('strong');
    if (valueEl) value = valueEl.textContent.trim();
    if (label) col2.appendChild(document.createTextNode(label));
    if (label && value) col2.appendChild(document.createElement('br'));
    if (value) col2.appendChild(document.createTextNode(value));
  }

  // Column 3: Explore button (uppercase as in screenshot)
  const exploreBtn = flexRow.querySelector('button[type="submit"]');
  let col3;
  if (exploreBtn) {
    col3 = document.createElement('div');
    let btnText = '';
    const spanText = exploreBtn.querySelector('span.block.relative');
    if (spanText && spanText.textContent) {
      btnText = spanText.textContent.trim();
    } else if (exploreBtn.textContent) {
      btnText = exploreBtn.textContent.trim();
    }
    const btn = document.createElement('button');
    btn.textContent = btnText.toUpperCase();
    col3.appendChild(btn);
  } else {
    return;
  }

  // Build the columns row
  const columnsRow = [col1, col2, col3];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
