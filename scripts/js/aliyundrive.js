/**
 * 阿里云盘签到
 * cron: 22 8 * * *
 * @Author: Astral
 * @Date: 2026-01-29
 * @Version: 1.0.1
 * 环境变量: [adrive] (refresh_token，多账号用 @ 或 换行 分割)
 */

const $ = new Env('阿里云盘签到');
const CK_NAME = 'adrive';

//======================
// 核心逻辑
//======================

const commonHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
};

async function main() {
    const envStr = process.env[CK_NAME];
    if (!envStr) {
        $.msg($.name, '', `[ERROR] 未找到环境变量 ${CK_NAME}`);
        return;
    }

    // 支持 @ \n & 分割
    const accounts = envStr.split(/[@\n&]/).filter(item => !!item);
    console.log(`[INFO] 共发现 ${accounts.length} 个账号`);

    for (let i = 0; i < accounts.length; i++) {
        const refreshToken = accounts[i].trim();
        console.log(`\n[INFO] ------ 开始执行第 ${i + 1} 个账号 ------`);
        
        try {
            // 1. 获取 Access Token
            const tokenData = await getAccessToken(refreshToken);
            if (!tokenData) continue;

            const { access_token, nick_name } = tokenData;
            console.log(`[INFO] 用户: ${nick_name || '未知用户'}`);

            // 2. 执行签到
            const signData = await doSign(access_token);
            
            // 3. 领取奖励 (如果有签到数据)
            if (signData && signData.signInCount) {
                await doReward(access_token, signData.signInCount);
            }

        } catch (e) {
            console.log(`[ERROR] 账号执行异常: ${e.message}`);
        }

        // 随机延迟 1-3 秒
        await $.wait(Math.floor(Math.random() * 2000) + 1000);
    }
}

/**
 * 刷新 Token
 */
async function getAccessToken(refreshToken) {
    const options = {
        url: `https://auth.aliyundrive.com/v2/account/token`,
        body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken
        }),
        headers: commonHeaders
    };

    try {
        const result = await $.http.post(options);
        const data = JSON.parse(result.body);
        
        if (data.status === 'enabled' || data.access_token) {
            console.log(`[INFO] Token 更新成功`);
            return data;
        } else {
            console.log(`[ERROR] Token 更新失败: ${data.message || JSON.stringify(data)}`);
            $.msg($.name, `账号 Token 失效`, `请检查 refresh_token`);
            return null;
        }
    } catch (e) {
        console.log(`[ERROR] Token 请求网络异常: ${e.message}`);
        return null;
    }
}

/**
 * 签到
 */
async function doSign(accessToken) {
    const options = {
        url: `https://member.aliyundrive.com/v1/activity/sign_in_list`,
        body: JSON.stringify({ "isReward": false }),
        headers: {
            ...commonHeaders,
            "Authorization": `Bearer ${accessToken}`
        }
    };

    try {
        const result = await $.http.post(options);
        const data = JSON.parse(result.body);

        if (data.success === true) {
            const day = data.result.signInCount;
            console.log(`[INFO] 签到成功, 已累计签到 ${day} 天`);
            
            // 构建通知消息
            const todayLog = data.result.signInLogs[day - 1];
            const notice = todayLog && todayLog.reward && todayLog.reward.notice ? todayLog.reward.notice : '无奖励提示';
            $.msg($.name, `第 ${day} 天签到成功`, `奖励: ${notice}`);
            
            return data.result;
        } else {
            console.log(`[ERROR] 签到失败: ${JSON.stringify(data)}`);
            return null;
        }
    } catch (e) {
        console.log(`[ERROR] 签到请求异常: ${e.message}`);
        return null;
    }
}

/**
 * 领取奖励
 */
async function doReward(accessToken, day) {
    const options = {
        url: `https://member.aliyundrive.com/v1/activity/sign_in_reward`,
        body: JSON.stringify({ "signInDay": day }),
        headers: {
            ...commonHeaders,
            "Authorization": `Bearer ${accessToken}`
        }
    };

    try {
        const result = await $.http.post(options);
        const data = JSON.parse(result.body);

        if (data.success === true) {
            console.log(`[INFO] 奖励领取成功: ${data.result.description || '未知奖励'}`);
        } else {
            console.log(`[WARN] 奖励领取跳过或失败: ${data.message || JSON.stringify(data)}`);
        }
    } catch (e) {
        console.log(`[ERROR] 奖励请求异常: ${e.message}`);
    }
}


//===========================================================================
// 入口函数
//===========================================================================
!(async () => {
    await main();
    await $.done();
})();

//===========================================================================
// Env Class (Standardized)
//===========================================================================
function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? { url: t } : t;
            let s = this.get;
            "POST" === e && (s = this.post);
            return new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        msg(t = t, e = "", s = "", i) {
            const r = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() || this.isQuanX() ? $notify(t, e, s, r(i)) : this.isNode() && (require("./sendNotify").sendNotify(t, e + "\n" + s))), !this.isMuteLog) {
                let i = ["", "==============📣系统通知📣=============="];
                i.push(t), e && i.push(e), s && i.push(s), console.log(i.join("\n"))
            }
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
