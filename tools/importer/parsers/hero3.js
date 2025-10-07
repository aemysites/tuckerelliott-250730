/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero3) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: heading, subheading, CTA, all visible text

  // Header row
  const headerRow = ['Hero (hero3)'];

  // --- Row 2: Background image ---
  let bgImg = null;
  const absDivs = element.querySelectorAll(':scope > div');
  for (const div of absDivs) {
    const img = div.querySelector('img');
    if (img) {
      bgImg = img;
      break;
    }
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // --- Row 3: Heading, subheading, CTA, all visible text ---
  // Find heading (h1, h2, h3, etc.)
  let heading = element.querySelector('h1');
  let subheading = null;
  let cta = null;

  // Look for CTA (anchor/button) inside the block
  const ctaEl = element.querySelector('a, button');
  if (ctaEl) {
    cta = ctaEl;
  }

  // Collect all visible text nodes (not just headings)
  // This will include 'ANNOUNCED AT .LOCAL NYC' and 'Hello,' if present in the HTML
  const textNodes = [];
  element.querySelectorAll('*').forEach((el) => {
    if (['SCRIPT','STYLE','META'].includes(el.tagName)) return;
    if (el !== heading && el.textContent && el.textContent.trim()) {
      // Only add if not an image
      if (!el.querySelector('img')) {
        textNodes.push(el.cloneNode(true));
      }
    }
  });

  // Compose content cell for row 3
  const contentCell = [];
  if (heading) contentCell.push(heading);
  textNodes.forEach((node) => {
    if (node.textContent.trim() !== heading?.textContent.trim()) {
      contentCell.push(node);
    }
  });
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);
  const contentRow = [contentCell.length ? contentCell : ''];

  // Compose table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
