/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel3) block: 2 columns, first row is header, each row is a slide (image | text content)
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];

  // Find the image (first column)
  let imageEl = null;
  const imageDiv = element.querySelector('.ArticleItem__image');
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Compose the text content (second column)
  const contentDiv = element.querySelector('.ArticleItem__content');
  const textContent = document.createElement('div');
  if (contentDiv) {
    // Press Release label (optional small heading)
    const signpost = contentDiv.querySelector('.signpost');
    if (signpost) {
      const small = document.createElement('div');
      small.append(signpost.cloneNode(true));
      textContent.appendChild(small);
    }
    // Title (h2 or pre inside link)
    const titleLink = contentDiv.querySelector('.ArticleItem__title');
    if (titleLink) {
      const pre = titleLink.querySelector('pre');
      if (pre) {
        const h2 = document.createElement('h2');
        h2.textContent = pre.textContent.trim();
        textContent.appendChild(h2);
      }
    }
    // Date
    const dateSpan = contentDiv.querySelector('.ArticleItem__info__date');
    if (dateSpan) {
      const dateDiv = document.createElement('div');
      dateDiv.textContent = dateSpan.textContent.trim();
      textContent.appendChild(dateDiv);
    }
    // CTA (Read story)
    const cta = element.querySelector('.ArticleItem__cta');
    if (cta) {
      // Use the anchor, but only keep the label (remove the icon)
      const ctaClone = cta.cloneNode(true);
      // Remove the icon span if present
      const icon = ctaClone.querySelector('.Icon');
      if (icon) icon.remove();
      textContent.appendChild(ctaClone);
    }
  }

  // Build the slide row
  rows.push([
    imageEl,
    textContent.childNodes.length ? textContent : ''
  ]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
