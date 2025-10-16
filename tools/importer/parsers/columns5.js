/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: clone and clean an element
  function cloneClean(el) {
    if (!el) return null;
    const clone = el.cloneNode(true);
    Array.from(clone.querySelectorAll('script, style')).forEach(e => e.remove());
    return clone;
  }

  // Find the main flex container for columns
  const mainContent = element.querySelector('.mx-auto');
  let leftColContent = [], planColContent = [], destColContent = [], vvColContent = [], connectColContent = [], policiesColContent = [];

  if (mainContent) {
    const flexRow = Array.from(mainContent.children).find(c => c.classList && c.classList.contains('flex'));
    if (flexRow) {
      // Find the nav and the two main column divs
      const nav = flexRow.querySelector('nav');
      const colDivs = Array.from(flexRow.children).filter(c => c.tagName === 'DIV');
      // --- COLUMN 1: Branding, Awards, Currency, App, Copyright ---
      const leftCol = colDivs[0];
      if (leftCol) {
        // Logo
        const logoA = leftCol.querySelector('.flex.justify-center a');
        if (logoA) leftColContent.push(cloneClean(logoA));
        // Awards
        const awards = leftCol.querySelector('.flex.justify-center ul');
        if (awards) leftColContent.push(cloneClean(awards));
        // Currency
        const currencyLabel = Array.from(leftCol.querySelectorAll('label')).find(l => l.textContent.includes('Currency:'));
        if (currencyLabel) leftColContent.push(cloneClean(currencyLabel));
        // App links
        const appDiv = Array.from(leftCol.querySelectorAll('div')).find(d => d.textContent.includes('Get our app:'));
        if (appDiv) leftColContent.push(cloneClean(appDiv));
        // Copyright
        const copyright = Array.from(leftCol.querySelectorAll('p')).find(p => p.textContent.includes('©'));
        if (copyright) leftColContent.push(cloneClean(copyright));
      }
      // --- COLUMN 2, 3, 4: Navigation Accordions ---
      if (nav) {
        const accordions = nav.querySelectorAll('.js-FooterAccordion');
        // Plan a Voyage
        if (accordions[0]) {
          const heading = accordions[0].querySelector('p.font-bold, p.hidden, button, span.font-bold');
          if (heading) planColContent.push(cloneClean(heading));
          const list = accordions[0].querySelector('ul');
          if (list) planColContent.push(cloneClean(list));
        }
        // Destinations
        if (accordions[1]) {
          const heading = accordions[1].querySelector('p.font-bold, p.hidden, button, span.font-bold');
          if (heading) destColContent.push(cloneClean(heading));
          const list = accordions[1].querySelector('ul');
          if (list) destColContent.push(cloneClean(list));
        }
        // Virgin Voyages
        if (accordions[2]) {
          const heading = accordions[2].querySelector('p.font-bold, p.hidden, button, span.font-bold');
          if (heading) vvColContent.push(cloneClean(heading));
          const list = accordions[2].querySelector('ul');
          if (list) vvColContent.push(cloneClean(list));
        }
      }
      // --- COLUMN 5: Stay Connected ---
      const connectCol = colDivs[1];
      if (connectCol) {
        // Heading
        const heading = connectCol.querySelector('p.font-bold');
        if (heading) connectColContent.push(cloneClean(heading));
        // Form
        const form = connectCol.querySelector('form');
        if (form) connectColContent.push(cloneClean(form));
        // Social icons
        const socialUl = Array.from(connectCol.querySelectorAll('ul')).find(ul => {
          return Array.from(ul.querySelectorAll('a')).some(a => {
            const href = a.getAttribute('href') || '';
            return href.includes('instagram') || href.includes('facebook') || href.includes('twitter') || href.includes('tiktok') || href.includes('youtube');
          });
        });
        if (socialUl) connectColContent.push(cloneClean(socialUl));
      }
    }
  }

  // --- BOTTOM ROW: Policies ---
  // Group all policy links into five columns for the policies row
  const allAccordions = element.querySelectorAll('.js-FooterAccordion');
  let policiesLinks = [];
  if (allAccordions.length) {
    const lastAccordion = Array.from(allAccordions).reverse().find(acc => acc.querySelector('ul'));
    if (lastAccordion) {
      const policiesUl = lastAccordion.querySelector('ul');
      if (policiesUl) {
        const links = Array.from(policiesUl.querySelectorAll('a, button'));
        // Split into five roughly equal groups
        const groupSize = Math.ceil(links.length / 5);
        for (let i = 0; i < 5; i++) {
          const group = links.slice(i * groupSize, (i + 1) * groupSize).map(link => cloneClean(link));
          policiesLinks.push(group);
        }
      }
    }
  }

  // --- Compose table ---
  const headerRow = ['Columns (columns5)'];
  const columnsRow = [
    leftColContent,
    planColContent,
    destColContent,
    vvColContent,
    connectColContent
  ];
  // Policies row: five columns, each with a group of links
  const cells = [
    headerRow,
    columnsRow,
    policiesLinks
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
