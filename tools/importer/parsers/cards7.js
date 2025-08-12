/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly matching example
  const headerRow = ['Cards (cards7)'];

  // Find card columns
  const columns = element.querySelectorAll(':scope > .parsys_column');
  if (columns.length < 2) return;

  // --- IMAGE CELL ---
  // Get the image element (reference existing img)
  let imgEl = null;
  const imgWrap = columns[0].querySelector('img');
  if (imgWrap) {
    imgEl = imgWrap;
  }

  // --- TEXT CELL ---
  const textCol = columns[1];
  const cellContent = [];

  // Extract heading (keep correct semantic level)
  let heading = textCol.querySelector('.section-heading, h2');
  if (heading) {
    cellContent.push(heading);
  }

  // Extract description (subhead)
  let subhead = textCol.querySelector('.section-subhead, h3');
  if (subhead) {
    cellContent.push(subhead);
  }

  // Extract CTA/link if present
  let cta = textCol.querySelector('.btn a');
  if (cta) {
    cellContent.push(cta);
  }

  // If no content, don't break the block (edge case)
  if (!imgEl && cellContent.length === 0) return;

  // Build rows: header, then card row as [img, text]
  const rows = [headerRow, [imgEl, cellContent]];

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
