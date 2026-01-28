/*
 * @Author: Astral
 * @Date: 2025-01-28
 * @Description:  sendNotify 
 * @cron: 1 18 * * *
 * @new Env('sendNotify')
 * @: QL_NOTIFY_ALLOW_WORD 
 * @: QL_NOTIFY_BAN_WORD 
 * @: QL_NOTIFY_REPO_WORD 
 * @: QL_SCRIPTS_DIR  scripts  /ql/data/scripts
 */

const { resolve } = require('path');
const fs = require('fs');

async function modifySendNotify() {
  const allowWordsString =
    process.env.QL_NOTIFY_ALLOW_WORD ||
    ',,,,,,,,,,,[60s],[]';
  const ignoreWordsString = process.env.QL_NOTIFY_BAN_WORD || '';

  const allowWords = allowWordsString
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  const banWords = ignoreWordsString
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  const allowRepoWords = (process.env.QL_NOTIFY_REPO_WORD || '')
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);

  if (allowWords.length === 0) {
    console.log('  ');
    return;
  }

  const scriptsDir = process.env.QL_SCRIPTS_DIR || '/ql/data/scripts';

  if (!fs.existsSync(scriptsDir)) {
    console.error(` ${scriptsDir}`);
    console.log(`  QL_SCRIPTS_DIR `);
    return;
  }

  console.log(` ${scriptsDir}`);
  console.log(` ${allowWords.join(', ')}`);
  if (banWords.length > 0) {
    console.log(` ${banWords.join(', ')}`);
  }
  if (allowRepoWords.length > 0) {
    console.log(`  ${allowRepoWords.join(', ')}`);
  }

  const notifyFiles = {
    'sendNotify.js': [],
    'notify.py': [],
  };
  const allowModifyFiles = new Set();

  const findNotifyFiles = (dir) => {
    fs.readdirSync(dir).forEach((filename) => {
      const filepath = resolve(dir, filename);

      if (fs.statSync(filepath).isDirectory()) {
        findNotifyFiles(filepath);
      } else if (filename in notifyFiles) {
        notifyFiles[filename].push(filepath);

        if (allowRepoWords.length === 0 || allowRepoWords.some((d) => dir.includes(d))) {
          allowModifyFiles.add(filepath);
        }
      }
    });
  };

  let insertStrJS = [
    `var allowWords = ${JSON.stringify(allowWords)};`,
    `if (!allowWords.some(k => String(desp).includes(k) || String(text).includes(k))) return console.log('[ALLOW_WORDS]');`,
    `var banWords = ${JSON.stringify(banWords)};`,
    `if (banWords.some(k => String(desp).includes(k) || String(text).includes(k))) return console.log('');`,
  ].join('\n');

  let insertStrPY = [
    `    allow_words = ${JSON.stringify(allowWords)}`,
    `    if not any(k in str(content) for k in allow_words):`,
    `        print("[ALLOW_WORDS]")`,
    `        return`,
    `    ban_words = ${JSON.stringify(banWords)}`,
    `    if any(k in str(content) for k in ban_words):`,
    `        print("")`,
    `        return`,
  ].join('\n');

  findNotifyFiles(scriptsDir);

  let modifiedCount = 0;
  let removedCount = 0;

  //  JavaScript 
  for (const filepath of notifyFiles['sendNotify.js']) {
    let content = fs.readFileSync(filepath, 'utf8');

    if (!allowModifyFiles.has(filepath)) {
      const newContent = removeInsertCode(content, 'js');
      if (content !== newContent) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`[js] ${filepath}`);
        removedCount++;
      }
      continue;
    }

    if (content.includes('function sendNotify(')) {
      if (content.includes(insertStrJS)) {
        console.log(`[js] ${filepath}`);
      } else {
        content = removeInsertCode(content, 'js');

        if (/desp \+=.+author/.test(content)) {
          content = content.replace(/(desp \+=.+author.+)/, `$1\n${insertStrJS}`);
        } else {
          content = content.replace(/(function sendNotify\(.+)/, `$1\n${insertStrJS}`);
        }
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[js] ${filepath}`);
        modifiedCount++;
      }
    }
  }

  //  Python 
  for (const filepath of notifyFiles['notify.py']) {
    let content = fs.readFileSync(filepath, 'utf8');

    if (!allowModifyFiles.has(filepath)) {
      const newContent = removeInsertCode(content, 'py');
      if (content !== newContent) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`[py] ${filepath}`);
        removedCount++;
      }
      continue;
    }

    if (content.includes('def send(title') && content.includes('if not content:')) {
      if (content.includes(insertStrPY)) {
        console.log(`[py] ${filepath}`);
      } else {
        content = removeInsertCode(content, 'py').replace(/( +if not content:.*)/, `${insertStrPY}\n\n$1`);

        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[py] ${filepath}`);
        modifiedCount++;
      }
    }
  }

  console.log(`\n `);
  console.log(` ${modifiedCount}`);
  console.log(`  ${removedCount}`);
  console.log(` `);
}

function removeInsertCode(content, type = 'js') {
  if (type === 'js') {
    return content.replaceAll(/var allowWords = (.+\r?\n)+.+'\)\r?\n/g, '');
  }
  return content.replaceAll(/ +allow_words = (.+\r?\n.+)+"\)(\r?\n\ +return)?(\r?\n)+/g, '\n');
}

modifySendNotify()
  .then(() => {
    console.log(' ');
    process.exit(0);
  })
  .catch((error) => {
    console.error(' ', error);
    process.exit(1);
  });