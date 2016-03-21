'use strict';

const _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const expSchema = new Schema({
    year: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },
}, {_id: false});


const schema = new Schema({
    // _id => implicit

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        require: true,
    },

    picture_url: {
        type: String,
        require: true,
        lower: true,
    },

    experiences: [expSchema],

    educations: [expSchema],

    tags: [String],
});


module.exports = mongoose.model('Persons', schema);
