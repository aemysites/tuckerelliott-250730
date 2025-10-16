/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Carousel (carousel4)'];

  // 2. Slide row extraction
  // Image: .ArticleItem__image img
  const innerDiv = getChildByClass(element, 'ArticleItem__inner');
  const imageDiv = innerDiv && getChildByClass(innerDiv, 'ArticleItem__image');
  const img = imageDiv ? imageDiv.querySelector('img') : null;

  // Text content: .ArticleItem__content
  const contentDiv = innerDiv && getChildByClass(innerDiv, 'ArticleItem__content');
  let textContent = null;
  if (contentDiv) {
    // We'll build a fragment for the right cell
    const frag = document.createDocumentFragment();
    // Title (as heading)
    const titleLink = contentDiv.querySelector('.ArticleItem__title');
    if (titleLink) {
      const h2 = document.createElement('h2');
      h2.textContent = titleLink.textContent.trim();
      frag.appendChild(h2);
    }
    // Metadata (date and type)
    const infoDiv = contentDiv.querySelector('.ArticleItem__info');
    if (infoDiv) {
      const meta = document.createElement('div');
      meta.textContent = infoDiv.textContent.replace(/\s+/g, ' ').trim();
      meta.style.fontSize = 'smaller';
      frag.appendChild(meta);
    }
    // Description
    const excerpt = contentDiv.querySelector('.ArticleItem__excerpt');
    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt.textContent.trim();
      frag.appendChild(p);
    }
    // CTA (arrow link)
    const cta = contentDiv.querySelector('.ArticleItem__cta');
    if (cta) {
      const label = cta.querySelector('.ArticleItem__ctaLabel');
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = label ? label.textContent.trim() : 'Read more';
      frag.appendChild(link);
    }
    textContent = frag;
  }

  const slideRow = [img, textContent];

  // 3. Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    slideRow
  ], document);

  // 4. Replace element
  element.replaceWith(table);
}
