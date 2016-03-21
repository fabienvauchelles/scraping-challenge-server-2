'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Person = require('../../server/model/person.model'),
    winston = require('winston');

const config = _.merge(
    require('../../server/config'),
    require('./config')
);


const edus = require('./data/edus.json'),
    firstnames_female = require('./data/firstnames_female.json'),
    firstnames_male = require('./data/firstnames_male.json'),
    exps = require('./data/jobs.json'),
    lastnames = require('./data/lastnames.json'),
    locations = require('./data/locations.json'),
    tgs = require('./data/tags.json');


// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true});
winston.level = 'debug';


// Connect to database
mongoose.connect(config.mongo.url);
mongoose.connection.on('error', (err) => {
    winston.error('Mongoose error: ', err);
    process.exit(1);
});


// Remove all data
let count = 0;
Person.remove({}, (err) => {
    if (err) return winston.error('[Mongoose] Error: ', err);

    // Add insert new data
    const persons = [];
    for (let i = 0; i < config.max; ++i) {
        persons.push(getRandomPerson());
    }

    Promise.map(
        persons,
        (person) => Person
            .create(person)
            .then(() => {
                winston.debug('[%d] %s %s saved.', count++, person.firstname, person.lastname);
            })
        ,
        {
            concurrency: 10,
        })
        .catch((err) => {
            winston.error('Error: ', err);
        })
});

function getRandomPerson() {
    const male = getRandomBoolean();

    let year = 2014 - getRandomInt(3);

    const experiences = [];
    for (let i = 0; i < getRandomInt(10) + 1; ++i) {
        experiences.push({
            year,
            title: getRandom(exps),
        });

        year -= getRandomInt(4) + 1;
    }

    const educations = [];
    for (let i = 0; i < getRandomInt(2) + 1; ++i) {
        educations.push({
            year,
            title: getRandom(edus),
        });

        year -= getRandomInt(4) + 1;
    }

    const tags = [];
    for (let i = 0; i < getRandomInt(10) + 2; ++i) {
        tags.push(getRandom(tgs));
    }

    return {
        firstname: getRandom(male ? firstnames_male: firstnames_female),
        lastname: getRandom(lastnames),
        location: getRandom(locations),
        picture_url: `images/${male ? 'men' : 'women'}/${getRandomInt(98)}.jpg`,
        experiences,
        educations,
        tags,
    }
}

function getRandomBoolean() {
    return Math.floor(Math.random() * 2) > 0;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandom(arr) {
    if (!arr || arr.length <= 0) {
        return;
    }

    const num = Math.floor(Math.random() * arr.length);

    return arr[num];
}
