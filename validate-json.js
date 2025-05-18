const fs = require('fs');
const path = require('path');

function validateJSON(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      validateJSON(fullPath); // Check subfolders
    } else if (file.endsWith('.json')) {
      try {
        JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        console.log(`✅ Valid: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Invalid JSON in ${fullPath}: ${err.message}`);
      }
    }
  });
}

validateJSON(process.cwd()); // Start from current directory