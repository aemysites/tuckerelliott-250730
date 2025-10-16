/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns11)'];

  // Find the main flex row containing columns (avoid pseudo-class selectors)
  const flexRow = Array.from(element.querySelectorAll('div')).find(div => {
    const cls = div.className || '';
    return cls.includes('flex') && cls.includes('flex-col-reverse') && cls.includes('flex-wrap');
  });
  if (!flexRow) return;
  const columns = flexRow.children;
  if (columns.length < 2) return;

  // LEFT COLUMN: Text content
  const leftCol = columns[0];
  // Find the main text content container (usually with heading, paragraphs, list)
  let leftContent = leftCol.querySelector('div');
  if (!leftContent) leftContent = leftCol;

  // RIGHT COLUMN: Image
  const rightCol = columns[1];
  // Find the image element inside rightCol
  const img = rightCol.querySelector('img');

  // Compose the columns row: reference actual DOM nodes
  const columnsRow = [leftContent, img];

  // Build the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(table);
}
