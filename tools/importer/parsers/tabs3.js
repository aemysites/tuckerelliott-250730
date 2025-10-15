/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tab row (anchors) and the Search button
  const tabRow = element.querySelector('div.flex');
  if (!tabRow) return;
  const tabLinks = Array.from(tabRow.querySelectorAll('a'));
  // Find the Search button (outside the tabRow)
  const searchBtn = element.querySelector('button#SearchBtn');
  // Find the search panel (hidden by default)
  const searchPanel = element.querySelector('.js-BlogSearch');

  // Build rows: header + one row per tab (label, content)
  const rows = [];
  // Always use the required block name as header
  rows.push(['Tabs (tabs3)']);

  // Add tab links with their text as label and the link as content
  tabLinks.forEach((a) => {
    // Create a link element for tab content
    const link = a.cloneNode(true);
    rows.push([a.textContent.trim(), link]);
  });

  // Add Search as a tab, with its icon and label as content, plus the search panel
  if (searchBtn) {
    // Clone the button to preserve icon and label
    const btnClone = searchBtn.cloneNode(true);
    btnClone.removeAttribute('id');
    let content = btnClone;
    // If there is a search panel, append its main content
    if (searchPanel) {
      // Only include the visible search form (not suggestions/template)
      const form = searchPanel.querySelector('form');
      if (form) {
        const formClone = form.cloneNode(true);
        content = [btnClone, formClone];
      }
    }
    // Use the visible label for the Search tab
    let label = 'Search';
    const labelSpan = searchBtn.querySelector('span');
    if (labelSpan && labelSpan.textContent.trim()) {
      label = labelSpan.textContent.trim();
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
