/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero7)'];

  // --- Row 2: Background Image ---
  // Find the main image inside <picture>
  let img = element.querySelector('picture img');
  // Defensive: fallback if not found
  if (!img) {
    img = element.querySelector('img');
  }
  // Only include if image exists
  const imageRow = [img ? img : ''];

  // --- Row 3: Content (Heading, Subheading, CTA) ---
  // Find the container with text and CTA
  const contentContainer = element.querySelector('.flex.flex-col.h-full');
  let contentElements = [];
  if (contentContainer) {
    // Find heading (h4)
    const heading = contentContainer.querySelector('h4');
    if (heading) contentElements.push(heading);

    // Find subheading (p)
    const subheading = contentContainer.querySelector('p');
    if (subheading && subheading.textContent.trim()) {
      contentElements.push(subheading);
    }

    // Find CTA link (a)
    const cta = contentContainer.querySelector('a[href]');
    if (cta) contentElements.push(cta);
  }

  // Defensive: If not found, try to find heading/cta in the whole element
  if (contentElements.length === 0) {
    const heading = element.querySelector('h4');
    if (heading) contentElements.push(heading);
    const subheading = element.querySelector('p');
    if (subheading && subheading.textContent.trim()) {
      contentElements.push(subheading);
    }
    const cta = element.querySelector('a[href]');
    if (cta) contentElements.push(cta);
  }

  // Compose row 3
  const contentRow = [contentElements.length ? contentElements : ''];

  // Build the table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
