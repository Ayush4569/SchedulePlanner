import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const doc = new PDFDocument();
const outputPath = path.join(process.cwd(), 'test_schedule.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

doc.fontSize(24).text('Semester Study & Routine Info', { align: 'center' });
doc.moveDown();

doc.fontSize(16).text('1. Semester Subjects (Ordered by Priority/Difficulty):');
doc.fontSize(12).text('  - Hard Subject: Distributed Systems & Cloud Computing (High coding load, complex theories)');
doc.text('  - Hard Subject: Cryptography & Network Security (Heavy math, algorithms)');
doc.text('  - Medium Subject: Database Management Systems (SQL and normalizations, moderate load)');
doc.text('  - Medium Subject: Software Engineering Methods (Design patterns, moderate coding)');
doc.text('  - Easy Subject: Professional Ethics (Conceptual, low study hours needed)');
doc.moveDown();

doc.fontSize(16).text('2. Daily Schedule & Free Time Routine:');
doc.fontSize(12).text('  - Sleep: 11:30 PM to 07:00 AM daily.');
doc.text('  - Classes/Lectures: Monday to Friday from 09:00 AM to 03:00 PM (Attendance is mandatory).');
doc.text('  - Lunch Break: Daily from 01:00 PM to 02:00 PM.');
doc.text('  - Gym / Physical Exercise: Monday, Wednesday, and Friday from 05:00 PM to 06:30 PM.');
doc.text('  - Dinner and leisure: 08:30 PM to 10:00 PM daily.');
doc.text('  - Weekends: Entirely free of lectures, but want to keep Saturday evening free for social life.');

doc.end();

stream.on('finish', () => {
  console.log(`Test PDF successfully generated at: ${outputPath}`);
});
