module.exports = {
    port: process.env.PORT || 9000,

    mongo: {
        url: process.env.MONGOLAB_URI || 'mongodb://localhost/scraping-challenge-2',
    },

    assets: {
        path: 'assets',
    },

    template: {
        viewPath: `${__dirname}/app`,
        defaultLayout: 'index.tpl',
    },


    antiscraping: {
        ua: {
            inactive: process.env.AS_DELAY_INACTIVE === 'true',
        },

        delay: {
            inactive: process.env.AS_DELAY_INACTIVE === 'true',
            cleaningDelay: parseInt(process.env.AS_DELAY_CLEANING_DELAY || '10000'),

            requestDelay: parseInt(process.env.AS_DELAY_REQUEST_DELAY || '1000'),
            requestDelayMax: parseInt(process.env.AS_DELAY_REQUEST_DELAY_MAX || '32000'),
        },
    },
};
