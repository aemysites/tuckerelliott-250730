/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (must match block name exactly)
  const headerRow = ['Hero (hero7)'];

  // 2. Background image row: reference the <img> element from <picture>
  let bgImg = '';
  const picture = element.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) bgImg = img;
  }

  // 3. Content row: heading, subheading, CTA, and accessible text
  let contentCell = document.createElement('div');
  contentCell.style.display = 'contents'; // flatten for import

  // Heading (h4)
  const heading = element.querySelector('h4');
  if (heading) {
    const h = document.createElement('h4'); // preserve heading level
    h.innerHTML = heading.innerHTML;
    contentCell.appendChild(h);
  }
  // Subheading (p)
  const subheading = element.querySelector('h4 + p');
  if (subheading) {
    const p = document.createElement('p');
    p.textContent = subheading.textContent.trim(); // trim whitespace
    contentCell.appendChild(p);
  }
  // CTA (a)
  const cta = element.querySelector('a[href]');
  if (cta) {
    const ctaText = cta.querySelector('span.relative')?.textContent?.trim() || cta.textContent.trim();
    const a = document.createElement('a');
    a.href = cta.href;
    a.target = cta.target || undefined;
    a.textContent = ctaText;
    contentCell.appendChild(a);
    // Add visually hidden accessible text if present
    const srOnly = cta.querySelector('.sr-only');
    if (srOnly && srOnly.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = srOnly.textContent.trim();
      span.className = 'sr-only';
      contentCell.appendChild(span);
    }
  }
  // If nothing was added, leave empty
  if (!contentCell.childNodes.length) contentCell = '';

  // 4. Compose table rows
  const rows = [
    headerRow,
    [bgImg],
    [contentCell],
  ];

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the new block table
  element.replaceWith(table);
}
