import {
  getAllProperties,
  createdProperty,
  updateProperty,
  deleteProperty,
} from "../service/property.service.js";

const getAllPropertiesController = async (req, res) => {
  try {
    const properties = await getAllProperties();
    res.status(200).json({ message: "Properties Fetched", properties });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createPropertyController = async (req, res) => {
  const {
    userId,
    name,
    address,
    latitude,
    longitude,
    propertyage,
    propertyfor,
  } = req.body;

  try {
    const data = {
      userId,
      name,
      address,
      latitude,
      longitude,
      propertyage,
      propertyfor,
    };

    await createdProperty(data);
    res.status(200).json({ message: "Properties Created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePropertyController = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await updateProperty(id, req.body);
    res.status(200).json({ message: "Property Updated Successfully", property: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePropertyController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProperty(id);
    res.status(200).json({ message: "Property Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getAllPropertiesController,
  createPropertyController,
  updatePropertyController,
  deletePropertyController,
};