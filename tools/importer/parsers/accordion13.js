/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as per block requirements
  const headerRow = ['Accordion (accordion13)'];

  // 2. Find all accordion items
  // Each .Accordion is a single item
  const accordionItems = element.querySelectorAll('.Accordion');
  const rows = [];

  accordionItems.forEach((item) => {
    // Title cell: find the header button (role="button") and get the question text
    const headerBtn = item.querySelector('[role="button"]');
    let titleCell;
    if (headerBtn) {
      // The question is inside a span with class Accordion__question
      const question = headerBtn.querySelector('.Accordion__question');
      if (question) {
        // Use the span element directly for formatting
        titleCell = question;
      } else {
        // Fallback: use the button itself
        titleCell = headerBtn;
      }
    } else {
      // Fallback: use the first h3
      const h3 = item.querySelector('h3');
      titleCell = h3 || document.createTextNode('');
    }

    // Content cell: find the answer content
    let contentCell;
    const answerContent = item.querySelector('.Accordion__answer-content');
    if (answerContent) {
      contentCell = answerContent;
    } else {
      // Fallback: empty cell
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // 3. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // 4. Replace the original element
  element.replaceWith(table);
}
