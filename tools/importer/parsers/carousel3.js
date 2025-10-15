/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image
  const heroImg = element.querySelector('.Multimedia img, .Picture img') || element.querySelector('img');

  // Find the promo banner
  const promoBanner = element.querySelector('.js-SmallHeroBanner');

  // Extract promo text content (deduplicate and structure correctly)
  let promoContent = [];
  if (promoBanner) {
    // Headline: combine colored and regular parts
    const headlineContainer = promoBanner.querySelector('span');
    let headlineText = '';
    if (headlineContainer) {
      // Get all direct children spans inside the main span
      const headlineSpans = headlineContainer.querySelectorAll('span');
      headlineText = Array.from(headlineSpans).map(span => span.textContent.trim()).join(' ');
      if (headlineText) {
        const h2 = document.createElement('h2');
        h2.textContent = headlineText;
        promoContent.push(h2);
      }
    }
    // Subtext: the next span after the headlineContainer
    let subtext = null;
    if (headlineContainer && headlineContainer.parentNode) {
      const siblings = Array.from(headlineContainer.parentNode.children);
      const headlineIdx = siblings.indexOf(headlineContainer);
      if (headlineIdx > -1 && siblings.length > headlineIdx + 1) {
        subtext = siblings[headlineIdx + 1];
      }
    }
    if (subtext && subtext.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = subtext.textContent.trim();
      promoContent.push(p);
    }
    // CTA (SHOP NOW) - only as a link
    const cta = promoBanner.querySelector('a');
    if (cta && cta.textContent.trim()) {
      const link = document.createElement('a');
      link.textContent = cta.textContent.trim();
      link.href = cta.href;
      promoContent.push(link);
    }
  }

  // Compose table rows
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];
  if (heroImg) {
    rows.push([
      heroImg,
      promoContent.length ? promoContent : ''
    ]);
  }

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
