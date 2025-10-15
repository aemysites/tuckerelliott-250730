/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find the parent container holding all card instances
  // Cards are inside <ul> with class js-StoryblockValuePropositionCards
  // Each card is a <li> with a <div> inside
  // There are two <ul>s (tablet/desktop and mobile), but both contain the same cards. We'll use the first one.
  const ul = element.querySelector('.js-StoryblockValuePropositionCards');
  if (!ul) return;

  // Get all <li> elements (cards)
  const cardLis = ul.querySelectorAll('li');

  cardLis.forEach((li) => {
    // Each card's main content is in the first <div> inside the <li>
    const cardDiv = li.querySelector('div');
    if (!cardDiv) return;

    // Image/Icon: find <img> inside <picture>
    let imageEl = null;
    const picture = cardDiv.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img');
    }
    // Defensive: skip card if no image
    if (!imageEl) return;

    // Text content: get all text from the cardDiv except the image
    // We'll grab the .flex.flex-col container and clone its children
    const textContainer = cardDiv.querySelector('.flex.flex-col');
    let textCell = [];
    if (textContainer) {
      // Get all children (title, description, etc.)
      Array.from(textContainer.childNodes).forEach((node) => {
        // Only include elements and text nodes with content
        if (node.nodeType === 1) {
          // Element node
          textCell.push(node.cloneNode(true));
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node with non-whitespace
          textCell.push(document.createTextNode(node.textContent));
        }
      });
    }
    // Fallback: if nothing found, try to get all text from cardDiv
    if (textCell.length === 0) {
      textCell.push(document.createTextNode(cardDiv.textContent.trim()));
    }

    // Add row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
