const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const key = env.split('GOOGLE_API_KEY=')[1].split('\n')[0].replace(/"/g, '').trim();

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log(data.models.map(m => m.name).join('\n'));
    } else {
      console.log(data);
    }
  });
