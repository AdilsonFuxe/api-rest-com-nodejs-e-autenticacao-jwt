const express = require('express');

const routes = express.Router();


const authController = require('./controllers/authController');

routes.post('/auth', authController.create);

module.exports = routes;