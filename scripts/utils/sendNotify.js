/**
 * AutoPilot 
 *
 *  20+ 
 *
 * @author Astral
 * @version 1.0.0
 */

const querystring = require('querystring');
const got = require('got');
const crypto = require('crypto');

const timeout = 15000;

// 
const push_config = {
  HITOKOTO: true,  // 

  // PushPlus 
  PUSH_PLUS_TOKEN: '',
  PUSH_PLUS_USER: '',
  PUSH_PLUS_TEMPLATE: 'html',
  PUSH_PLUS_CHANNEL: 'wechat',
  PUSH_PLUS_WEBHOOK: '',
  PUSH_PLUS_CALLBACKURL: '',
  PUSH_PLUS_TO: '',

  // Telegram 
  TG_BOT_TOKEN: '',
  TG_USER_ID: '',
  TG_API_HOST: 'https://api.telegram.org',
  TG_PROXY_HOST: '',
  TG_PROXY_PORT: '',
  TG_PROXY_AUTH: '',

  // Bark 
  BARK_PUSH: '',
  BARK_SOUND: '',
  BARK_ICON: '',
  BARK_GROUP: '',
  BARK_LEVEL: '',
  BARK_ARCHIVE: '',
  BARK_URL: '',

  // Server 
  PUSH_KEY: '',

  // PushDeer 
  DEER_KEY: '',
  DEER_URL: '',

  // 
  DD_BOT_TOKEN: '',
  DD_BOT_SECRET: '',

  // 
  QYWX_KEY: '',
  QYWX_ORIGIN: 'https://qyapi.weixin.qq.com',

  // 
  QYWX_AM: '',

  // 
  FSKEY: '',

  // Go-cqhttp 
  GOBOT_URL: '',
  GOBOT_QQ: '',
  GOBOT_TOKEN: '',

  // Gotify 
  GOTIFY_URL: '',
  GOTIFY_TOKEN: '',
  GOTIFY_PRIORITY: 0,

  // IGot 
  IGOT_PUSH_KEY: '',

  // Chat 
  CHAT_URL: '',
  CHAT_TOKEN: '',

  // 
  WE_PLUS_BOT_TOKEN: '',
  WE_PLUS_BOT_RECEIVER: '',
  WE_PLUS_BOT_VERSION: 'pro',

  // 
  AIBOTK_KEY: '',
  AIBOTK_TYPE: '',
  AIBOTK_NAME: '',

  // SMTP 
  SMTP_SERVICE: '',
  SMTP_EMAIL: '',
  SMTP_PASSWORD: '',
  SMTP_NAME: '',

  // PushMe 
  PUSHME_KEY: '',
  PUSHME_URL: '',

  // Chronocat 
  CHRONOCAT_QQ: '',
  CHRONOCAT_TOKEN: '',
  CHRONOCAT_URL: '',

  // Ntfy 
  NTFY_URL: '',
  NTFY_TOPIC: '',
  NTFY_PRIORITY: '3',

  // WxPusher 
  WXPUSHER_APP_TOKEN: '',
  WXPUSHER_TOPIC_IDS: '',
  WXPUSHER_UIDS: '',

  //  Webhook 
  WEBHOOK_URL: '',
  WEBHOOK_BODY: '',
  WEBHOOK_HEADERS: '',
  WEBHOOK_METHOD: '',
  WEBHOOK_CONTENT_TYPE: '',
};

// 
for (const key in push_config) {
  const v = process.env[key];
  if (v) {
    push_config[key] = v;
  }
}

// 
const $ = {
  post: (params, callback) => {
    const { url, ...others } = params;
    got.post(url, others).then(
      (res) => {
        let body = res.body;
        try {
          body = JSON.parse(body);
        } catch (error) {}
        callback(null, res, body);
      },
      (err) => {
        callback(err?.response?.body || err);
      },
    );
  },
  get: (params, callback) => {
    const { url, ...others } = params;
    got.get(url, others).then(
      (res) => {
        let body = res.body;
        try {
          body = JSON.parse(body);
        } catch (error) {}
        callback(null, res, body);
      },
      (err) => {
        callback(err?.response?.body || err);
      },
    );
  },
  logErr: console.log,
};

