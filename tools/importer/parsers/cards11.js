/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container
  const cardsContainer = element.querySelector('.inline-flex');
  if (!cardsContainer) return;
  const cardButtons = Array.from(cardsContainer.querySelectorAll('button.js-VSCScrollbarCard'));

  // Table header row
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Extract each card's image and text
  cardButtons.forEach(cardBtn => {
    // Find the main image (not SVG)
    const images = Array.from(cardBtn.querySelectorAll('img'));
    const cardImg = images.find(img => img.src && !img.src.startsWith('data:image/svg+xml')) || null;
    let imageCell = document.createElement('div');
    imageCell.style.position = 'relative';
    if (cardImg) {
      imageCell.appendChild(cardImg.cloneNode(true));
    }
    // Find the play button overlay (the circular button with SVG)
    const playBtn = cardBtn.querySelector('span.rounded-full img[src^="data:image/svg+xml"]');
    if (playBtn) {
      // Wrap in a span for positioning
      const playSpan = document.createElement('span');
      playSpan.style.position = 'absolute';
      playSpan.style.left = '50%';
      playSpan.style.top = '50%';
      playSpan.style.transform = 'translate(-50%, -50%)';
      playSpan.style.zIndex = '3';
      playSpan.appendChild(playBtn.cloneNode(true));
      imageCell.appendChild(playSpan);
    }

    // Find the card text block (grab the overlay div at the bottom)
    let textCell = '';
    const overlayDiv = cardBtn.querySelector('div.absolute.z-2.inset-x-0.bottom-0');
    if (overlayDiv) {
      textCell = overlayDiv.cloneNode(true);
    } else {
      // Fallback: use all text content from the button
      textCell = document.createTextNode(cardBtn.textContent.trim());
    }

    // Add row: [image, text]
    rows.push([imageCell, textCell]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
