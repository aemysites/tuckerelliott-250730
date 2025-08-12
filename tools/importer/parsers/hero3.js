/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in example
  const headerRow = ['Hero'];

  // Extract background image
  let bgImg = null;
  // Find the image inside any .bg
  const bgDivs = element.querySelectorAll('.bg');
  for (const bgDiv of bgDivs) {
    const img = bgDiv.querySelector('img');
    if (img) {
      bgImg = img;
      break;
    }
  }
  const bgRow = [bgImg ? bgImg : ''];

  // Extract headline, subheadline, and buttons
  // Go to the deepest .container.rounded-lg if exists
  let contentContainer = element.querySelector('.container.rounded-lg');
  // Fallback: get the innermost .main-headline
  if (!contentContainer) {
    const headline = element.querySelector('.main-headline');
    if (headline) {
      contentContainer = headline.closest('div');
    }
  }

  const contentNodes = [];
  if (contentContainer) {
    // Headline
    const h1 = contentContainer.querySelector('h1');
    if (h1) contentNodes.push(h1);
    // Subheadline
    const h2 = contentContainer.querySelector('h2');
    if (h2) contentNodes.push(h2);
    // All CTA buttons (all <a> inside .btn inside contentContainer)
    const btnLinks = contentContainer.querySelectorAll('.btn a');
    btnLinks.forEach(a => contentNodes.push(a));
  }
  // If nothing found, fallback to .main-headline text
  if (contentNodes.length === 0) {
    const fallback = element.querySelector('.main-headline');
    if (fallback) contentNodes.push(fallback);
  }
  const contentRow = [contentNodes.length === 1 ? contentNodes[0] : contentNodes];

  // Compose table rows
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
