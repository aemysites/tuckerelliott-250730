/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion14) block parser
  // 1. Header row
  const headerRow = ['Accordion (accordion14)'];

  // 2. Find the accordion container
  const accordion = element.querySelector('.Accordion');
  if (!accordion) return;

  // 3. Extract the header/title cell, ONLY the text (no icons or markup)
  let titleCell = '';
  const headerButton = accordion.querySelector('.Accordion__header__button');
  if (headerButton) {
    // Find the question span and use only its text content
    const questionSpan = headerButton.querySelector('.Accordion__question');
    titleCell = questionSpan ? questionSpan.textContent.trim() : headerButton.textContent.trim();
  } else {
    // fallback: just use the header text
    const h3 = accordion.querySelector('.Accordion__header');
    titleCell = h3 ? h3.textContent.trim() : '';
  }

  // 4. Extract the content cell (empty for collapsed state)
  let contentCell = '';
  const answerContent = accordion.querySelector('.Accordion__answer-content');
  if (answerContent) {
    contentCell = answerContent;
  }

  // 5. Build table rows
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // 6. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