/**
 * 
 */
async function one() {
  const url = 'https://v1.hitokoto.cn/';
  const res = await got.get(url);
  const body = JSON.parse(res.body);
  return `${body.hitokoto}    ----${body.from}`;
}

/**
 * PushPlus 
 */
function pushPlusNotify(text, desp) {
  return new Promise((resolve) => {
    const {
      PUSH_PLUS_TOKEN,
      PUSH_PLUS_USER,
      PUSH_PLUS_TEMPLATE,
      PUSH_PLUS_CHANNEL,
      PUSH_PLUS_WEBHOOK,
      PUSH_PLUS_CALLBACKURL,
      PUSH_PLUS_TO,
    } = push_config;
    if (PUSH_PLUS_TOKEN) {
      desp = desp.replace(/[\n\r]/g, '<br>');
      const body = {
        token: `${PUSH_PLUS_TOKEN}`,
        title: `${text}`,
        content: `${desp}`,
        topic: `${PUSH_PLUS_USER}`,
        template: `${PUSH_PLUS_TEMPLATE}`,
        channel: `${PUSH_PLUS_CHANNEL}`,
        webhook: `${PUSH_PLUS_WEBHOOK}`,
        callbackUrl: `${PUSH_PLUS_CALLBACKURL}`,
        to: `${PUSH_PLUS_TO}`,
      };
      const options = {
        url: `https://www.pushplus.plus/send`,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': ' application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(`pushplus \n`, err);
          } else {
            if (data.code === 200) {
              console.log(`pushplus \n`);
            } else {
              console.log(`pushplus  ${data.msg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Telegram 
 */
function tgBotNotify(text, desp) {
  return new Promise((resolve) => {
    const {
      TG_BOT_TOKEN,
      TG_USER_ID,
      TG_PROXY_HOST,
      TG_PROXY_PORT,
      TG_API_HOST,
      TG_PROXY_AUTH,
    } = push_config;
    if (TG_BOT_TOKEN && TG_USER_ID) {
      let options = {
        url: `${TG_API_HOST}/bot${TG_BOT_TOKEN}/sendMessage`,
        json: {
          chat_id: `${TG_USER_ID}`,
          text: `${text}\n\n${desp}`,
          disable_web_page_preview: true,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      if (TG_PROXY_HOST && TG_PROXY_PORT) {
        const { HttpProxyAgent, HttpsProxyAgent } = require('hpagent');
        const _options = {
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 256,
          maxFreeSockets: 256,
          proxy: `http://${TG_PROXY_AUTH}${TG_PROXY_HOST}:${TG_PROXY_PORT}`,
        };
        const httpAgent = new HttpProxyAgent(_options);
        const httpsAgent = new HttpsProxyAgent(_options);
        const agent = {
          http: httpAgent,
          https: httpsAgent,
        };
        options.agent = agent;
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Telegram \n', err);
          } else {
            if (data.ok) {
              console.log('Telegram \n');
            } else if (data.error_code === 400) {
              console.log('botID\n');
            } else if (data.error_code === 401) {
              console.log('Telegram bot token \n');
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Bark 
 */
function barkNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    let {
      BARK_PUSH,
      BARK_ICON,
      BARK_SOUND,
      BARK_GROUP,
      BARK_LEVEL,
      BARK_ARCHIVE,
      BARK_URL,
    } = push_config;
    if (BARK_PUSH) {
      if (!BARK_PUSH.startsWith('http')) {
        BARK_PUSH = `https://api.day.app/${BARK_PUSH}`;
      }
      const options = {
        url: `${BARK_PUSH}`,
        json: {
          title: text,
          body: desp,
          icon: BARK_ICON,
          sound: BARK_SOUND,
          group: BARK_GROUP,
          isArchive: BARK_ARCHIVE,
          level: BARK_LEVEL,
          url: BARK_URL,
          ...params,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Bark APP API\n', err);
          } else {
            if (data.code === 200) {
              console.log('Bark APP \n');
            } else {
              console.log(`Bark APP  ${data.message}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Server 
 */
function serverNotify(text, desp) {
  return new Promise((resolve) => {
    const { PUSH_KEY } = push_config;
    if (PUSH_KEY) {
      desp = desp.replace(/[\n\r]/g, '\n\n');
      const matchResult = PUSH_KEY.match(/^sctp(\d+)t/i);
      const options = {
        url:
          matchResult && matchResult[1]
            ? `https://${matchResult[1]}.push.ft07.com/send/${PUSH_KEY}.send`
            : `https://sctapi.ftqq.com/${PUSH_KEY}.send`,
        body: `text=${encodeURIComponent(text)}&desp=${encodeURIComponent(desp)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Server API\n', err);
          } else {
            if (data.errno === 0 || data.data.errno === 0) {
              console.log('Server \n');
            } else if (data.errno === 1024) {
              console.log(`Server  ${data.errmsg}\n`);
            } else {
              console.log(`Server  ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * 
 */
function ddBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { DD_BOT_TOKEN, DD_BOT_SECRET } = push_config;
    const options = {
      url: `https://oapi.dingtalk.com/robot/send?access_token=${DD_BOT_TOKEN}`,
      json: {
        msgtype: 'text',
        text: {
          content: `${text}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    };
    if (DD_BOT_TOKEN && DD_BOT_SECRET) {
      const dateNow = Date.now();
      const hmac = crypto.createHmac('sha256', DD_BOT_SECRET);
      hmac.update(`${dateNow}\n${DD_BOT_SECRET}`);
      const result = encodeURIComponent(hmac.digest('base64'));
      options.url = `${options.url}&timestamp=${dateNow}&sign=${result}`;
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('\n', err);
          } else {
            if (data.errcode === 0) {
              console.log('\n');
            } else {
              console.log(` ${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else if (DD_BOT_TOKEN) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('\n', err);
          } else {
            if (data.errcode === 0) {
              console.log('\n');
            } else {
              console.log(` ${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * 
 */
function qywxBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { QYWX_ORIGIN, QYWX_KEY } = push_config;
    const options = {
      url: `${QYWX_ORIGIN}/cgi-bin/webhook/send?key=${QYWX_KEY}`,
      json: {
        msgtype: 'text',
        text: {
          content: `${text}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout,
    };
    if (QYWX_KEY) {
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('\n', err);
          } else {
            if (data.errcode === 0) {
              console.log('\n');
            } else {
              console.log(` ${data.errmsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * 
 */
function fsBotNotify(text, desp) {
  return new Promise((resolve) => {
    const { FSKEY } = push_config;
    if (FSKEY) {
      const options = {
        url: `https://open.feishu.cn/open-apis/bot/v2/hook/${FSKEY}`,
        json: { msg_type: 'text', content: { text: `${text}\n\n${desp}` } },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('API\n', err);
          } else {
            if (data.StatusCode === 0 || data.code === 0) {
              console.log('\n');
            } else {
              console.log(` ${data.msg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Go-cqhttp 
 */
function gobotNotify(text, desp) {
  return new Promise((resolve) => {
    const { GOBOT_URL, GOBOT_TOKEN, GOBOT_QQ } = push_config;
    if (GOBOT_URL) {
      const options = {
        url: `${GOBOT_URL}?access_token=${GOBOT_TOKEN}&${GOBOT_QQ}`,
        json: { message: `${text}\n${desp}` },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Go-cqhttp API\n', err);
          } else {
            if (data.retcode === 0) {
              console.log('Go-cqhttp \n');
            } else if (data.retcode === 100) {
              console.log(`Go-cqhttp  ${data.errmsg}\n`);
            } else {
              console.log(`Go-cqhttp  ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Gotify 
 */
function gotifyNotify(text, desp) {
  return new Promise((resolve) => {
    const { GOTIFY_URL, GOTIFY_TOKEN, GOTIFY_PRIORITY } = push_config;
    if (GOTIFY_URL && GOTIFY_TOKEN) {
      const options = {
        url: `${GOTIFY_URL}/message?token=${GOTIFY_TOKEN}`,
        body: `title=${encodeURIComponent(text)}&message=${encodeURIComponent(desp)}&priority=${GOTIFY_PRIORITY}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Gotify API\n', err);
          } else {
            if (data.id) {
              console.log('Gotify \n');
            } else {
              console.log(`Gotify API ${data.message}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * PushDeer 
 */
function pushDeerNotify(text, desp) {
  return new Promise((resolve) => {
    const { DEER_KEY, DEER_URL } = push_config;
    if (DEER_KEY) {
      desp = encodeURI(desp);
      const options = {
        url: DEER_URL || `https://api2.pushdeer.com/message/push`,
        body: `pushkey=${DEER_KEY}&text=${text}&desp=${desp}&type=markdown`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('PushDeer API\n', err);
          } else {
            if (data.content.result.length !== undefined && data.content.result.length > 0) {
              console.log('PushDeer \n');
            } else {
              console.log(`PushDeer  ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * IGot 
 */
function iGotNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    const { IGOT_PUSH_KEY } = push_config;
    if (IGOT_PUSH_KEY) {
      const IGOT_PUSH_KEY_REGX = new RegExp('^[a-zA-Z0-9]{24}$');
      if (!IGOT_PUSH_KEY_REGX.test(IGOT_PUSH_KEY)) {
        console.log(' IGOT_PUSH_KEY \n');
        resolve();
        return;
      }
      const options = {
        url: `https://push.hellyw.com/${IGOT_PUSH_KEY.toLowerCase()}`,
        body: `title=${text}&content=${desp}&${querystring.stringify(params)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('IGot API\n', err);
          } else {
            if (data.ret === 0) {
              console.log('IGot \n');
            } else {
              console.log(`IGot  ${data.errMsg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Chat 
 */
function chatNotify(text, desp) {
  return new Promise((resolve) => {
    const { CHAT_URL, CHAT_TOKEN } = push_config;
    if (CHAT_URL && CHAT_TOKEN) {
      desp = encodeURI(desp);
      const options = {
        url: `${CHAT_URL}${CHAT_TOKEN}`,
        body: `payload={"text":"${text}\n${desp}"}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Chat API\n', err);
          } else {
            if (data.success) {
              console.log('Chat \n');
            } else {
              console.log(`Chat  ${JSON.stringify(data)}`);
            }
          }
        } catch (e) {
          $.logErr(e);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * SMTP 
 */
async function smtpNotify(text, desp) {
  const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_SERVICE, SMTP_NAME } = push_config;
  if (![SMTP_EMAIL, SMTP_PASSWORD].every(Boolean) || !SMTP_SERVICE) {
    return;
  }

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: SMTP_SERVICE,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const addr = SMTP_NAME ? `"${SMTP_NAME}" <${SMTP_EMAIL}>` : SMTP_EMAIL;
    const info = await transporter.sendMail({
      from: addr,
      to: addr,
      subject: text,
      html: `${desp.replace(/\n/g, '<br/>')}`,
    });

    transporter.close();

    if (info.messageId) {
      console.log('SMTP \n');
      return true;
    }
    console.log('SMTP \n');
  } catch (e) {
    console.log('SMTP \n', e);
  }
}

/**
 * PushMe 
 */
function pushMeNotify(text, desp, params = {}) {
  return new Promise((resolve) => {
    const { PUSHME_KEY, PUSHME_URL } = push_config;
    if (PUSHME_KEY) {
      const options = {
        url: PUSHME_URL || 'https://push.i-i.me',
        json: { push_key: PUSHME_KEY, title: text, content: desp, ...params },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('PushMe API\n', err);
          } else {
            if (data === 'success') {
              console.log('PushMe \n');
            } else {
              console.log(`PushMe  ${data}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * Chronocat 
 */
function chronocatNotify(title, desp) {
  return new Promise((resolve) => {
    const { CHRONOCAT_TOKEN, CHRONOCAT_QQ, CHRONOCAT_URL } = push_config;
    if (!CHRONOCAT_TOKEN || !CHRONOCAT_QQ || !CHRONOCAT_URL) {
      resolve();
      return;
    }

    const options = {
      url: `${CHRONOCAT_URL}/api/message/send`,
      json: {
        target: CHRONOCAT_QQ,
        message: {
          content: `${title}\n\n${desp}`,
        },
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHRONOCAT_TOKEN}`,
      },
      timeout,
    };

    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log('Chronocat API\n', err);
        } else {
          console.log('Chronocat \n');
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

/**
 * Ntfy 
 */
function ntfyNotify(text, desp) {
  return new Promise((resolve) => {
    const { NTFY_URL, NTFY_TOPIC, NTFY_PRIORITY } = push_config;
    if (NTFY_TOPIC) {
      const options = {
        url: `${NTFY_URL || 'https://ntfy.sh'}/${NTFY_TOPIC}`,
        json: {
          topic: NTFY_TOPIC,
          message: `${text}\n\n${desp}`,
          priority: Number(NTFY_PRIORITY) || 3,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('Ntfy API\n', err);
          } else {
            console.log('Ntfy \n');
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * WxPusher 
 */
function wxpusherNotify(text, desp) {
  return new Promise((resolve) => {
    const { WXPUSHER_APP_TOKEN, WXPUSHER_TOPIC_IDS, WXPUSHER_UIDS } = push_config;
    if (WXPUSHER_APP_TOKEN) {
      const options = {
        url: `https://wxpusher.zjiecode.com/api/send/message`,
        json: {
          appToken: `${WXPUSHER_APP_TOKEN}`,
          content: `${text}\n\n${desp}`,
          summary: `${text}`,
          contentType: 1,
          topicIds: WXPUSHER_TOPIC_IDS ? WXPUSHER_TOPIC_IDS.split(';') : [],
          uids: WXPUSHER_UIDS ? WXPUSHER_UIDS.split(';') : [],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout,
      };
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log('WxPusher API\n', err);
          } else {
            if (data.code === 1000) {
              console.log('WxPusher \n');
            } else {
              console.log(`WxPusher  ${data.msg}\n`);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 *  Webhook 
 */
function webhookNotify(text, desp) {
  return new Promise((resolve) => {
    const {
      WEBHOOK_URL,
      WEBHOOK_BODY,
      WEBHOOK_HEADERS,
      WEBHOOK_METHOD,
      WEBHOOK_CONTENT_TYPE,
    } = push_config;
    if (WEBHOOK_URL) {
      const options = {
        url: WEBHOOK_URL,
        method: WEBHOOK_METHOD || 'POST',
        headers: WEBHOOK_HEADERS ? JSON.parse(WEBHOOK_HEADERS) : {},
        json: WEBHOOK_BODY ? JSON.parse(WEBHOOK_BODY.replace('{title}', text).replace('{desp}', desp)) : {},
        timeout,
      };
      if (WEBHOOK_CONTENT_TYPE) {
        options.headers['Content-Type'] = WEBHOOK_CONTENT_TYPE;
      }
      $.post(options, (err, resp, data) => {
        try {
          if (err) {
            console.log(' Webhook API\n', err);
          } else {
            console.log(' Webhook \n');
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

/**
 * 
 */
async function sendNotify(text, desp, params = {}) {
  // 
  if (push_config.HITOKOTO) {
    try {
      const hitokoto = await one();
      desp = `${hitokoto}\n\n${desp}`;
    } catch (error) {
      console.log('');
    }
  }

  // 
  await Promise.all([
    pushPlusNotify(text, desp),
    tgBotNotify(text, desp),
    barkNotify(text, desp, params),
    serverNotify(text, desp),
    ddBotNotify(text, desp),
    qywxBotNotify(text, desp),
    fsBotNotify(text, desp),
    gobotNotify(text, desp),
    gotifyNotify(text, desp),
    pushDeerNotify(text, desp),
    iGotNotify(text, desp, params),
    chatNotify(text, desp),
    smtpNotify(text, desp),
    pushMeNotify(text, desp, params),
    chronocatNotify(text, desp),
    ntfyNotify(text, desp),
    wxpusherNotify(text, desp),
    webhookNotify(text, desp),
  ]);
}

module.exports = {
  sendNotify,
};
