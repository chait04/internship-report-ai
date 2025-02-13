// @ts-ignore
import html2pdf from 'html2pdf.js';

export async function generatePDF(content: string) {
  const options = {
    margin: 1,
    filename: 'report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  const element = document.createElement('div');
  element.innerHTML = content;
  element.style.padding = '20px';
  element.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  const blob = await html2pdf().set(options).from(element).outputPdf('blob');
  return blob;
}