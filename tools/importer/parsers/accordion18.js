/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion18)'];
  const rows = [headerRow];

  // Find all accordion items within the block
  // Each .Accordion is a single item
  const accordionItems = element.querySelectorAll('.Accordion');

  accordionItems.forEach((item) => {
    // Title cell: Find the header button (role="button") and extract the question span
    const headerBtn = item.querySelector('[role="button"]');
    let titleCell = null;
    if (headerBtn) {
      // Use only the question span text for the title cell
      const questionSpan = headerBtn.querySelector('.Accordion__question');
      if (questionSpan) {
        // Use the span itself for formatting (bold etc.)
        titleCell = questionSpan;
      } else {
        // Fallback to headerBtn text
        titleCell = document.createTextNode(headerBtn.textContent.trim());
      }
    } else {
      // Fallback: use first heading or text
      const h3 = item.querySelector('h3');
      titleCell = h3 ? h3 : document.createTextNode('');
    }

    // Content cell: Find the answer content
    let contentCell = null;
    const answerContent = item.querySelector('.Accordion__answer-content');
    if (answerContent) {
      // If answerContent contains multiple paragraphs, include them all
      const children = Array.from(answerContent.childNodes).filter(
        (node) => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
      );
      if (children.length > 1) {
        contentCell = children;
      } else if (children.length === 1) {
        contentCell = children[0];
      } else {
        contentCell = answerContent;
      }
    } else {
      // Fallback: empty cell
      contentCell = document.createTextNode('');
    }

    // Add row: [titleCell, contentCell]
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
