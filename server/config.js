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
        cleaningDelay: 1000 * 10,

        requestDelay: 1000,
        requestDelayMax: 1000 * 32,
    },
};
