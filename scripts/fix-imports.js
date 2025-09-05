#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findJsFiles(dir) {
  const files = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const itemPath = join(dir, item);
    const stat = statSync(itemPath);
    
    if (stat.isDirectory()) {
      files.push(...findJsFiles(itemPath));
    } else if (item.endsWith('.js')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

function resolveImportPath(basePath, importPath) {
  // Check if it's a relative import
  if (!importPath.startsWith('.')) {
    return importPath;
  }
  
  // Check if it already has an extension
  if (extname(importPath) !== '') {
    return importPath;
  }
  
  // Resolve the full path relative to the current file
  const fullPath = join(dirname(basePath), importPath);
  
  // Check if it's a directory with an index.js file
  if (existsSync(fullPath) && statSync(fullPath).isDirectory()) {
    const indexPath = join(fullPath, 'index.js');
    if (existsSync(indexPath)) {
      return importPath + '/index.js';
    }
  }
  
  // Check if it's a file without extension
  const jsPath = fullPath + '.js';
  if (existsSync(jsPath)) {
    return importPath + '.js';
  }
  
  // Default to adding .js extension
  return importPath + '.js';
}

// Find all JS files in the dist directory
const distDir = join(__dirname, '..', 'dist');
if (!existsSync(distDir)) {
  console.error('dist directory not found');
  process.exit(1);
}

const files = findJsFiles(distDir);

files.forEach(file => {
  const content = readFileSync(file, 'utf8');
  
  // Replace relative imports without extensions with proper extensions
  let updatedContent = content.replace(
    /from\s+["'](\.[^"']*?)["']/g,
    (match, importPath) => {
      const resolvedPath = resolveImportPath(file, importPath);
      return resolvedPath !== importPath ? match.replace(importPath, resolvedPath) : match;
    }
  );
  
  updatedContent = updatedContent.replace(
    /import\s+["'](\.[^"']*?)["']/g,
    (match, importPath) => {
      const resolvedPath = resolveImportPath(file, importPath);
      return resolvedPath !== importPath ? match.replace(importPath, resolvedPath) : match;
    }
  );
  
  if (content !== updatedContent) {
    writeFileSync(file, updatedContent);
    console.log(`Fixed imports in: ${file}`);
  }
});

console.log('ES module imports fixed for Node.js compatibility');