/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion6)'];

  // Find all accordion items
  const accordionItems = Array.from(element.querySelectorAll('.Accordion'));

  // Build rows for each accordion item
  const rows = accordionItems.map((item) => {
    // Title: find the header button/question
    const headerButton = item.querySelector('[role="button"]');
    let titleEl = null;
    if (headerButton) {
      // The question text is inside a span
      const questionSpan = headerButton.querySelector('.Accordion__question');
      if (questionSpan) {
        titleEl = questionSpan;
      } else {
        // Fallback: use the headerButton itself
        titleEl = headerButton;
      }
    }

    // Content: find the answer content
    const answerContent = item.querySelector('.Accordion__answer-content');
    let contentEls = [];
    if (answerContent) {
      // Use all children (usually <p> elements)
      contentEls = Array.from(answerContent.children);
    }

    // Defensive: if no title or content, fallback to empty string
    return [titleEl || '', contentEls.length ? contentEls : ''];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
