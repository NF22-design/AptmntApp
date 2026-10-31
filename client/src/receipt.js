import { jsPDF } from 'jspdf';

export function downloadReceipt(appt) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text('MediBook - Appointment Receipt', 20, 25);
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  doc.setFontSize(12);
  const rows = [
    ['Reference', String(appt.id)],
    ['Full name', appt.fullName],
    ['ID number', appt.govId],
    ['Clinic', appt.clinicName],
    ['Date', appt.date],
    ['Hour', appt.hour || 'Not specified'],
  ];
  rows.forEach(([label, value], i) => {
    const y = 45 + i * 12;
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(value, 65, y);
  });

  doc.setFontSize(10);
  doc.text('Please bring this receipt and your ID to the clinic.', 20, 125);
  doc.save(`receipt-${appt.fullName.replace(/\s+/g, '_')}.pdf`);
}