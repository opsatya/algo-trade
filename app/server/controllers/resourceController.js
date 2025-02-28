import Resource from '../models/Resource';

// Get all resources
exports.getResources = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resources
    query = Resource.find(JSON.parse(queryStr)).populate({
      path: 'author',
      select: 'name'
    });
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Resource.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const resources = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: resources.length,
      pagination,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// Get single resource
exports.getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate({
      path: 'author',
      select: 'name'
    });
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// Create new resource
exports.createResource = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;
    
    const resource = await Resource.create(req.body);
    
    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// Update resource
exports.updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Make sure user is the resource author
    if (resource.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this resource'
      });
    }
    
    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// Delete resource
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Make sure user is the resource author
    if (resource.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this resource'
      });
    }
    
    await resource.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};