/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container block
  const animatedContent = element.querySelector('.animatedcontent');
  if (!animatedContent) return;

  // Find the .parsys_column.cq-colctrl-lt7 block that contains all columns
  const columnsRoot = animatedContent.querySelector('.parsys_column.cq-colctrl-lt7');
  if (!columnsRoot) return;

  // Get all immediate column elements
  const columnEls = Array.from(columnsRoot.children).filter(
    el => el.classList.contains('parsys_column')
  );

  // For each column, extract the image/logo block exactly as rendered
  const rowCells = columnEls.map(col => {
    const imageSection = col.querySelector('.image.parbase.section');
    if (imageSection) {
      return imageSection;
    }
    return col;
  });

  // Header row: as many cells as columns, first is text, rest are empty strings
  const headerRow = ['Columns (columns10)'];
  while(headerRow.length < rowCells.length) headerRow.push('');

  const cells = [
    headerRow,
    rowCells
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
