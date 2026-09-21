'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { data } from './data';

const JSPDF = () => {
  const renderPdf = () => {
    const div = document.getElementById('pdfdiv');
    console.log(div?.scrollWidth, div?.scrollHeight);

    html2canvas(div as HTMLElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      pdf.save('hehe.pdf');
    });
  };

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <button
        onClick={renderPdf}
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44'"
      >
        PDF
      </button>
      <div
        style={{ aspectRatio: '2480/3508' }}
        id='pdfdiv'
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
};

export default JSPDF;
