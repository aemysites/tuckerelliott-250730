/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: 2 columns, first row is block name, each row is a card (image/icon, then text)

  // Find the main card container (desktop preferred, fallback to mobile)
  let cardsContainer = element.querySelector('.js-StoryblockValuePropositionTablet ul.js-StoryblockValuePropositionCards');
  if (!cardsContainer) {
    // fallback to mobile
    cardsContainer = element.querySelector('.js-StoryblockValuePropositionMobile ul.js-StoryblockValuePropositionCards');
  }
  if (!cardsContainer) return;

  // Get all card <li> elements
  const cardLis = Array.from(cardsContainer.querySelectorAll(':scope > li'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards5)']);

  cardLis.forEach((li) => {
    // Each li contains a div.js-gaTracker (the card content)
    const card = li.querySelector('.js-gaTracker');
    if (!card) return;

    // Image/Icon: find the first <img> inside the card
    const img = card.querySelector('img');
    const imageCell = img ? img : '';

    // Text content: get all text nodes inside the text container
    const textContainer = card.querySelector('.flex.flex-col');
    let textCellContent = [];
    if (textContainer) {
      // Get all children (not just h3/p, but any text)
      Array.from(textContainer.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textCellContent.push(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // preserve any direct text
          textCellContent.push(document.createTextNode(node.textContent));
        }
      });
    }
    // If nothing found, fallback to the card div itself
    if (textCellContent.length === 0) textCellContent = [card.cloneNode(true)];

    rows.push([imageCell, textCellContent]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
