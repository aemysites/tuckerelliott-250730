/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row must match exactly
  const headerRow = ['Columns (columns8)'];

  // 2. Find direct column wrappers (parsys_column children)
  const columnEls = Array.from(element.querySelectorAll(':scope > .parsys_column'));

  // Defensive check: If no columns, treat element as single cell
  if (!columnEls.length) {
    const tableArray = [headerRow, [element]];
    const block = WebImporter.DOMUtils.createTable(tableArray, document);
    element.replaceWith(block);
    return;
  }

  // 3. Each column: gather all relevant content
  const rowCells = columnEls.map((colEl) => {
    const contentEls = [];
    Array.from(colEl.children).forEach((section) => {
      // Skip vertical spacers
      if (section.classList.contains('verticalspacer')) return;

      // Handle image blocks
      if (section.classList.contains('imageajax')) {
        // Try to get the actual image element
        const img = section.querySelector('.ajaxImage img, img');
        if (img) {
          contentEls.push(img);
        }
        return;
      }

      // Handle button link blocks
      if (section.classList.contains('btn')) {
        const btnLink = section.querySelector('a');
        if (btnLink) {
          contentEls.push(btnLink);
        }
        return;
      }

      // Handle text blocks
      if (section.classList.contains('text')) {
        // Add all children of text block
        Array.from(section.querySelectorAll(':scope > div > *')).forEach((el) => {
          contentEls.push(el);
        });
        return;
      }

      // Fallback: add section if not empty (ignore empty divs)
      if (section.textContent.trim() || section.children.length) {
        contentEls.push(section);
      }
    });
    // Compose cell: if only one, use element directly, else array
    if (contentEls.length === 1) {
      return contentEls[0];
    }
    if (contentEls.length > 1) {
      return contentEls;
    }
    // If column is empty, insert a blank string to keep table alignment
    return '';
  });

  // 4. Compose table and replace element
  const tableArray = [headerRow, rowCells];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
