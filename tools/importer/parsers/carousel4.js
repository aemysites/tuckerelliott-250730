/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Carousel (carousel4)
  const headerRow = ['Carousel (carousel4)'];

  // Find image (first column)
  const imageLink = element.querySelector('.ArticleItem__image a');
  let imageEl = null;
  if (imageLink) {
    imageEl = imageLink.querySelector('img');
  }

  // Find content (second column)
  const contentDiv = element.querySelector('.ArticleItem__content');
  let contentCell = document.createElement('div');
  if (contentDiv) {
    // Title (as heading)
    const titleLink = contentDiv.querySelector('.ArticleItem__title');
    if (titleLink) {
      const pre = titleLink.querySelector('pre');
      if (pre) {
        const h2 = document.createElement('h2');
        h2.textContent = pre.textContent.trim();
        contentCell.appendChild(h2);
      }
    }
    // Info (date and category)
    const infoDiv = contentDiv.querySelector('.ArticleItem__info');
    if (infoDiv) {
      const infoSpan = infoDiv.cloneNode(true);
      contentCell.appendChild(infoSpan);
    }
    // Description
    const excerpt = contentDiv.querySelector('.ArticleItem__excerpt');
    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt.textContent.trim();
      contentCell.appendChild(p);
    }
    // CTA (arrow link)
    const cta = contentDiv.querySelector('.ArticleItem__cta');
    if (cta) {
      // Only keep the link text, not the icon
      const ctaLabel = cta.querySelector('.ArticleItem__ctaLabel');
      if (ctaLabel) {
        const a = document.createElement('a');
        a.href = cta.href;
        a.textContent = ctaLabel.textContent.trim();
        contentCell.appendChild(a);
      }
    }
  }

  // Build rows
  const rows = [
    headerRow,
    [imageEl, contentCell]
  ];

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
