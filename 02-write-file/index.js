const fs = require('fs');
const path = require('path');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Welcome! Please enter text to write to the file. Type "exit" to quit.',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye! Exiting the program.');
    rl.close();
  } else {
    writeStream.write(input + '\n');
    console.log('Text saved. Enter more text or type "exit" to quit.');
  }
});

rl.on('close', () => {
  writeStream.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nGoodbye! Exiting the program.');
  rl.close();
});
