const express = require('express');


const routes = express.Router();


const authController = require('./app/controllers/authController');
const projectController = require('./app/controllers/projectController');
const authMiddleware = require('./app/middlewares/auth');

routes.use('/projects',authMiddleware);


routes.post('/auth', authController.create);
routes.post('/authenticate', authController.authenticate);
routes.post('/forgot_password', authController.forgot_password);
routes.post('/reset_password', authController.reset_password);


routes.get('/projects', projectController.index);

module.exports = routes;