/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero15)'];

  // 2. Background image row
  const bgImg = element.querySelector(':scope > img');
  const bgImgRow = [bgImg ? bgImg : ''];

  // 3. Content row: headline and visible form bar (with all visible text, including correct button text case)
  const contentArr = [];

  // Headline (ensure all heading text is included)
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) contentArr.push(heading.cloneNode(true));

  // Visible form bar (dropdowns and CTA)
  const formBar = element.querySelector('form .bg-white');
  if (formBar) {
    // Clone the visible bar
    const barClone = formBar.cloneNode(true);
    // Fix the CTA button text to be uppercase as in the screenshot
    const ctaBtn = barClone.querySelector('button[type="submit"] span.block.relative');
    if (ctaBtn && ctaBtn.textContent.trim().toUpperCase() !== ctaBtn.textContent.trim()) {
      ctaBtn.textContent = ctaBtn.textContent.trim().toUpperCase();
    }
    contentArr.push(barClone);
  }

  const contentRow = [contentArr];

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
