const router = require('express').Router();
const departments = require('../controllers/departments.controller');

// compose departments routes
router.get('/', departments.getAll);
router.post('/', departments.create);
router.get('/:departmentId', departments.get);
router.put('/:departmentId', departments.update);
router.delete('/:departmentId', departments.remove);

module.exports = router;
