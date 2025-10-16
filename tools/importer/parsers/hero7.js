/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get background image (img inside picture)
  let bgImg = null;
  const multimedia = element.querySelector('.Multimedia');
  if (multimedia) {
    const picture = multimedia.querySelector('picture');
    if (picture) {
      bgImg = picture.querySelector('img');
    }
  }

  // Helper: Get hero content container
  const heroContent = element.querySelector('.js-HeroContent');

  // Extract heading (h1) - even if empty, include the element if present
  let heading = null;
  if (heroContent) {
    const h1 = heroContent.querySelector('h1');
    if (h1) heading = h1;
  }

  // Extract subheading (span)
  let subheading = null;
  if (heroContent) {
    subheading = heroContent.querySelector('span');
  }

  // Extract CTA (link with arrow image)
  let cta = null;
  if (heroContent) {
    const ctaLink = heroContent.querySelector('a');
    if (ctaLink) {
      const ctaContent = [];
      // If the link has visible text (not sr-only), use it
      const visibleText = ctaLink.querySelector('span:not(.sr-only)');
      if (visibleText) ctaContent.push(visibleText);
      // Always include the link's children (e.g., arrow image)
      Array.from(ctaLink.childNodes).forEach((node) => {
        if (node.nodeType === 1 && node.tagName.toLowerCase() === 'img') {
          ctaContent.push(node);
        }
      });
      // If sr-only span exists, use its text as link text
      const srOnly = ctaLink.querySelector('.sr-only');
      if (srOnly && !visibleText) ctaContent.unshift(srOnly);
      // Compose the link
      const link = document.createElement('a');
      link.href = ctaLink.getAttribute('href') || '';
      ctaContent.forEach((child) => link.appendChild(child.cloneNode(true)));
      cta = link;
    }
  }

  // Compose content cell for row 3 (include heading even if empty)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // Table rows
  const rows = [
    ['Hero (hero7)'],
    [bgImg ? bgImg : ''],
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
