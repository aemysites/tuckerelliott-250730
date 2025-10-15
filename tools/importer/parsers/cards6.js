/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parser
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find all card anchors in ALL sections, including hidden ones
  // Cards are inside .group > a.js-DetailCard, but some sections are hidden via style/display
  // We want to include ALL cards regardless of visibility
  const allCards = Array.from(element.querySelectorAll('a.js-DetailCard'));

  allCards.forEach((card) => {
    // --- IMAGE CELL ---
    const img = card.querySelector('img');
    // --- TEXT CELL ---
    const cellContent = [];

    // Price label (above text)
    const priceLabel = card.querySelector('.js-DetailCardPrice');
    if (priceLabel) {
      const priceDiv = document.createElement('div');
      priceDiv.innerHTML = priceLabel.innerHTML;
      cellContent.push(priceDiv);
    }

    // Special sections above card body (e.g. 'No Kids. Just Treats.', etc.)
    // These are <section> elements inside <figcaption> but outside .js-DetailCardBody
    // Some cards have multiple such sections, so collect all
    const figcaption = card.closest('figure')?.querySelector('figcaption');
    if (figcaption) {
      Array.from(figcaption.children).forEach((node) => {
        // Only include <section> elements that are NOT .js-DetailCardBody
        if (
          node.tagName === 'SECTION' &&
          !node.classList.contains('js-DetailCardBody')
        ) {
          cellContent.push(node);
        }
      });
    }

    // Card body section
    const cardBody = card.querySelector('.js-DetailCardBody');
    if (cardBody) {
      const heading = cardBody.querySelector('.js-DetailCardHeading');
      if (heading) {
        cellContent.push(heading);
      }
      const ports = cardBody.querySelector('.js-DetailCardPorts');
      if (ports) {
        cellContent.push(ports);
      }
    }

    // Card footer badges (ul)
    const cardFooter = card.querySelector('.js-DetailCardFooter');
    if (cardFooter) {
      const badges = cardFooter.querySelector('ul');
      if (badges) {
        cellContent.push(badges);
      }
      // CTA button (span) -- always include
      const cta = Array.from(cardFooter.querySelectorAll('span')).find(
        (span) => span.textContent.trim().toLowerCase().includes('explore')
      );
      if (cta) {
        cellContent.push(cta);
      }
    }

    rows.push([img, cellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
