const fs = require('fs/promises');
const path = require('path');

async function listFilesInSecretFolder() {
  const folderPath = path.join(__dirname, 'secret-folder');
  console.log(folderPath);

  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileStats = await fs.stat(filePath);
        const fileSizeKB = (fileStats.size / 1024).toFixed(3);
        const fileName = path.parse(file.name).name;
        const fileExtension = path.extname(file.name).slice(1);

        console.log(`${fileName} - ${fileExtension} - ${fileSizeKB}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading the secret-folder:', error.message);
  }
}

listFilesInSecretFolder();
