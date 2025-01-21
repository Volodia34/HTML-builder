const fs = require('fs/promises');
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const projectDistPath = path.join(__dirname, 'project-dist');

async function buildPage() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true });

    const template = await fs.readFile(templatePath, 'utf-8');

    const regex = /{{\s*([a-zA-Z0-9_-]+)\s*}}/g;
    let match;
    const replacements = {};

    while ((match = regex.exec(template)) !== null) {
      const componentName = match[1];
      const componentPath = path.join(componentsPath, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        replacements[componentName] = componentContent;
      } catch (err) {
        console.error(`Error reading component ${componentName}:`, err);
      }
    }

    let updatedTemplate = template;
    for (const [tag, content] of Object.entries(replacements)) {
      updatedTemplate = updatedTemplate.replace(`{{${tag}}}`, content);
    }

    await fs.writeFile(
      path.join(projectDistPath, 'index.html'),
      updatedTemplate,
    );

    await mergeStyles();

    await copyAssets();

    console.log('Page built successfully!');
  } catch (error) {
    console.error('Error building the page:', error);
  }
}

async function mergeStyles() {
  const styleFiles = await fs.readdir(stylesPath);
  const cssFiles = styleFiles.filter((file) => file.endsWith('.css'));

  const styleContentPromises = cssFiles.map((file) => {
    return fs.readFile(path.join(stylesPath, file), 'utf-8');
  });

  const styleContents = await Promise.all(styleContentPromises);
  const mergedStyles = styleContents.join('\n');

  await fs.writeFile(path.join(projectDistPath, 'style.css'), mergedStyles);
  console.log('Styles merged into style.css');
}

async function copyAssets() {
  const assetsDestPath = path.join(projectDistPath, 'assets');

  await fs.mkdir(assetsDestPath, { recursive: true });

  const assetFiles = await fs.readdir(assetsPath);

  for (const file of assetFiles) {
    const filePath = path.join(assetsPath, file);
    const destPath = path.join(assetsDestPath, file);

    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await copyDirectory(filePath, destPath);
    } else {
      await fs.copyFile(filePath, destPath);
    }
  }

  console.log('Assets copied to project-dist/assets');
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src);

  for (const file of files) {
    const filePath = path.join(src, file);
    const destPath = path.join(dest, file);

    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await copyDirectory(filePath, destPath);
    } else {
      await fs.copyFile(filePath, destPath);
    }
  }
}

buildPage();
