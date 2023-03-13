const controller = require('../controllers/users');
const router = require('express').Router();

// CRUD Routes /users
router.get('/:id', controller.getId); // /api/:id
router.get('/health/check', controller.getHealth); // /api/healthcheck
module.exports = router;
