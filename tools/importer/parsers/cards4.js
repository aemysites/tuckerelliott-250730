/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns (cards)
  const columns = Array.from(element.children).filter(
    (c) => c.classList.contains('parsys_column')
  );

  // Initialize table rows
  const rows = [['Cards (cards4)']];

  columns.forEach((col) => {
    // 1. Find the image element
    let imgEl = col.querySelector('img');

    // 2. Find the heading/subtitle (from dark branded area)
    let subtitle = '';
    const branded = col.querySelector('.container.compact.dark.branded');
    if (branded) {
      const parsys = branded.querySelector('.par.parsys');
      if (parsys) {
        // Try to find a <span class="tile-description"> or just the first <p>
        const descSpan = parsys.querySelector('.tile-description');
        if (descSpan) {
          subtitle = descSpan.outerHTML;
        } else {
          const p = parsys.querySelector('p');
          if (p) subtitle = p.innerHTML;
        }
      }
    } else {
      // fallback: get the first <p> in column if exists
      const firstP = col.querySelector('p');
      if (firstP) subtitle = firstP.innerHTML;
    }

    // 3. Main text content:
    let mainText = '';
    // Try tile-title first
    let tileTitle = col.querySelector('.tile-title');
    if (!tileTitle) tileTitle = col.querySelector('.body-heading');
    if (tileTitle) {
      mainText += tileTitle.outerHTML;
    } else {
      // fallback: first <p> in .text after image
      let mainTextP = null;
      // Find all direct children (to locate image and next text after it)
      const directSections = Array.from(col.querySelectorAll(':scope > div'));
      const imageSectionIdx = directSections.findIndex((d) => d.classList.contains('image'));
      if (imageSectionIdx !== -1) {
        // try next text section after image
        for (let i = imageSectionIdx + 1; i < directSections.length; i++) {
          if (directSections[i].classList.contains('text')) {
            const p = directSections[i].querySelector('p');
            if (p) {
              mainTextP = p;
              break;
            }
          }
        }
      }
      if (!mainTextP) {
        // fallback: any <p> in col
        mainTextP = col.querySelector('p');
      }
      if (mainTextP) mainText += mainTextP.outerHTML;
    }

    // 4. CTA link (if present)
    const btn = col.querySelector('.btn a');

    // Build text cell content
    let textCellContent = [];
    if (subtitle) {
      const subtitleDiv = document.createElement('div');
      subtitleDiv.innerHTML = subtitle;
      textCellContent.push(subtitleDiv);
    }
    if (mainText) {
      const mainDiv = document.createElement('div');
      mainDiv.innerHTML = mainText;
      textCellContent.push(mainDiv);
    }
    if (btn) {
      // Reference the actual anchor element (not cloning)
      textCellContent.push(btn);
    }

    // If no subtitle, mainText, or btn, fallback to raw text content in card
    if (!subtitle && !mainText && !btn) {
      const fallbackText = col.textContent.trim();
      if (fallbackText) textCellContent.push(document.createTextNode(fallbackText));
    }

    // Row: [image, text cell]
    rows.push([imgEl, textCellContent]);
  });
  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
