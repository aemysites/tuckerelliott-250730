/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero2)'];

  // 2. Background image (row 2)
  let bgImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    bgImg = picture.querySelector('img');
  }
  const bgRow = [bgImg ? bgImg : ''];

  // 3. Content (row 3): Heading, subheading, play/pause button (as element)
  const contentCell = [];
  const heading = element.querySelector('h1');
  if (heading) contentCell.push(heading);
  const subheading = element.querySelector('p');
  if (subheading) contentCell.push(subheading);

  // Find multimedia button and include the actual button element
  const playPauseBtn = element.querySelector('.HeroVideoDesktopControls__play');
  if (playPauseBtn) {
    // Clone the button so we don't move it from the DOM
    contentCell.push(playPauseBtn.cloneNode(true));
  }

  // Compose content row
  const contentRow = [contentCell];

  // 4. Compose table
  const rows = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 5. Replace original element
  element.replaceWith(table);
}
