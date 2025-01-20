const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');

readableStream.pipe(process.stdout);

readableStream.on('end', () => {
  console.log('\nFile reading completed.');
});

readableStream.on('error', (error) => {
  console.error('Error:', error.message);
});
