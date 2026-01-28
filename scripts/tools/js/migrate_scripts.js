#!/usr/bin/env node
/**
 * AutoPilot 
 *
 *  tmp 
 *
 * @author Astral
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// 
const SCRIPT_CATEGORIES = {
  // 
  checkin: {
    keywords: ['signin', 'sign', '', '', 'checkin'],
    scripts: [],
  },
  // 
  info: {
    keywords: ['news', 'weather', '60s', '', '', 'info'],
    scripts: [],
  },
  // 
  tools: {
    keywords: ['disable', 'clean', 'notify', 'tool', 'utils', 'helper'],
    scripts: [],
  },
  // 
  media: {
    keywords: ['video', 'music', 'movie', 'iqiyi', 'bilibili', 'youku', '', '', ''],
    scripts: [],
  },
  // 
  shopping: {
    keywords: ['meituan', 'pinduoduo', 'taobao', 'jd', 'jingdong', 'shop', 'market', 'mall', 'buy', 'purchase'],
    scripts: [],
  },
  // 
  car: {
    keywords: ['car', 'auto', 'chery', 'geely', 'nio', 'vehicle', 'drive', 'motor', 'tesla', 'bmw'],
    scripts: [],
  },
  // 
  life: {
    keywords: ['food', 'drink', 'health', 'medical', 'life', 'daily', 'living', 'care', 'service', 'wellness'],
    scripts: [],
  },
  // 
  finance: {
    keywords: ['bank', 'pay', 'money', 'finance', 'card', 'credit', 'loan', 'insurance', 'fund', 'stock'],
    scripts: [],
  },
};

// 
function getScriptCategory(filename) {
  const lowerFilename = filename.toLowerCase();

  for (const [category, config] of Object.entries(SCRIPT_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (lowerFilename.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  // 
  return 'checkin';
}

// 
function getLanguageType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.js') return 'js';
  if (ext === '.py') return 'py';
  if (ext === '.ts') return 'ts';
  return 'js'; // 
}

// 
function migrateScripts() {
  const tmpDir = path.join(__dirname, '../../../tmp');
  const scriptsDir = path.join(__dirname, '../..');

  console.log(' ...\n');

  // 
  const stats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
    byCategory: {},
    byLanguage: {},
  };

  // 
  Object.keys(SCRIPT_CATEGORIES).forEach((category) => {
    stats.byCategory[category] = 0;
    stats.byLanguage[category] = { js: 0, py: 0, ts: 0 };
  });

  //  tmp 
  ['qinglong', 'ql-scripts'].forEach((project) => {
    const projectDir = path.join(tmpDir, project);

    if (!fs.existsSync(projectDir)) {
      console.log(`  ${projectDir}`);
      return;
    }

    console.log(` ${project}`);

    const files = fs.readdirSync(projectDir);

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase();

      // 
      if (!['.js', '.py', '.ts'].includes(ext)) {
        return;
      }

      stats.total++;

      const srcPath = path.join(projectDir, file);

      // 
      if (['sendNotify.js', 'utils.js', 'ql.js'].includes(file)) {
        console.log(`    ${file}`);
        stats.skipped++;
        return;
      }

      // 
      const category = getScriptCategory(file);
      const language = getLanguageType(file);

      // 
      const targetDir = path.join(scriptsDir, category, language);

      // 
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 
      const targetPath = path.join(targetDir, file);

      // 
      try {
        fs.copyFileSync(srcPath, targetPath);

        // 
        addHeaderComment(targetPath, file, category, language);

        stats.migrated++;
        stats.byCategory[category]++;
        stats.byLanguage[category][language]++;

        console.log(`   ${file} -> ${category}/${language}`);
      } catch (error) {
        console.error(`   ${file}`, error.message);
        stats.errors++;
      }
    });
  });

  // 
  console.log('\n ');
  console.log(`  ${stats.total}`);
  console.log(`  ${stats.migrated}`);
  console.log(`  ${stats.skipped}`);
  console.log(`  ${stats.errors}`);

  console.log('\n ');
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    if (count > 0) {
      console.log(`  ${category}: ${count} `);
    }
  });

  console.log('\n ');
  Object.entries(stats.byLanguage).forEach(([category, langs]) => {
    if (langs.js > 0 || langs.py > 0 || langs.ts > 0) {
      console.log(`  ${category}:`);
      console.log(`    JavaScript: ${langs.js}`);
      console.log(`    Python: ${langs.py}`);
      console.log(`    TypeScript: ${langs.ts}`);
    }
  });

  console.log('\n ');
}

// 
function addHeaderComment(filePath, filename, category, language) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 
    if (content.startsWith('/*') || content.startsWith('#')) {
      return;
    }

    const header = `/*
 * @Author: Astral
 * @Date: 2025-01-28
 * @Description: ${filename} - ${category}
 * @Source: AutoPilot
 *
 * 
 *
 */

`;

    if (language === 'py') {
      content = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
${filename} - ${category}

@Author: Astral
@Date: 2025-01-28
@Description: ${filename} - ${category}
@Source: AutoPilot


"""

`;
    }

    fs.writeFileSync(filePath, header + content);
  } catch (error) {
    console.error(`    ${filename}`, error.message);
  }
}

// 
migrateScripts();
