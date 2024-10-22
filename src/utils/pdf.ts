import { PDFDocument, rgb } from 'pdf-lib';

export async function generatePDF(story: any) {
  const pdfDoc = await PDFDocument.create();
  const titlePage = pdfDoc.addPage();
  const { width, height } = titlePage.getSize();

  titlePage.drawText(story.title, {
    x: 50,
    y: height - 100,
    size: 50,
    color: rgb(0, 0, 0),
  });

  for (const page of story.pages) {
    const pdfPage = pdfDoc.addPage();
    pdfPage.drawText(page.content, {
      x: 50,
      y: height - 100,
      size: 20,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${story.title}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
