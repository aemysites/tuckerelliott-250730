/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all visible columns in the block
  const colCtrlLt5 = element.querySelector('.cq-colctrl-lt5');
  if (!colCtrlLt5) return;
  // Get all immediate column divs
  const columns = Array.from(colCtrlLt5.querySelectorAll(':scope > .parsys_column'));

  // For each column, gather all content (including blocks and text)
  function getColumnContent(col) {
    // Filter out clear:both and empty text nodes
    const nodes = Array.from(col.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'DIV' &&
        node.getAttribute('style') &&
        node.getAttribute('style').includes('clear')
      ) {
        return false;
      }
      return true;
    });
    // If only one node, collapse to single element
    return nodes.length === 1 ? nodes[0] : nodes;
  }

  // Compose the columns row
  const contentRow = columns.map(getColumnContent);
  // If no columns found, fallback to the entire container
  if (contentRow.length === 0) contentRow.push(colCtrlLt5);

  // Header row exactly as in the markdown example
  const headerRow = ['Columns (columns13)'];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
