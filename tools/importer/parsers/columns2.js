/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the top-level two columns
  // Get direct child .parsys_column.cq-colctrl-lt2 (the column control container)
  const colCtrl = element.querySelector('.parsys_column.cq-colctrl-lt2');
  if (!colCtrl) return;

  // Get immediate children of colCtrl that are columns
  const columns = colCtrl.querySelectorAll(':scope > .parsys_column');
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  // The left column should contain an h1 ("Data and AI Solutions")
  // Typically inside .text.parbase.section > div > h1
  let leftColContent = [];
  const leftCol = columns[0];
  // Find all direct .text.parbase.section elements in left column
  const textSections = leftCol.querySelectorAll(':scope > .text.parbase.section');
  textSections.forEach(sec => {
    // Use all children of each section (so if nested div > h1, get h1)
    Array.from(sec.children).forEach(child => {
      leftColContent.push(child);
    });
  });
  // If nothing found, fallback to all children of leftCol
  if (leftColContent.length === 0) {
    leftColContent = Array.from(leftCol.children);
  }
  // If still nothing, fallback to empty string
  if (leftColContent.length === 0) {
    leftColContent = [''];
  }
  // If only one element, just use that element
  const leftCell = leftColContent.length === 1 ? leftColContent[0] : leftColContent;

  // --- RIGHT COLUMN ---
  // The right column contains a styled button in .btn.parbase > a
  const rightCol = columns[1];
  // We'll collect all direct links inside right column, prioritizing .btn.parbase > a
  let rightColContent = [];
  // Get all .btn.parbase sections and their links
  const btnSections = rightCol.querySelectorAll('.btn.parbase');
  btnSections.forEach(btn => {
    const a = btn.querySelector('a');
    if (a) rightColContent.push(a);
  });
  // Fallback: any direct links inside right column
  if (rightColContent.length === 0) {
    const links = rightCol.querySelectorAll('a');
    rightColContent = Array.from(links);
  }
  // If no links, fallback to all children of rightCol
  if (rightColContent.length === 0) {
    rightColContent = Array.from(rightCol.children);
  }
  // If still nothing, fallback to empty string
  if (rightColContent.length === 0) {
    rightColContent = [''];
  }
  // If only one element, just use that element
  const rightCell = rightColContent.length === 1 ? rightColContent[0] : rightColContent;

  // --- BUILD THE TABLE ---
  // Header row as in the example
  const headerRow = ['Columns (columns2)'];
  // Content row: left column cell, right column cell
  const cells = [headerRow, [leftCell, rightCell]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
