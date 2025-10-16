/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns
  const inner = element.querySelector('.ArticleItem__inner');
  let imageCol = null;
  let contentCol = null;
  if (inner) {
    imageCol = inner.querySelector('.ArticleItem__image');
    contentCol = inner.querySelector('.ArticleItem__content');
  }

  // Defensive fallback: try direct children if not found
  if (!imageCol || !contentCol) {
    const children = Array.from(element.children);
    imageCol = imageCol || children.find(div => div.classList && div.classList.contains('ArticleItem__image'));
    contentCol = contentCol || children.find(div => div.classList && div.classList.contains('ArticleItem__content'));
  }

  // Only proceed if both columns are found
  if (!imageCol || !contentCol) return;

  // Table header row
  const headerRow = ['Columns (columns3)'];
  // Table content row: [image, content]
  const contentRow = [imageCol, contentCol];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
