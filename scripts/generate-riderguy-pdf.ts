import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const QUOTE_ID = 'Vwd0WKb3jh_S8U6JnAOBj';
const PORT = 3001; // Dev server is on port 3001
const API_URL = `http://localhost:${PORT}/api/admin/quotes/${QUOTE_ID}/pdf`;

async function generatePDF() {
  try {
    console.log('📄 Generating PDF for RiderGuy quote...\n');
    console.log(`   Quote ID: ${QUOTE_ID}`);
    console.log(`   API URL: ${API_URL}\n`);

    console.log('🔄 Sending request to generate PDF...');
    
    return new Promise((resolve, reject) => {
      http.get(API_URL, (response) => {
        if (response.statusCode === 200) {
          const outputPath = path.join(process.cwd(), 'RiderGuy_Quote_$7000.pdf');
          const fileStream = fs.createWriteStream(outputPath);
          
          response.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            const stats = fs.statSync(outputPath);
            
            console.log('\n✅ PDF generated successfully!');
            console.log(`   File: ${outputPath}`);
            console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
            
            console.log('📋 Quote Summary:');
            console.log('   Client: Ebenezer Darko');
            console.log('   Company: RiderGuy');
            console.log('   Email: ebdarko@gmail.com');
            console.log('   Phone: 0557630667');
            console.log('   Total: $7,000');
            console.log('   Items: 7 line items\n');
            
            console.log('📧 Next Steps:');
            console.log('   1. Review the PDF file');
            console.log('   2. Send to client via email');
            console.log('   3. Mark quote as "sent" after sending\n');
            
            resolve(outputPath);
          });
          
          fileStream.on('error', (err) => {
            reject(new Error(`File write error: ${err.message}`));
          });
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      }).on('error', (err: any) => {
        if (err.code === 'ECONNREFUSED') {
          reject(new Error('Development server is not running! Please start with: npm run dev'));
        } else {
          reject(err);
        }
      });
    });
  } catch (error: any) {
    console.error('\n❌ Error generating PDF:');
    console.error(`   ${error.message}`);
    throw error;
  }
}

// Run the script
generatePDF()
  .then((pdfPath) => {
    console.log(`✅ PDF ready at: ${pdfPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to generate PDF');
    process.exit(1);
  });
