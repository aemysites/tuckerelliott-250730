/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  // Each accordion item is a direct child with class 'accordion'
  const accordions = Array.from(element.querySelectorAll(':scope > .accordion'));

  accordions.forEach((accordion) => {
    // Title cell: the button area contains class 'paragraph-lg' for the title
    let titleCell = document.createTextNode('');
    const toggle = accordion.querySelector('.w-dropdown-toggle');
    if (toggle) {
      const titleEl = toggle.querySelector('.paragraph-lg');
      if (titleEl) titleCell = titleEl;
    }

    // Content cell: find nav.accordion-content -> .utility-padding-all-1rem -> .rich-text (may be more than one)
    let contentCell = document.createTextNode('');
    const nav = accordion.querySelector('nav.accordion-content');
    if (nav) {
      const paddingDiv = nav.querySelector('.utility-padding-all-1rem');
      if (paddingDiv) {
        const richTexts = Array.from(paddingDiv.children);
        if (richTexts.length === 1) {
          contentCell = richTexts[0];
        } else if (richTexts.length > 1) {
          contentCell = richTexts;
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
