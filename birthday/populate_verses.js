import fs from 'fs';
import https from 'https';

const getVerse = (reference) => {
  return new Promise((resolve) => {
    const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(reference)}&type=text`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && data) {
          // Remove strong tags and bold text, return clean string
          let cleanData = data.replace(/<[^>]*>?/gm, '').trim().replace(/\n/g, ' ');
          resolve(cleanData);
        } else {
          console.log(`Failed to fetch for ${reference}: ${res.statusCode}`);
          resolve('');
        }
      });
    }).on('error', (e) => {
      console.log(`Network Error for ${reference}`, e);
      resolve('');
    });
  });
};

async function main() {
  const filePath = 'birthday.md';
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const updatedLines = [];
  
  console.log('Starting verse fetching with labs.bible.org...');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // We check if it starts with '* ' and it contains a verse format like 'Genesis 1:3'
    if (line.startsWith('* ') && line.match(/[0-9]+:[0-9]+/)) {
      // It might already have ' - ' if a previous script partially succeeded.
      let reference = line.substring(2).trim();
      if (reference.includes('**')) {
        // cleanup if it was partially formatted
        reference = reference.replace(/\*\*/g, '').split('-')[0].trim();
      }
      
      console.log(`Fetching: ${reference}`);
      const verseText = await getVerse(reference);
      if (verseText) {
        updatedLines.push(`* **${reference}** - "${verseText}"`);
      } else {
        updatedLines.push(`* **${reference}**`);
      }
      // Small delay
      await new Promise(r => setTimeout(r, 100));
    } else {
      updatedLines.push(line);
    }
  }
  
  fs.writeFileSync(filePath, updatedLines.join('\n'));
  console.log('Finished populating verses!');
}

main().catch(console.error);
