/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero4)
  const headerRow = ['Hero (hero4)'];

  // Find the main anchor (could be used for CTA, but here it wraps all content)
  const mainAnchor = element.querySelector('a.CardFeatured');

  // Find the image (background)
  let imageEl = null;
  if (mainAnchor) {
    const picture = mainAnchor.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img');
    }
  }

  // Find the label, category, date, headline, and teaser
  let labelEl = null, categoryEl = null, dateEl = null, headlineEl = null, teaserEl = null;
  if (mainAnchor) {
    const body = mainAnchor.querySelector('.CardFeatured__body');
    if (body) {
      labelEl = body.querySelector('.CardFeatured__label');
      const metaWrap = body.querySelector('.flex');
      if (metaWrap) {
        categoryEl = metaWrap.querySelector('.CardFeatured__headline');
        dateEl = metaWrap.querySelector('.CardFeatured__date');
      }
      headlineEl = body.querySelector('.CardFeatured__title');
      teaserEl = body.querySelector('.CardFeatured__teaser');
    }
  }

  // Compose the metadata row (label, category, date)
  const metaRow = document.createElement('div');
  metaRow.style.display = 'flex';
  metaRow.style.flexDirection = 'row';
  metaRow.style.gap = '0.75em';
  if (labelEl) metaRow.appendChild(labelEl);
  if (categoryEl) metaRow.appendChild(categoryEl);
  if (dateEl) metaRow.appendChild(dateEl);

  // Compose the text content row
  const textContent = document.createElement('div');
  textContent.style.display = 'flex';
  textContent.style.flexDirection = 'column';
  textContent.style.gap = '0.5em';
  if (metaRow.childNodes.length) textContent.appendChild(metaRow);
  if (headlineEl) textContent.appendChild(headlineEl);
  if (teaserEl) textContent.appendChild(teaserEl);

  // Table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [textContent]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
