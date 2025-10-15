/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards9) block parser
  // 1. Find the parent container for the cards
  const cardsContainer = element.querySelector('.js-OverviewCardsArea');
  if (!cardsContainer) return;

  // 2. Find all card items inside the container
  const cardNodes = cardsContainer.querySelectorAll('.js-OverviewCardsItem');
  if (!cardNodes.length) return;

  // 3. Prepare the table rows
  // Header row as per block guidelines: exactly one column
  const rows = [];
  rows.push(['Cards (cards9)']);

  // 4. For each card, extract image and content
  cardNodes.forEach((cardNode) => {
    // The card link wraps the card content
    const cardLink = cardNode.querySelector('a.js-CardLink');
    if (!cardLink) return;

    // --- IMAGE ---
    // Find the image inside the figure
    const img = cardLink.querySelector('img');
    // Defensive: only use if present
    const imageEl = img || '';

    // --- CONTENT ---
    // We'll build a fragment for the right cell
    const contentFrag = document.createElement('div');
    // Find the figcaption (contains text content)
    const figcaption = cardLink.querySelector('figcaption');
    if (figcaption) {
      // Title (h2)
      const h2 = figcaption.querySelector('h2');
      if (h2) {
        contentFrag.appendChild(h2);
      }
      // Description (p)
      const desc = figcaption.querySelector('p');
      if (desc) {
        contentFrag.appendChild(desc);
      }
      // CTA (button or link)
      // Prefer button inside figcaption, but fallback to link if present
      let cta = figcaption.querySelector('button, a');
      if (!cta) {
        // fallback: find a link in the cardLink itself
        cta = cardLink.querySelector('a');
      }
      if (cta) {
        // If it's a button, clone as a link if possible
        if (cta.tagName.toLowerCase() === 'button') {
          const btn = cta;
          const href = cardLink.getAttribute('href') || '#';
          const a = document.createElement('a');
          a.href = href;
          a.textContent = btn.textContent.trim();
          a.className = btn.className;
          a.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Learn More');
          contentFrag.appendChild(a);
        } else {
          contentFrag.appendChild(cta);
        }
      }
    }

    // Add the row: [image, content]
    rows.push([imageEl, contentFrag]);
  });

  // 5. Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
