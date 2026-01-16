const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const LOGO_PATH = path.join(__dirname, 'assists', 'images', 'Atthah.png');
console.log('LOGO 1 exists:', fs.existsSync(LOGO_PATH));

// console.log('__dirname:', __dirname);
// console.log(fs.readdirSync(__dirname));


const app = express();
app.use(cors());
app.use(express.json());




/* ---------- PATHS ---------- */
const DATA_FILE = path.join(__dirname, 'candidates.json');
const PDF_DIR = path.join(__dirname, 'pdfs');

/* ---------- ENSURE PDF FOLDER EXISTS ---------- */
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR);
}

/* ---------- DOWNLOAD PDF (FORCE DOWNLOAD) ---------- */
app.get('/download/:filename', (req, res) => {
  // 🔐 sanitize filename
  const fileName = path.basename(req.params.filename);
  const filePath = path.join(PDF_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  res.sendFile(filePath);
});

/* ---------- LOAD EXISTING DATA ---------- */
let candidates = [];
if (fs.existsSync(DATA_FILE)) {
  candidates = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

/* ---------- SAVE DATA ---------- */
function saveToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(candidates, null, 2));
}

/* ---------- PDF GENERATOR ---------- */
function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const safeName = data.fullName.replace(/\s+/g, '_');
    const fileName = `${safeName}_${Date.now()}.pdf`;
    const filePath = path.join(PDF_DIR, fileName);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    /* ===== BORDER ===== */
    doc.rect(30, 30, 535, 770).stroke();

    /* ===== HEADER ===== */
    doc
      .fontSize(20)
      .text(data.fullName.toUpperCase(), 50, 50);

    doc
      .fontSize(10)
      .text(`${data.email} | ${data.phone}`, 50, 75);

      if (fs.existsSync(LOGO_PATH)) {
          doc.image(LOGO_PATH, 450, 55, {
           width: 100,
         });
      }


    /* ===== EDUCATION ===== */
    doc.moveTo(40, 110).lineTo(560, 110).stroke();
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
 const pageWidth = doc.page.width;
const sectionWidth = 535;
const sectionX = (pageWidth - sectionWidth) / 2;

const eduY = 115;
const sectionHeight = 30;

// Background
doc
  .fillColor('#f0f0f0')
  .rect(sectionX, eduY, sectionWidth, sectionHeight)
  .fill();

// Left border
doc
  .fillColor('#999999')
  .rect(sectionX, eduY, 4, sectionHeight)
  .fill();

// Text
doc
  .fillColor('#000000')
  .font('Helvetica-Bold')
  .fontSize(13)
  .text('EDUCATION', sectionX + 15, eduY + 8);


    doc.fontSize(11);

    // Left column
    doc.text(
      `Post Graduation\n${data.education?.postGraduation?.degree || '-'}\nYear: ${data.education?.postGraduation?.year || '-'}`,
      50,
      150
    );

    doc.text(
      `Class XII\nYear: ${data.education?.twelfthYear || '-'}`,
      50,
      210
    );

    // Right column
    doc.text(
      `Graduation\n${data.education?.graduation?.degree || '-'}\nYear: ${data.education?.graduation?.year || '-'}`,
      300,
      150
    );

    doc.text(
      `Class X\nYear: ${data.education?.tenthYear || '-'}`,
      300,
      210
    );

    doc.text(`Remarks: ${data.remark || '-'}`, 50, 260);

    /* ===== EMPLOYMENT ===== */
    doc.moveTo(40, 300).lineTo(560, 300).stroke();
    doc.fontSize(14).text('EMPLOYMENT HISTORY', 50, 310);

    // Table header
    doc.fontSize(11);
    doc.text('Company', 50, 340);
    doc.text('Designation', 180, 340);
    doc.text('From', 340, 340);
    doc.text('To', 430, 340);

    let y = 360;

    if (Array.isArray(data.employmentHistory)) {
      data.employmentHistory.forEach(job => {
        doc.text(job.company, 50, y);
        doc.text(job.role, 180, y);
        doc.text(job.fromDate, 340, y);
        doc.text(job.toDate, 430, y);
        y += 20;
      });
    }

    doc.end();

    stream.on('finish', () => resolve(fileName));
    stream.on('error', reject);
  });
}


/* ---------- CREATE CANDIDATE ---------- */
app.post('/api/candidates', async (req, res) => {
  const data = req.body;

  if (!data.fullName || !data.email || !data.phone) {
    return res.status(400).json({
      status: false,
      message: 'Required fields missing',
    });
  }

  try {
    const pdfFile = await generatePDF(data);

    const candidate = {
      ...data,
      pdfUrl: `http://localhost:3000/download/${pdfFile}`,
      createdAt: new Date().toISOString(),
    };

    candidates.push(candidate);
    saveToFile();

    res.json({
      status: true,
      message: 'Candidate saved & PDF generated',
      pdfUrl: candidate.pdfUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'PDF generation failed',
    });
  }
});

/* ---------- GET CANDIDATES ---------- */
app.get('/api/candidates', (req, res) => {
  res.json({
    status: true,
    data: candidates,
  });
});

/* ---------- LOGIN ---------- */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@gmail.com' && password === '1234') {
    res.json({ status: true });
  } else {
    res.status(401).json({
      status: false,
      message: 'Invalid Email or Password',
    });
  }
});

/* ---------- START SERVER ---------- */
app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
