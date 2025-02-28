import express from 'express';
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Get all resources and create new resource
router
  .route('/')
  .get(getResources)
  .post(protect, createResource);

// Get, update and delete single resource
router
  .route('/:id')
  .get(getResource)
  .put(protect, updateResource)
  .delete(protect, deleteResource);

module.exports = router;