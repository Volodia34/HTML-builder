const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const source = path.join(__dirname, 'files');
  const destination = path.join(__dirname, 'files-copy');

  await fs.mkdir(destination, { recursive: true });

  const items = await fs.readdir(source);

  for (const item of items) {
    await fs.copyFile(path.join(source, item), path.join(destination, item));
  }

  console.log('Copy completed successfully!');
}

copyDir();
