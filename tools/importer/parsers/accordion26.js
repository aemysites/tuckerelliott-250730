/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, multiple rows
  // Header row: block name
  const headerRow = ['Accordion (accordion26)'];

  // Find all accordion items
  // Each item: .Accordion
  const items = Array.from(element.querySelectorAll('.Accordion'));

  const rows = items.map((item) => {
    // Title: find the header button with role="button"
    const headerBtn = item.querySelector('[role="button"]');
    let titleCell;
    if (headerBtn) {
      // Use only the question span text for the title cell
      const questionSpan = headerBtn.querySelector('.Accordion__question');
      if (questionSpan) {
        // Use the span directly for resilience
        titleCell = questionSpan;
      } else {
        // Fallback: use headerBtn text
        titleCell = document.createTextNode(headerBtn.textContent.trim());
      }
    } else {
      // Fallback: use first h3 or text
      const h3 = item.querySelector('h3');
      titleCell = h3 ? h3 : document.createTextNode(item.textContent.trim());
    }

    // Content: find the answer content
    let contentCell;
    const answerContent = item.querySelector('.Accordion__answer-content');
    if (answerContent) {
      contentCell = answerContent;
    } else {
      // Fallback: use answer div or empty cell
      const answerDiv = item.querySelector('.Accordion__answer');
      contentCell = answerDiv ? answerDiv : document.createTextNode('');
    }

    return [titleCell, contentCell];
  });

  // Table cells: header + rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
