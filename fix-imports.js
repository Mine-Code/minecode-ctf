#!/usr/bin/env node

// Post-build script to add .js extensions to imports in compiled JavaScript files
// This is needed because Node.js ES modules require explicit file extensions

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace import statements to add .js extensions
  content = content.replace(
    /from\s+['"](\.[^'"]*?)(?<!\.js)['"];/g,
    (match, importPath) => {
      // Don't modify imports that already have .js or are node_modules
      if (importPath.endsWith('.js') || !importPath.startsWith('.')) {
        return match;
      }
      
      // Check if it's a directory import that needs /index.js
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        return match.replace(importPath, importPath + '/index.js');
      } else {
        return match.replace(importPath, importPath + '.js');
      }
    }
  );
  
  // Replace dynamic imports too
  content = content.replace(
    /import\s*\(\s*['"](\.[^'"]*?)(?<!\.js)['"]\s*\)/g,
    (match, importPath) => {
      if (importPath.endsWith('.js') || !importPath.startsWith('.')) {
        return match;
      }
      
      // Check if it's a directory import that needs /index.js
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);
      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        return match.replace(importPath, importPath + '/index.js');
      } else {
        return match.replace(importPath, importPath + '.js');
      }
    }
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function fixImportsInDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixImportsInDirectory(fullPath);
    } else if (path.extname(item) === '.js') {
      fixImportsInFile(fullPath);
    }
  }
}

if (fs.existsSync(distDir)) {
  fixImportsInDirectory(distDir);
  console.log('Fixed imports in compiled JavaScript files');
} else {
  console.log('No dist directory found, skipping import fixing');
}