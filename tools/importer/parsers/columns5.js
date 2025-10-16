/* global WebImporter */
export default function parse(element, { document }) {
  // Find the flex row containing two columns
  // The first .flex with at least two children, one with h2 and one with img
  let columns = null;
  const flexDivs = element.querySelectorAll('div');
  for (const div of flexDivs) {
    const children = Array.from(div.children);
    if (
      children.length >= 2 &&
      children[0].querySelector('h2') &&
      children[1].querySelector('img')
    ) {
      columns = [children[0], children[1]];
      break;
    }
  }
  if (!columns) return;

  // --- Left Column (Text) ---
  const leftCol = columns[0];
  // Find the main content container
  let leftContent = leftCol.querySelector('div');
  if (!leftContent) leftContent = leftCol;

  // Extract Tier label (small heading)
  const tierLabel = leftContent.querySelector('div');
  // Extract main heading (h2)
  const mainHeading = leftContent.querySelector('h2');
  // Extract subheading (first p)
  const subheading = leftContent.querySelector('div > p, p');
  // Extract main paragraph (second p)
  const paragraphs = leftContent.querySelectorAll('div > p, p');
  const mainPara = paragraphs.length > 1 ? paragraphs[1] : null;

  // Compose left column cell
  const leftCell = document.createElement('div');
  if (tierLabel) leftCell.appendChild(tierLabel.cloneNode(true));
  if (mainHeading) leftCell.appendChild(mainHeading.cloneNode(true));
  if (subheading) leftCell.appendChild(subheading.cloneNode(true));
  if (mainPara) leftCell.appendChild(mainPara.cloneNode(true));

  // --- Right Column (Image) ---
  const rightCol = columns[1];
  const img = rightCol.querySelector('img');
  let rightCell;
  if (img) {
    rightCell = img.cloneNode(true);
  } else {
    rightCell = document.createElement('div');
  }

  // --- Table Construction ---
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace element
  element.replaceWith(table);
}
