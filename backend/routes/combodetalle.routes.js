'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/combodetalle.controller');

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);
router.put('/:id', controller.put);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.delete);

module.exports = router;
