/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel3) block
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];

  const heroContent = element.querySelector('.HeroV30__content');
  if (!heroContent) return;

  const slides = heroContent.querySelectorAll('.js-HeroSlide');
  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const pic = slide.querySelector('picture img');
    if (pic) {
      imgEl = pic;
    } else {
      const vid = slide.querySelector('video');
      if (vid && vid.poster) {
        imgEl = document.createElement('img');
        imgEl.src = vid.poster;
      }
    }
    if (!imgEl) return;

    // --- TEXT CELL ---
    let textCellContent = [];
    const promoBanner = slide.querySelector('.js-SmallHeroBanner');
    if (promoBanner) {
      // Find the promo text lines
      const promoTextContainer = promoBanner.querySelector('.flex.flex-col');
      if (promoTextContainer) {
        // Compose headline from all text inside first span (including nested)
        const promoSpans = promoTextContainer.querySelectorAll('span');
        let headlineText = '';
        let subtextText = '';
        if (promoSpans.length > 0) {
          // Headline: join all text from nested spans and direct text
          headlineText = Array.from(promoSpans[0].querySelectorAll('span')).map(n => n.textContent.trim()).join(' ');
          if (!headlineText) headlineText = promoSpans[0].textContent.trim();
        }
        // Subtext: join all text from the second span (if present)
        if (promoSpans.length > 1) {
          subtextText = Array.from(promoSpans[1].childNodes).map(n => n.textContent.trim()).filter(Boolean).join(' ');
          if (!subtextText) subtextText = promoSpans[1].textContent.trim();
        }
        if (headlineText) {
          const headline = document.createElement('h2');
          headline.textContent = headlineText;
          textCellContent.push(headline);
        }
        if (subtextText) {
          const subtext = document.createElement('p');
          subtext.textContent = subtextText;
          textCellContent.push(subtext);
        }
      }
      // CTA
      const cta = promoBanner.querySelector('a');
      if (cta) {
        textCellContent.push(cta);
      }
    }
    rows.push([imgEl, textCellContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
