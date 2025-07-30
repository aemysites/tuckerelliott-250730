/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first major grid (contains two content columns)
  const container = element.querySelector('.container');
  if (!container) return;

  // The first content grid (2 columns)
  const mainGrid = container.querySelector('.grid-layout.tablet-1-column');
  if (!mainGrid) return;
  const mainColumns = mainGrid.querySelectorAll(':scope > div');

  // Defensive: we expect 2 main columns (for 2 top columns of block)
  const firstCol = mainColumns[0] || document.createElement('div');
  const secondCol = mainColumns[1] || document.createElement('div');

  // The second grid (image columns at bottom)
  const imageGrid = element.querySelector('.grid-layout.mobile-portrait-1-column');
  let imgCol1 = document.createElement('div');
  let imgCol2 = document.createElement('div');
  if (imageGrid) {
    const imgBlocks = imageGrid.querySelectorAll('.utility-aspect-1x1');
    if (imgBlocks[0]) {
      const img1 = imgBlocks[0].querySelector('img');
      if (img1) imgCol1 = img1;
    }
    if (imgBlocks[1]) {
      const img2 = imgBlocks[1].querySelector('img');
      if (img2) imgCol2 = img2;
    }
  }

  // Table header (EXACT match to spec)
  const headerRow = ['Columns (columns11)'];

  // Rows: top (text/author + supporting CTAs), bottom (images)
  const tableRows = [
    headerRow,
    [firstCol, secondCol],
    [imgCol1, imgCol2]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(table);
}
