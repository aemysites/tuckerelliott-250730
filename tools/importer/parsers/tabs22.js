/* global WebImporter */
export default function parse(element, { document }) {
  // Locate tab labels
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabLinks = tabMenu ? Array.from(tabMenu.querySelectorAll('a')) : [];
  const tabLabels = tabLinks.map(tabLink => {
    const labelDiv = tabLink.querySelector('div');
    return labelDiv ? labelDiv.textContent.trim() : tabLink.textContent.trim();
  });
  // Locate tab panes/content
  const tabContent = element.querySelector('.w-tab-content');
  const tabPanes = tabContent ? Array.from(tabContent.querySelectorAll('.w-tab-pane')) : [];

  // Compose rows: header must be a single cell
  const rows = [];
  // Add header row (single cell)
  rows.push(['Tabs']);
  // Add each tab: [label, content]
  tabLabels.forEach((label, idx) => {
    const pane = tabPanes[idx];
    let cellContent = null;
    if (pane) {
      // Content is the inner grid div if it exists, else pane
      const contentDiv = pane.querySelector('div');
      cellContent = contentDiv || pane;
    }
    rows.push([label, cellContent]);
  });
  // Create table and set colSpan of header to match columns if needed
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header cell to span all columns if needed
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1 && rows.length > 1 && rows[1].length > 1) {
    headerRow.firstElementChild.setAttribute('colspan', rows[1].length);
  }
  element.replaceWith(table);
}
