import express from 'express';
import cors from 'cors';
import multer from 'multer';
import * as xlsx from 'xlsx';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = xlsx.readFile(req.file.path, { cellDates: true });
    const sheetName = '2026起業予算纏め表';

    if (!workbook.SheetNames.includes(sheetName)) {
        return res.status(400).send(`Sheet "${sheetName}" not found.`);
    }

    const worksheet = workbook.Sheets[sheetName];
    // Read raw array data
    const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    const processedData = [];

    // Timeline headers are at index 12 (row 13)
    const headersRow = rawData[12] || [];

    // Process data starting from row index 13 (row 14)
    for (let i = 13; i < rawData.length; i++) {
        const row = rawData[i];

        // Skip empty rows
        if (!row || row.length === 0) continue;

        // Only process rows where column 0 (No) is a number
        if (row[0] !== undefined && !isNaN(Number(row[0])) && String(row[0]).trim() !== '') {

             // Extract timeline data mapping (from col 40 to 99)
             const timeline: Record<string, number> = {};
             for (let colIndex = 40; colIndex <= 99; colIndex++) {
                 const rawHeader = headersRow[colIndex];
                 if (rawHeader) {
                     // Ensure header is treated as a valid date string or general string
                     let dateKey = '';
                     if (rawHeader instanceof Date) {
                         // Format to YYYY-MM-DD
                         dateKey = rawHeader.toISOString().split('T')[0];
                     } else {
                         dateKey = String(rawHeader).trim();
                     }

                     // Try to parse the cell value as a number, ignore 0 or empty
                     let val = 0;
                     if (row[colIndex] !== undefined && row[colIndex] !== '') {
                          val = Number(row[colIndex]);
                     }
                     if (!isNaN(val) && val !== 0) {
                         timeline[dateKey] = val;
                     }
                 }
             }

             // Complete Date
             let completeDateVal = row[12];
             if (completeDateVal instanceof Date) {
                 completeDateVal = completeDateVal.toISOString().split('T')[0];
             }

             const item = {
                 id: row[0],
                 dept: row[1],
                 itemName: row[8], // Item Name (Tiếng việt)
                 completeDate: completeDateVal,
                 totalAmount: row[16],
                 monthsToAllocate: row[38],
                 amountPerMonth: row[39],
                 timeline: timeline
             };
             processedData.push(item);
        }
    }

    res.json({ message: 'File processed successfully', data: processedData });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing file.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
