/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: 2 columns, multiple rows, each card = image + text

  // Helper: Extract image from card background style
  function extractImageFromBg(div) {
    if (!div) return null;
    const style = div.getAttribute('style') || '';
    const urlMatch = style.match(/url\(("|')?(.*?)\1?\)/);
    if (urlMatch && urlMatch[2]) {
      const img = document.createElement('img');
      img.src = urlMatch[2];
      img.alt = '';
      img.style.width = '100%';
      return img;
    }
    return null;
  }

  // Helper: Extract overlay label (Previous/Next)
  function extractOverlayLabel(cardImgDiv) {
    if (!cardImgDiv) return null;
    const overlayDiv = cardImgDiv.querySelector('.absolute');
    if (overlayDiv) {
      // Return the overlay div as-is (contains <strong> label)
      return overlayDiv;
    }
    return null;
  }

  // Helper: Extract card text content
  function extractCardText(cardContentDiv) {
    if (!cardContentDiv) return null;
    // Find heading, paragraph, and date
    const heading = cardContentDiv.querySelector('h3');
    const para = cardContentDiv.querySelector('p');
    const dateDiv = cardContentDiv.querySelector('.absolute.bottom.left');
    let date = null;
    if (dateDiv) {
      date = dateDiv.querySelector('small');
    }
    // Compose content
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading);
    if (para) frag.appendChild(para);
    if (date) frag.appendChild(date);
    return frag;
  }

  // Find all card containers
  const cardContainers = element.querySelectorAll('.card-container');
  const rows = [];
  const headerRow = ['Cards (cards5)'];
  rows.push(headerRow);

  cardContainers.forEach((container) => {
    // Card link
    const cardLink = container.querySelector('.card > a');
    if (!cardLink) return;
    // Image section
    const cardImgDiv = cardLink.querySelector('.h-200');
    let img = null;
    if (cardImgDiv) {
      const bgDiv = cardImgDiv.querySelector('.bg');
      img = extractImageFromBg(bgDiv);
    }
    // Overlay label (Previous/Next)
    const overlayLabel = extractOverlayLabel(cardImgDiv);
    // Compose image cell: image + overlay label (if present)
    const imageCell = [];
    if (img) imageCell.push(img);
    if (overlayLabel) imageCell.push(overlayLabel);
    // Text section
    const cardContentDiv = cardLink.querySelector('.p-20.h-max-220');
    const textCell = extractCardText(cardContentDiv);
    rows.push([imageCell, textCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
