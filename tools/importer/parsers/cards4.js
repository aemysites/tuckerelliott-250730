/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards4) block: 2 columns, each row is a card
  const headerRow = ['Cards (cards4)'];

  // Find image (first column)
  const imageContainer = element.querySelector('.ArticleItem__image');
  let imageEl = null;
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find text content (second column)
  const contentContainer = element.querySelector('.ArticleItem__content');
  let cardTextContent = [];
  if (contentContainer) {
    // Title (as heading)
    const titleLink = contentContainer.querySelector('.ArticleItem__title');
    if (titleLink) {
      // Use the text inside <pre> as heading
      const pre = titleLink.querySelector('pre');
      if (pre) {
        const heading = document.createElement('h3');
        heading.textContent = pre.textContent.trim();
        cardTextContent.push(heading);
      }
    }
    // Date + category
    const info = contentContainer.querySelector('.ArticleItem__info');
    if (info) {
      // Combine date and category
      const infoSpan = info.querySelector('.ArticleItem__info__date');
      let infoText = '';
      if (infoSpan) {
        infoText += infoSpan.textContent.trim();
      }
      // Find the next sibling span for category
      const categorySpan = infoSpan && infoSpan.nextElementSibling;
      if (categorySpan) {
        infoText += ' ' + categorySpan.textContent.trim();
      }
      if (infoText) {
        const meta = document.createElement('p');
        meta.textContent = infoText;
        cardTextContent.push(meta);
      }
    }
    // Description
    const excerpt = contentContainer.querySelector('.ArticleItem__excerpt');
    if (excerpt) {
      cardTextContent.push(excerpt);
    }
    // CTA (call-to-action)
    const ctaWrapper = contentContainer.querySelector('.ArticleItem__ctaWrapper');
    if (ctaWrapper) {
      const ctaLink = ctaWrapper.querySelector('.ArticleItem__cta');
      if (ctaLink) {
        // Only keep the label span, not the arrow image
        const labelSpan = ctaLink.querySelector('.ArticleItem__ctaLabel');
        if (labelSpan) {
          const link = document.createElement('a');
          link.href = ctaLink.href;
          link.textContent = labelSpan.textContent.trim();
          cardTextContent.push(link);
        }
      }
    }
  }

  // Build table rows
  const rows = [headerRow];
  rows.push([
    imageEl || '',
    cardTextContent
  ]);

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
