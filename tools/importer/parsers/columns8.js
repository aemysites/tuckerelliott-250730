/* global WebImporter */
export default function parse(element, { document }) {
  // --- COLUMN 1: Logo, awards, currency, app links, copyright ---
  const logoImg = element.querySelector('img');
  const awardsUl = Array.from(element.querySelectorAll('ul')).find(ul => ul.querySelector('img'));
  const currencyLabel = Array.from(element.querySelectorAll('label')).find(lab => lab.textContent.toLowerCase().includes('currency:'));
  let appLinks = null;
  const appLinksDiv = Array.from(element.querySelectorAll('div')).find(div => div.textContent.includes('Get our app:'));
  if (appLinksDiv) {
    appLinks = appLinksDiv;
  } else {
    appLinks = Array.from(element.querySelectorAll('ul')).find(ul => Array.from(ul.querySelectorAll('a')).some(a => /iOS|Android/i.test(a.textContent)));
  }
  const copyrightP = Array.from(element.querySelectorAll('p')).find(p => p.textContent.trim().startsWith('©'));

  // --- COLUMN 2: Plan a Voyage ---
  const planDiv = Array.from(element.querySelectorAll('.js-FooterAccordion')).find(div => /plan a voyage/i.test(div.textContent));
  let planHeading = '', planList = '';
  if (planDiv) {
    planHeading = planDiv.querySelector('p.font-bold') || planDiv.querySelector('span.font-bold') || planDiv.querySelector('button span.font-bold');
    planList = planDiv.querySelector('ul');
  }

  // --- COLUMN 3: Destinations ---
  const destDiv = Array.from(element.querySelectorAll('.js-FooterAccordion')).find(div => /destinations/i.test(div.textContent));
  let destHeading = '', destList = '';
  if (destDiv) {
    destHeading = destDiv.querySelector('p.font-bold') || destDiv.querySelector('span.font-bold') || destDiv.querySelector('button span.font-bold');
    destList = destDiv.querySelector('ul');
  }

  // --- COLUMN 4: Virgin Voyages ---
  const vvDiv = Array.from(element.querySelectorAll('.js-FooterAccordion')).find(div => /virgin voyages/i.test(div.textContent));
  let vvHeading = '', vvList = '';
  if (vvDiv) {
    vvHeading = vvDiv.querySelector('p.font-bold') || vvDiv.querySelector('span.font-bold') || vvDiv.querySelector('button span.font-bold');
    vvList = vvDiv.querySelector('ul');
  }

  // --- COLUMN 5: Stay Connected ---
  const stayDiv = Array.from(element.querySelectorAll('div')).find(div => /stay connected/i.test(div.textContent));
  let stayHeading = '', newsletterForm = '', consentLabel = '', socialUl = '';
  if (stayDiv) {
    stayHeading = stayDiv.querySelector('p.font-bold');
    newsletterForm = stayDiv.querySelector('form');
    if (newsletterForm) consentLabel = newsletterForm.querySelector('label.form-checkbox');
    socialUl = Array.from(stayDiv.querySelectorAll('ul')).find(ul => Array.from(ul.querySelectorAll('a')).some(a => /instagram|facebook|twitter|tiktok|youtube/i.test(a.href)));
  }

  // --- BOTTOM ROW: Policies ---
  const policyDiv = Array.from(element.querySelectorAll('.js-FooterAccordion')).find(div => /polic/i.test(div.textContent));
  let policiesUl = '';
  if (policyDiv) policiesUl = policyDiv.querySelector('ul');

  // --- BUILD TABLE ---
  const headerRow = ['Columns (columns8)'];
  const columnsRow = [
    [logoImg, awardsUl, currencyLabel, appLinks, copyrightP].filter(Boolean),
    [planHeading, planList].filter(Boolean),
    [destHeading, destList].filter(Boolean),
    [vvHeading, vvList].filter(Boolean),
    [stayHeading, newsletterForm, consentLabel, socialUl].filter(Boolean)
  ];
  const bottomRow = [policiesUl ? policiesUl : ''];
  const cells = [headerRow, columnsRow, bottomRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
