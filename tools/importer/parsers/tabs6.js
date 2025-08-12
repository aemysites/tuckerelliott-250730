/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header is exactly 'Tabs'
  const rows = [['Tabs']];

  // 2. Get tab labels and tab panels
  // Tab labels: .nav-links .mod-tabs > li > .tab-title
  const tabNavList = element.querySelector('.nav-links ul.mod-tabs');
  let tabLabels = [];
  if (tabNavList) {
    tabLabels = Array.from(tabNavList.querySelectorAll('li')).map(li => {
      const titleEl = li.querySelector('.tab-title');
      return titleEl ? titleEl.textContent.trim() : li.textContent.trim();
    });
  }

  // Tab panels: .mod-tabs-content .tab.parbase > section
  const tabPanels = Array.from(element.querySelectorAll('.mod-tabs-content .tab.parbase > section'));

  // 3. Edge case: mismatch of labels and panels, try fallback
  if (tabLabels.length !== tabPanels.length) {
    // Try to get from aria-labelledby
    tabLabels = tabPanels.map(panel => {
      const labelledBy = panel.getAttribute('aria-labelledby');
      if (labelledBy) {
        const navLi = element.querySelector(`#${labelledBy}`);
        if (navLi) {
          const titleEl = navLi.querySelector('.tab-title');
          return titleEl ? titleEl.textContent.trim() : navLi.textContent.trim();
        }
      }
      return panel.getAttribute('id') || '';
    });
  }

  // 4. For each panel, extract the tab content (reference content elements directly)
  for (let i = 0; i < tabPanels.length; i++) {
    const label = tabLabels[i] || `Tab ${i+1}`;
    const panel = tabPanels[i];

    // Content: get .parsys inside section (usually only one)
    // Inside parsys, there is a styledcontainer > .container > .par.parsys
    // We'll grab all elements inside all .par.parsys (excluding verticalspacer and empty backgrounds)
    const parsys = panel.querySelector('.parsys');
    let contentElems = [];
    if (parsys) {
      const styledContainers = Array.from(parsys.querySelectorAll('.styledcontainer .container .par.parsys'));
      for (const parParsys of styledContainers) {
        Array.from(parParsys.children).forEach(child => {
          if (child.classList.contains('verticalspacer')) return;
          contentElems.push(child);
        });
      }
    }
    // Safety fallback
    if (contentElems.length === 0 && parsys) {
      Array.from(parsys.children).forEach(child => {
        if (child.classList.contains('verticalspacer')) return;
        contentElems.push(child);
      });
    }
    if (contentElems.length === 0) {
      // Fallback to all content in section as text
      contentElems.push(document.createTextNode(panel.textContent.trim()));
    }
    // Remove completely empty text nodes
    contentElems = contentElems.filter(el => {
      if (el.nodeType === Node.TEXT_NODE) return el.textContent.trim() !== '';
      if (el.nodeType === Node.ELEMENT_NODE) return el.textContent.trim() !== '';
      return true;
    });
    let contentCell = contentElems.length === 1 ? contentElems[0] : contentElems;
    rows.push([label, contentCell]);
  }

  // 5. Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
