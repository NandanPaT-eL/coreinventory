// backend/src/controllers/warehouse.controller.js
import Warehouse from "../models/Warehouse.model.js";

export const createWarehouse = async (req, res) => {
  try {
    const existingWarehouse = await Warehouse.findOne({ 
      code: req.body.code.toUpperCase() 
    });
    
    if (existingWarehouse) {
      return res.status(400).json({
        success: false,
        message: "Warehouse with this code already exists"
      });
    }

    const warehouseData = {
      ...req.body,
      createdBy: req.user.id,
      code: req.body.code.toUpperCase()
    };

    const warehouse = await Warehouse.create(warehouseData);

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse
    });
  } catch (error) {
    console.error("Create warehouse error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create warehouse",
      error: error.message
    });
  }
};

export const getWarehouses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      isActive, 
      city, 
      country,
      search 
    } = req.query;

    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    
    if (city) {
      filter["location.city"] = new RegExp(city, "i");
    }
    
    if (country) {
      filter["location.country"] = new RegExp(country, "i");
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const warehouses = await Warehouse.find(filter)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Warehouse.countDocuments(filter);

    res.json({
      success: true,
      data: warehouses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get warehouses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch warehouses",
      error: error.message
    });
  }
};

export const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    res.json({
      success: true,
      data: warehouse
    });
  } catch (error) {
    console.error("Get warehouse by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch warehouse",
      error: error.message
    });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    let warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    if (req.body.code && req.body.code.toUpperCase() !== warehouse.code) {
      const existingWarehouse = await Warehouse.findOne({ 
        code: req.body.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingWarehouse) {
        return res.status(400).json({
          success: false,
          message: "Warehouse with this code already exists"
        });
      }
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    if (req.body.code) {
      updateData.code = req.body.code.toUpperCase();
    }

    warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email")
     .populate("updatedBy", "name email");

    res.json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse
    });
  } catch (error) {
    console.error("Update warehouse error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update warehouse",
      error: error.message
    });
  }
};

export const deactivateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    warehouse.isActive = false;
    warehouse.updatedBy = req.user.id;
    await warehouse.save();

    res.json({
      success: true,
      message: "Warehouse deactivated successfully"
    });
  } catch (error) {
    console.error("Deactivate warehouse error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to deactivate warehouse",
      error: error.message
    });
  }
};

export const activateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found"
      });
    }

    warehouse.isActive = true;
    warehouse.updatedBy = req.user.id;
    await warehouse.save();

    res.json({
      success: true,
      message: "Warehouse activated successfully"
    });
  } catch (error) {
    console.error("Activate warehouse error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to activate warehouse",
      error: error.message
    });
  }
};