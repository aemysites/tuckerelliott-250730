/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always a single cell with block name
  const headerRow = ['Accordion (accordion22)'];

  // Find the accordion container
  const accordion = element.querySelector('.js-AccordionSeo');
  if (!accordion) return;

  // Title: get only the text from the button inside h2 (not the button element)
  let titleContent;
  const headingButton = accordion.querySelector('h2 button');
  if (headingButton) {
    // Remove chevron icon span for clean title
    const btnClone = headingButton.cloneNode(true);
    const chevron = btnClone.querySelector('span');
    if (chevron) chevron.remove();
    titleContent = btnClone.textContent.trim();
  } else {
    const h2 = accordion.querySelector('h2');
    titleContent = h2 ? h2.textContent.trim() : '';
  }

  // Content: include BOTH preview and expanded content in the content cell
  const preview = accordion.querySelector('.js-AccordionSeoPreview');
  const expanded = accordion.querySelector('.js-AccordionSeoBodyContent > div[style*="display: var(--body-content-display"]');
  const contentFragment = document.createDocumentFragment();
  if (preview) {
    contentFragment.appendChild(preview.cloneNode(true));
  }
  if (expanded) {
    contentFragment.appendChild(expanded.cloneNode(true));
  }

  const rows = [
    headerRow,
    [titleContent, contentFragment],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
