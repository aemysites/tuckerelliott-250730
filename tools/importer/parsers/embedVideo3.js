/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo3)
  const headerRow = ['Embed (embedVideo3)'];

  // Defensive selectors for video and poster image
  let videoUrl = '';
  let posterImg = null;

  // Find the <video> element
  const videoEl = element.querySelector('video');
  if (videoEl) {
    // Prefer src attribute, fallback to data-src
    videoUrl = videoEl.getAttribute('src') || videoEl.getAttribute('data-src') || '';
  }

  // Find the poster image: look for <img> inside <picture>
  const pictureEl = element.querySelector('picture');
  if (pictureEl) {
    posterImg = pictureEl.querySelector('img');
  }

  // Compose the cell content: image above link if both exist
  let cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }

  // If neither image nor video link, fallback to the whole element
  if (cellContent.length === 0) {
    cellContent = [element];
  }

  const rows = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
