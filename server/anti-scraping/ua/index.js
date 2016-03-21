'use strict';

const uaRE = new RegExp('chrome', 'i');


module.exports = class AntiScrapingUA {
    constructor(config) {
        this._config = config;
    }


    middleware() {
        const self = this;

        return function *(next) {
            if (self._config.inactive) {
                yield next;
                return;
            }

            // Check user-agent
            const ua = this.request.headers['user-agent'] || '';
            if (!uaRE.test(ua)) {
                this.status = 503;
                this.body = `Your user-agent is not allowed: ${ua}`;
                return;
            }

            yield next;
        }
    }
};
