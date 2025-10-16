/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion7) block: 2 columns, multiple rows, first row is block name
  // Header row must be a single cell: ['Accordion (accordion7)']
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find all accordion items within the element
  // Each accordion item: header (title) and content
  // Structure: .Accordion (container) > h3 (header) + .Accordion__answer (content)
  const accordionItems = element.querySelectorAll('.Accordion');

  accordionItems.forEach((item) => {
    // Title: look for [role="button"] inside h3
    const headerBtn = item.querySelector('[role="button"]');
    let title = '';
    if (headerBtn) {
      // The question text is inside .Accordion__question
      const question = headerBtn.querySelector('.Accordion__question');
      if (question) {
        title = question.textContent.trim();
      } else {
        title = headerBtn.textContent.trim();
      }
    }

    // Content: .Accordion__answer-content inside .Accordion__answer
    let contentCell = '';
    const answer = item.querySelector('.Accordion__answer-content');
    if (answer) {
      // Use the entire answer-content element
      contentCell = answer;
    }

    // Defensive: Only add row if title exists
    if (title) {
      rows.push([title, contentCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
