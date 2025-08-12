/* global WebImporter */
export default function parse(element, { document }) {
  // Get top-level columns
  const columns = element.querySelectorAll(':scope > .parsys_column');
  if (columns.length < 2) return;

  // --- Left Column: Logos ---
  const col1 = columns[0];
  const logoContainer = col1.querySelector('.container.logo-circles');
  let logoLinks = [];
  if (logoContainer) {
    // Find all direct children image sections
    const logoImages = logoContainer.querySelectorAll('.par.parsys > .image');
    logoImages.forEach(imgBlock => {
      const link = imgBlock.querySelector('a');
      if (link) logoLinks.push(link);
    });
  }
  // Group logo links inside a div for a single cell
  const logosCell = document.createElement('div');
  logoLinks.forEach(link => logosCell.appendChild(link));

  // --- Right Column: Text and Button ---
  const col2 = columns[1];
  // Find text block
  let textContent = null;
  const textBlock = col2.querySelector('.text.parbase.section');
  if (textBlock) {
    textContent = textBlock;
  }
  // Find button block
  let buttonContent = null;
  const btnBlock = col2.querySelector('.btn.parbase');
  if (btnBlock) {
    buttonContent = btnBlock;
  }
  // Compose right cell content
  const rightCell = document.createElement('div');
  if (textContent) rightCell.appendChild(textContent);
  if (buttonContent) rightCell.appendChild(buttonContent);

  // --- Table Construction ---
  // Header as in the instructions
  const headerRow = ['Columns (columns9)'];
  // Second row: two columns for logos and text/button
  const contentRow = [logosCell, rightCell];
  const cells = [headerRow, contentRow];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
