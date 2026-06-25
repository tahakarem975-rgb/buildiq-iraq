import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function downloadElementAsPDF(el: HTMLElement, filename = "report.pdf") {
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgW = pageW - 20;
  const imgH = (canvas.height * imgW) / canvas.width;
  let heightLeft = imgH;
  let position = 10;
  pdf.addImage(imgData, "PNG", 10, position, imgW, imgH);
  heightLeft -= pageH - 20;
  while (heightLeft > 0) {
    pdf.addPage();
    position = 10 - (imgH - heightLeft);
    pdf.addImage(imgData, "PNG", 10, position, imgW, imgH);
    heightLeft -= pageH - 20;
  }
  pdf.save(filename);
}