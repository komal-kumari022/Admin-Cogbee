const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'node_modules', 'lucide-react', 'dist');
if (!fs.existsSync(base)) {
  console.log('lucide-react dist not found, skipping strip.');
  process.exit(0);
}

let changed = 0;
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (ent.isFile() && full.endsWith('.js')) {
      let content = fs.readFileSync(full, 'utf8');
      const newContent = content.replace(/\n?\/\/[#@]\s?sourceMappingURL=.*$/gm, '').replace(/\n?\/\*#\s?sourceMappingURL=.*?\*\/(\r?\n)?/g, '');
      if (newContent !== content) {
        fs.writeFileSync(full, newContent, 'utf8');
        changed++;
        console.log('Stripped sourceMappingURL from', full);
      }
    }
  }
}

try {
  walk(base);
  console.log(`Done. Files changed: ${changed}`);
} catch (err) {
  console.error('Error while stripping lucide-react sourceMappingURL comments:', err);
  process.exit(1);
}
