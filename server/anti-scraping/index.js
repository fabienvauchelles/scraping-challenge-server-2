'use strict';


module.exports = class AntiScraping {
    constructor(config) {
        this._config = config;

        this._ips = new Map();
    }

    start() {
        setInterval(
            () => this._clean(),
            this._config.cleaningDelay
        );
    }


    middleware() {
        const self = this;

        return function *(next) {
            const ipName = this.request.ip;

            const nowInMs = new Date().getTime();

            let ip = self._ips.get(ipName);
            if (ip && ip.ts > nowInMs) {
                ip.count *= 2;

                const delay = Math.min(
                    self._config.requestDelayMax,
                    self._config.requestDelay * ip.count
                );
                ip.ts = nowInMs + delay;

                this.status = 503;
                this.body = `You have to wait ${delay}ms for ip ${ipName}, mister scraper.`;
            }
            else {
                ip = {
                    count: 1,
                    ts: nowInMs + self._config.requestDelay,
                };

                self._ips.set(ipName, ip);

                yield next;
            }
        }
    }


    _clean() {
        const nowInMs = new Date().getTime();

        const toRemove = [];
        this._ips.forEach((value, key) => {
            if (value.ts < nowInMs) {
                toRemove.push(key);
            }
        });

        toRemove.forEach((key) => this._ips.delete(key));
    }
}
