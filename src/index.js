'use strict';

const { ScrapingDog } = require('./client');
const { ScrapingDogError } = require('./errors');

module.exports = ScrapingDog;
module.exports.ScrapingDog = ScrapingDog;
module.exports.ScrapingDogError = ScrapingDogError;
module.exports.default = ScrapingDog;
