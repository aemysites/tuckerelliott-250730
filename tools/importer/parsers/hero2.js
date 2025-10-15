/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child divs
  const topDivs = element.querySelectorAll(':scope > div');
  let imgEl = null;
  let headingEl = null;
  let subheadingEl = null;

  // Defensive: Find the image element
  // Look for <img> inside <picture> inside Multimedia
  for (const div of topDivs) {
    const heroSlide = div.querySelector('.js-HeroSlide');
    if (heroSlide) {
      const multimedia = heroSlide.querySelector('.Multimedia');
      if (multimedia) {
        const picture = multimedia.querySelector('picture');
        if (picture) {
          // Reference the actual <img> element, do not clone
          const img = picture.querySelector('img');
          if (img) imgEl = img;
        }
      }
      // Find content wrapper for headings/subheading
      const contentWrapper = heroSlide.querySelector('.OneColumnWrapper');
      if (contentWrapper) {
        // Find heading and subheading inside flex column
        const flexCol = contentWrapper.querySelector('.flex.flex-col');
        if (flexCol) {
          headingEl = flexCol.querySelector('h1');
          subheadingEl = flexCol.querySelector('p');
        }
      }
    }
  }

  // Build table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imgEl ? imgEl : ''];
  // Compose content cell: preserve semantic elements
  const contentCell = document.createElement('div');
  if (headingEl) contentCell.appendChild(headingEl);
  if (subheadingEl) contentCell.appendChild(subheadingEl);
  // No CTA found in source HTML or screenshot
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
