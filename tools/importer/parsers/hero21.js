/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero21)'];

  // --- Row 2: Background Image ---
  // Find the image inside the <picture> element
  let imageEl = null;
  const picture = element.querySelector('picture');
  if (picture) {
    imageEl = picture.querySelector('img');
  }

  // If no image found, leave cell empty
  const imageRow = [imageEl ? imageEl : ''];

  // --- Row 3: Text Content ---
  // Find the main heading and subheading
  let headingEl = null;
  let subheadingEl = null;

  // The heading is the <h1> inside the hero
  headingEl = element.querySelector('h1');
  // The subheading is a <p> immediately after the heading
  if (headingEl) {
    // Try to find the next sibling <p>
    let next = headingEl.nextElementSibling;
    if (next && next.tagName.toLowerCase() === 'p') {
      subheadingEl = next;
    } else {
      // Or just grab any <p> in the block if not direct sibling
      subheadingEl = element.querySelector('p');
    }
  }

  // No CTA found in source HTML, but if there were, we'd look for <a> or <button>
  // For this block, only heading and subheading are present
  const contentRow = [
    [
      headingEl ? headingEl : '',
      subheadingEl ? subheadingEl : ''
    ].filter(Boolean) // Only include if present
  ];

  // Assemble table rows
  const rows = [headerRow, imageRow, contentRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
