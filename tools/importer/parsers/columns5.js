/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all top-level columns
  const columns = element.querySelectorAll(':scope > .parsys_column');
  const colCells = [];

  columns.forEach((col) => {
    // Only include visible/contentful child blocks (skip spacers, empty)
    const sections = Array.from(col.children)
      .filter(child => {
        // Exclude vertical spacers
        if (child.classList.contains('verticalspacer')) return false;
        // Exclude empty divs
        if (!child.textContent.trim() && !child.querySelector('img, picture, video, iframe')) return false;
        return true;
      });
    
    // Assemble all sections in order into a wrapper (if >1), or direct if just one
    let cellContent = null;
    if (sections.length === 1) {
      cellContent = sections[0];
    } else if (sections.length > 1) {
      const wrapper = document.createElement('div');
      sections.forEach(sec => wrapper.appendChild(sec));
      cellContent = wrapper;
    } else {
      // if truly empty, insert empty text node
      cellContent = document.createTextNode('');
    }
    colCells.push(cellContent);
  });

  // Always use the correct header as per block name
  const headerRow = ['Columns (columns5)'];
  const cells = [headerRow, colCells];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
