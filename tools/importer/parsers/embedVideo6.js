/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Embed (embedVideo6)'];

  // --- Extract the video URL ---
  // Find the <video> element
  const video = element.querySelector('video');
  let videoUrl = '';
  if (video) {
    videoUrl = video.getAttribute('src') || video.getAttribute('data-src') || '';
  }

  // --- Extract the poster image ---
  // Find the <img> inside <picture>
  let posterImg = null;
  const picture = element.querySelector('picture');
  if (picture) {
    posterImg = picture.querySelector('img');
  }

  // --- Compose the cell content (only image and video link, no extra text) ---
  const cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (videoUrl) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    if (cellContent.length) cellContent.push(document.createElement('br'));
    cellContent.push(a);
  }

  const tableRows = [
    headerRow,
    [cellContent.length ? cellContent : '']
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(table);
}
