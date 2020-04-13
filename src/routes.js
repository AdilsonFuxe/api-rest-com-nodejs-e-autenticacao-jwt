const express = require('express');


const routes = express.Router();


const authController = require('./controllers/authController');
const projectController = require('./controllers/projectController');
const authMiddleware = require('./middlewares/auth');

routes.use('/projects',authMiddleware);


routes.post('/auth', authController.create);
routes.post('/authenticate', authController.authenticate);


routes.get('/projects', projectController.index);

module.exports = routes;