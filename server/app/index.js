'use strict';

const Person = require('../model/person.model'),
    Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // One profile
    router.get('/:id', function *() {
        const _id = this.params.id;

        const person = yield Person
            .findOne({_id});

        yield this.render('profile', {
            title: 'Profile',
            person,
        });
    });


    // All profiles
    router.get('/', function *() {
        const persons = yield Person
            .find({}, {
                firstname: 1,
                lastname: 1
            })
            .sort({
                lastname: 1,
                firstname: 1
            });

        yield this.render('profiles', {
            title: 'All profiles',
            persons,
        });
    });

    return router.routes();
};
