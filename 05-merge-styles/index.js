const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const distFolder = path.join(__dirname, 'project-dist');
  const bundleFile = path.join(distFolder, 'bundle.css');

  await fs.mkdir(distFolder, { recursive: true });

  const files = await fs.readdir(stylesFolder);

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  let allStyles = '';

  for (const file of cssFiles) {
    const filePath = path.join(stylesFolder, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    allStyles += fileContent + '\n';
  }

  await fs.writeFile(bundleFile, allStyles);

  console.log('CSS bundle created successfully!');
}

mergeStyles();
