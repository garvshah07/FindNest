import Property from "../model/property.model.js";

const getAllProperties = async () => {
  try {
    return await Property.find();
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const createdProperty = async (data) => {
  try {
    const existingProperty = await Property.findOne({
      latitude: data.latitude?.trim(),
      longitude: data.longitude?.trim(),
      propertyfor: data.propertyfor?.trim(),
    });

    if (existingProperty) {
      throw new Error(
        `This property is already listed for the ${existingProperty.propertyfor}.`,
      );
    }

    return await Property.create(data);
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const updateProperty = async (id, data) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updated) {
      throw new Error("Property not found");
    }
    return updated;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

const deleteProperty = async (id) => {
  try {
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Property not found");
    }
    return deleted;
  } catch (error) {
    throw new Error("Error Message: " + error.message);
  }
};

export { getAllProperties, createdProperty, updateProperty, deleteProperty };