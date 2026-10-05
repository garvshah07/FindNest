import Property from "../model/property.model.js"

const getAllProperties = async () => {
    try {
      const properties = await Property.find();
      return properties;
    } catch (error) {
      throw new Error("Error Message: " + error.message);
    }
  };

const createdProperty = async (data) => {
    try {


        const existingProperty = await Property.findOne({
            latitude: data.latitude.trim(),
            longitude: data.longitude.trim(),
            propertyfor: data.propertyfor.trim()
          });
      
         
          if (existingProperty) {
            return res.status(400).json({ 
              message: `This property is already listed for the ${existingProperty.propertyfor}.`
            });
          }
        
        const createdProperty = await Property.create(data)

        return createdProperty
        
    } catch (error) {
        throw new Error("Error Message: " + error.message)
    }
  }

export {getAllProperties , createdProperty}