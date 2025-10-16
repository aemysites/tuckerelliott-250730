/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Carousel (carousel9)'];

  // Find the carousel slides
  const slides = Array.from(
    element.querySelectorAll('.swiper-wrapper > .swiper-slide')
  );

  // Helper to extract image from slide
  function getImageCell(slide) {
    // Find the image inside the slide
    const img = slide.querySelector('.Multimedia img');
    return img || '';
  }

  // Helper to extract text content from slide
  function getTextCell(slide) {
    // Find the content column (left side)
    const contentCol = slide.querySelector(
      '.flex.flex-col.font-common.font-normal'
    );
    if (!contentCol) return '';

    // Extract title (p), heading (h2), description (p), and CTA (a)
    const title = contentCol.querySelector('p');
    const heading = contentCol.querySelector('h2');
    // Find the first paragraph after the heading
    let description = null;
    if (heading) {
      description = heading.nextElementSibling;
      if (description && description.tagName.toLowerCase() !== 'p') {
        description = null;
      }
    }
    // Find CTA link
    const cta = contentCol.querySelector('a');

    // Compose cell content
    const cellContent = [];
    if (title) cellContent.push(title);
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    if (cta) cellContent.push(cta);
    return cellContent.length ? cellContent : '';
  }

  // Build table rows for each slide
  const rows = slides.map(slide => [
    getImageCell(slide),
    getTextCell(slide)
  ]);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
