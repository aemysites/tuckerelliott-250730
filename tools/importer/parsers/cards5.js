/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find the card container (ul with class imageGrid)
  const cardList = element.querySelector('ul.imageGrid');
  if (!cardList) return;

  // For each card (li)
  cardList.querySelectorAll('li').forEach((li) => {
    // Image cell: find the first <img> inside the card
    const img = li.querySelector('img');
    // Text cell: find the correct container for text
    // Use classList.contains instead of invalid pseudo-class selector
    let textContainer = null;
    li.querySelectorAll('div').forEach(div => {
      if (
        div.classList.contains('text-left') &&
        div.classList.contains('text-gray-0')
      ) {
        textContainer = div;
      }
    });
    let textCellContent = [];
    if (textContainer) {
      // Title (h3)
      const title = textContainer.querySelector('h3');
      if (title) textCellContent.push(title);
      // Description (div)
      // Select the first div after h3 (description)
      const desc = title ? title.nextElementSibling : null;
      if (desc && desc.tagName === 'DIV') textCellContent.push(desc);
      // CTA (a)
      const cta = textContainer.querySelector('a');
      if (cta) textCellContent.push(cta);
    }
    // Add row: [image, [title, desc, cta]]
    rows.push([
      img || '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
