/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children divs
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Expect two main children (left: image, right: text)
  let leftCol, rightCol;
  if (children.length === 2) {
    leftCol = children[0];
    rightCol = children[1];
  } else {
    // Fallback: Try to find image and text blocks
    leftCol = element.querySelector('.relative, [data-hlx-background-image]');
    rightCol = element.querySelector('small')?.parentElement;
  }

  // Left column: Find image element
  let imgEl = leftCol && leftCol.querySelector('img');
  // Defensive: If not found, try deeper
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }
  // Use the existing image element if found
  const leftCell = imgEl ? imgEl : leftCol;

  // Right column: Use the text block
  // Compose all <small> and <br> elements in rightCol
  let rightCell;
  if (rightCol) {
    // Gather all children for robustness
    const rightContent = [];
    rightCol.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        rightContent.push(node);
      }
    });
    rightCell = rightContent;
  } else {
    // Fallback: Use all text nodes in element
    rightCell = [document.createTextNode(element.textContent.trim())];
  }

  // Table structure
  const headerRow = ['Columns (columns4)'];
  const contentRow = [leftCell, rightCell];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
