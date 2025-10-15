/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards5) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find all card containers (each is a direct child div with anchor)
  const cardDivs = Array.from(element.children).filter(div =>
    div.querySelector('a.CardRegular')
  );

  cardDivs.forEach(div => {
    const cardLink = div.querySelector('a.CardRegular');
    if (!cardLink) return;

    // IMAGE CELL: Find the image (always inside .CardRegular__image)
    let imageEl = null;
    const imageContainer = cardLink.querySelector('.CardRegular__image');
    if (imageContainer) {
      // Use the <img> inside <picture>
      const img = imageContainer.querySelector('img');
      if (img) imageEl = img;
    }

    // TEXT CELL: Compose text content
    const body = cardLink.querySelector('.CardRegular__body');
    let textCellContent = [];
    if (body) {
      // Category label
      const headline = body.querySelector('.CardRegular__headline');
      if (headline) {
        const catDiv = document.createElement('div');
        catDiv.textContent = headline.textContent.trim();
        catDiv.style.fontSize = '0.75em';
        catDiv.style.fontWeight = 'bold';
        catDiv.style.textTransform = 'uppercase';
        textCellContent.push(catDiv);
      }
      // Title (h2)
      const title = body.querySelector('.CardRegular__title');
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent.trim();
        textCellContent.push(h2);
      }
      // Description (h3)
      const teaser = body.querySelector('.CardRegular__teaser');
      if (teaser) {
        const desc = document.createElement('p');
        desc.textContent = teaser.textContent.trim();
        textCellContent.push(desc);
      }
      // Date
      const date = body.querySelector('.CardRegular__date');
      if (date) {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = date.textContent.trim();
        dateDiv.style.fontSize = '0.75em';
        dateDiv.style.color = '#888';
        textCellContent.push(dateDiv);
      }
    }

    // Wrap text cell in a link to the card if present
    let textCell = textCellContent;
    if (cardLink.href) {
      const link = document.createElement('a');
      link.href = cardLink.href;
      link.append(...textCellContent);
      textCell = [link];
    }

    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
