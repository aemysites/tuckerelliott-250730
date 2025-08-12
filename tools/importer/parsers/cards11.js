/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example
  const headerRow = ['Cards (cards11)'];

  // Get all card columns
  const colEls = Array.from(element.querySelectorAll(':scope > .parsys_column'));
  const rows = [];

  colEls.forEach(colEl => {
    // Each .parsys_column contains one card
    const cardContainer = colEl.querySelector('.container');
    if (!cardContainer) return; // skip if missing

    // --- IMAGE CELL ---
    let imageCell = '';
    const imgSection = cardContainer.querySelector('.image');
    if (imgSection) {
      const img = imgSection.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    const textSection = cardContainer.querySelector('.text');
    const textDiv = document.createElement('div');
    if (textSection) {
      // Category: <span class="tile-category">
      const catSpan = textSection.querySelector('.tile-category');
      if (catSpan) {
        // Reference the span directly
        const categoryP = document.createElement('p');
        categoryP.append(catSpan);
        textDiv.appendChild(categoryP);
      }
      // Title: <h3> (contains <span class="tile-title">)
      const titleH3 = textSection.querySelector('h3');
      if (titleH3) {
        textDiv.appendChild(titleH3);
      }
      // Any other description (should be included, but in sample HTML it's always in h3)
    }
    // --- CTA BUTTON (optional, if present)---
    const btnSection = cardContainer.querySelector('.btn');
    if (btnSection) {
      const btnA = btnSection.querySelector('a');
      if (btnA) {
        // Reference existing anchor, but only show visible button text
        const btnSpan = btnA.querySelector('span.lrg, span.button-style');
        const btnLink = document.createElement('a');
        btnLink.href = btnA.href;
        btnLink.textContent = btnSpan ? btnSpan.textContent.trim() : btnA.textContent.trim();
        btnLink.className = 'card-cta';
        // Add a line break then the CTA
        textDiv.appendChild(document.createElement('br'));
        textDiv.appendChild(btnLink);
      }
    }

    rows.push([imageCell, textDiv]);
  });

  // Compose table
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
