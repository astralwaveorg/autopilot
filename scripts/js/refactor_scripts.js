#!/usr/bin/env node
/**
 * AutoPilot 
 *
 * 
 * - 
 * - 
 * - 
 * - 
 *
 * @author Astral
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

// 1
const SCRIPTS_TO_REFACTOR = [
  // TypeScript 
  'scripts/checkin/ts/ql_alipan_signin.ts',
  'scripts/checkin/ts/ql_xmlySign.ts',
  'scripts/checkin/ts/ql_newapi_signin.ts',
  'scripts/checkin/ts/ql_ikuuu.ts',
  'scripts/checkin/ts/ql_ssone.ts',

  // JavaScript 
  'scripts/checkin/js/alyp.js',
  'scripts/checkin/js/didi.js',
  'scripts/checkin/js/meituan.js',
  'scripts/checkin/js/ysfqd.js',

  // Python 
  'scripts/checkin/py/.py',
];

// 
const HEADER_TEMPLATES = {
  js: `/*
 * AutoPilot 
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * : configs/env.example
 */

`,
  ts: `/**
 * AutoPilot 
 *
 * @Author: Astral
 * @Date: 2025-01-28
 * @Version: 1.0.0
 *
 * : configs/env.example
 */

`,
  py: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AutoPilot 

@Author: Astral
@Date: 2025-01-28
@Version: 1.0.0

: configs/env.example
"""

`,
};

// 
const COMMENT_PATTERNS = [
  // 
  /\/\/.*?(|||||QQ|||||||).*/g,
  /\/\*[\s\S]*?(|||||QQ|||||||)[\s\S]*?\*\//g,
  // 
  /\/\*\*?\s*\*\//g,
  /\/\/\s*$/gm,
  // 
  /\n{3,}/g,
];

// 
const LOG_PATTERNS = {
  js: {
    info: (msg) => `console.log(' ${msg}');`,
    error: (msg) => `console.log(' ${msg}');`,
    warn: (msg) => `console.log('  ${msg}');`,
  },
  ts: {
    info: (msg) => `console.log(' ${msg}');`,
    error: (msg) => `console.log(' ${msg}');`,
    warn: (msg) => `console.log('  ${msg}');`,
  },
  py: {
    info: (msg) => `print(f" {msg}")`,
    error: (msg) => `print(f" {msg}")`,
    warn: (msg) => `print(f"  {msg}")`,
  },
};

// 
function refactorScript(scriptPath) {
  console.log(`\n : ${scriptPath}`);

  const ext = path.extname(scriptPath).toLowerCase().replace('.', '');
  const template = HEADER_TEMPLATES[ext];

  if (!template) {
    console.log(`    : ${ext}`);
    return;
  }

  try {
    let content = fs.readFileSync(scriptPath, 'utf8');

    // 
    COMMENT_PATTERNS.forEach(pattern => {
      content = content.replace(pattern, '');
    });

    // 
    content = content.replace(/\n{3,}/g, '\n\n');

    // 
    if (!content.includes('@Author: Astral')) {
      content = template + content;
    }

    // 
    fs.writeFileSync(scriptPath, content, 'utf8');

    console.log(`   `);
  } catch (error) {
    console.error(`   : ${error.message}`);
  }
}

// 
function main() {
  console.log(' ...\n');

  let successCount = 0;
  let failCount = 0;

  SCRIPTS_TO_REFACTOR.forEach(scriptPath => {
    const fullPath = path.join(__dirname, '../../../', scriptPath);

    if (!fs.existsSync(fullPath)) {
      console.log(`    : ${scriptPath}`);
      failCount++;
      return;
    }

    try {
      refactorScript(fullPath);
      successCount++;
    } catch (error) {
      console.error(`   : ${scriptPath}`, error.message);
      failCount++;
    }
  });

  console.log('\n :');
  console.log(`  : ${successCount}`);
  console.log(`  : ${failCount}`);
  console.log(`  : ${SCRIPTS_TO_REFACTOR.length}`);
  console.log('\n ');
}

// 
main();
