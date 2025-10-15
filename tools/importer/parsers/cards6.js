/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block parser
  // Fix: For each card, always include a colored banner at the top (price OR special banner), never omit both

  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find all .js-DetailCard anchors in the subtree (not just visible ones)
  const allCards = element.querySelectorAll('a.js-DetailCard');

  allCards.forEach((cardLink) => {
    // --- IMAGE CELL ---
    const img = cardLink.querySelector('img');
    const imageCell = img ? img : document.createTextNode('');

    // --- TEXT CELL ---
    const textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';
    textCell.style.gap = '0.5em';

    // 1. Price Banner OR Special Banner (always include one)
    const priceBanner = cardLink.querySelector('.js-DetailCardPrice');
    let bannerText = '';
    if (priceBanner && priceBanner.textContent.trim()) {
      bannerText = priceBanner.textContent.trim();
    }
    // If price banner is empty, check for special banner
    let specialBanner = null;
    if (priceBanner && priceBanner.nextElementSibling && priceBanner.nextElementSibling.tagName === 'SECTION') {
      specialBanner = priceBanner.nextElementSibling;
      if (!bannerText && specialBanner.textContent.trim()) {
        bannerText = specialBanner.textContent.trim();
      }
    }
    // If there is a banner (price or special), always include it
    if (bannerText) {
      const bannerDiv = document.createElement('div');
      bannerDiv.textContent = bannerText;
      bannerDiv.style.fontWeight = 'bold';
      bannerDiv.style.background = '#6C3483';
      bannerDiv.style.color = '#fff';
      bannerDiv.style.padding = '0.4em 0.8em';
      bannerDiv.style.borderRadius = '0.5em';
      bannerDiv.style.marginBottom = '0.5em';
      textCell.appendChild(bannerDiv);
    }

    // 2. Title (h2)
    const heading = cardLink.querySelector('.js-DetailCardHeading');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      textCell.appendChild(h2);
    }

    // 3. Description (ports list)
    const ports = cardLink.querySelector('.js-DetailCardPorts');
    if (ports) {
      const spans = Array.from(ports.querySelectorAll('span'));
      const portText = spans
        .filter((span) => !span.getAttribute('role'))
        .map((span) => span.textContent.trim())
        .filter(Boolean)
        .join(' • ');
      const desc = document.createElement('p');
      desc.textContent = portText;
      textCell.appendChild(desc);
    }

    // 4. Feature tags (ul > li > span)
    const tagsList = cardLink.querySelector('.js-DetailCardFooter ul');
    if (tagsList) {
      const tags = Array.from(tagsList.querySelectorAll('li > span'));
      if (tags.length) {
        const tagsContainer = document.createElement('div');
        tagsContainer.style.display = 'flex';
        tagsContainer.style.flexWrap = 'wrap';
        tagsContainer.style.gap = '0.5em';
        tags.forEach((tag) => {
          tagsContainer.appendChild(tag.cloneNode(true));
        });
        textCell.appendChild(tagsContainer);
      }
    }

    // 5. CTA Button (span with 'Explore Voyage' or similar)
    const ctaBtn = cardLink.querySelector('.js-DetailCardFooter > span');
    if (ctaBtn) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.textContent = ctaBtn.textContent.trim();
      ctaAnchor.href = cardLink.href || '#';
      ctaAnchor.target = cardLink.target || '_self';
      ctaAnchor.style.display = 'inline-block';
      ctaAnchor.style.marginTop = '1em';
      textCell.appendChild(ctaAnchor);
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
