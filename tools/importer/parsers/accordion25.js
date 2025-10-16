/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion25)'];
  const rows = [headerRow];

  // Find all accordion items
  // Each .Accordion contains a header and answer content
  const accordionItems = element.querySelectorAll('.Accordion');

  accordionItems.forEach((item) => {
    // Title cell: find the clickable header span (role="button") and get the question span inside
    const headerBtn = item.querySelector('[role="button"]');
    let titleCell = '';
    if (headerBtn) {
      // Use only the question text (not the plus/minus icons)
      const questionSpan = headerBtn.querySelector('.Accordion__question');
      if (questionSpan) {
        titleCell = questionSpan;
      } else {
        // fallback: use headerBtn text
        titleCell = document.createTextNode(headerBtn.textContent.trim());
      }
    }

    // Content cell: find the answer content
    let contentCell = '';
    const answerContent = item.querySelector('.Accordion__answer-content');
    if (answerContent) {
      // Defensive: if answerContent has multiple children, use them all
      if (answerContent.children.length > 0) {
        contentCell = Array.from(answerContent.children);
      } else {
        contentCell = answerContent;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
