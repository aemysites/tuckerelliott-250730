/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards17) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards17)'];

  // 2. Find all card elements (each direct child div of the flex container)
  const flexContainer = element.querySelector('div');
  if (!flexContainer) return;

  // Each card is a direct child div of the flexContainer
  const cardDivs = Array.from(flexContainer.children).filter(
    (child) => child.tagName === 'DIV'
  );

  // 3. For each card, extract image/icon, title, description, and price (price as a visually separated <p> at the end)
  const rows = cardDivs.map((cardDiv) => {
    // Image/Icon: first img inside cardDiv
    const img = cardDiv.querySelector('img');

    // Find the text container (div with h3 and p)
    let textContainer = null;
    const possibleTextContainers = Array.from(cardDiv.querySelectorAll('div'));
    for (const div of possibleTextContainers) {
      if (div.querySelector('h3') && div.querySelector('p')) {
        textContainer = div;
        break;
      }
    }
    if (!textContainer) textContainer = cardDiv;

    // Title (h3), Description (first part of p), Price (last line of p, after last <br>)
    const h3 = textContainer.querySelector('h3');
    const p = textContainer.querySelector('p');
    let description = null;
    let price = null;
    if (p) {
      // Split at last <br> or <br><br>
      const html = p.innerHTML;
      // Try double <br> first
      let splitIdx = html.lastIndexOf('<br> <br>');
      let offset = 9;
      if (splitIdx === -1) {
        splitIdx = html.lastIndexOf('<br><br>');
        offset = 8;
      }
      if (splitIdx === -1) {
        splitIdx = html.lastIndexOf('<br>');
        offset = 4;
      }
      if (splitIdx !== -1) {
        description = document.createElement('p');
        description.innerHTML = html.substring(0, splitIdx).trim();
        price = document.createElement('p');
        price.innerHTML = html.substring(splitIdx + offset).replace(/<br>/g, '').trim();
      } else {
        description = p;
      }
    }

    // Compose text cell: title, description, price (if present)
    const cellContent = [];
    if (h3) cellContent.push(h3);
    if (description) cellContent.push(description);
    if (price) cellContent.push(price);

    return [img, cellContent];
  });

  // 4. Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
