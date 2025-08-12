/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we're referencing the columns block name as the header
  const headerRow = ['Columns (columns14)'];

  // Find the legal text block
  const legalText = element.querySelector('.legal-text');
  if (!legalText) return;
  // Get the UL element with the links
  const ul = legalText.querySelector('ul');
  if (!ul) return;

  // Get all LI children of UL
  const lis = Array.from(ul.children);
  // If no items, abort
  if (lis.length === 0) return;

  // Each column is one list item, so create a row of LIs
  // We reference the actual <li> elements, preserving any links or content inside
  const contentRow = lis.map(li => li);

  // Table: header (single cell), then one row with n columns (one for each <li>)
  const cells = [headerRow, contentRow];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
