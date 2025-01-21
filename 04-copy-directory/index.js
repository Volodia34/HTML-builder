const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const source = path.join(__dirname, 'files');
  const destination = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destination, { recursive: true });

    const sourceFiles = await fs.readdir(source);
    const destinationFiles = await fs.readdir(destination);

    for (const file of sourceFiles) {
      await fs.copyFile(path.join(source, file), path.join(destination, file));
    }

    for (const file of destinationFiles) {
      if (!sourceFiles.includes(file)) {
        await fs.unlink(path.join(destination, file));
        console.log(`Deleted: ${file}`);
      }
    }

    console.log('Copy completed successfully!');
  } catch (error) {
    console.error('Error copying files:', error.message);
  }
}

copyDir();
