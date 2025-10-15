/* global WebImporter */
export default function parse(element, { document }) {
  // Find image column
  const imageCol = element.querySelector('.ArticleItem__image');
  // Find content column
  const contentCol = element.querySelector('.ArticleItem__content');

  // Table header row
  const headerRow = ['Columns (columns3)'];

  // Table content row: left = image, right = text content
  const row = [imageCol, contentCol];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  // Replace original element
  element.replaceWith(table);
}
