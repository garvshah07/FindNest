const getAllPropertiesController = async (req, res) => {
    try {
      const properties = await getAllProperties();
      res.status(200).json({ message: "Properties Fetched", properties: properties });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const createPropertyController = async (req,res) => {
    const {userId, name, address, latitude, longitude, propertyage ,propertyfor } = req.body
    try {

      const data = {userId, name, address, latitude, longitude, propertyage ,propertyfor } 
      
      await createdProperty(data)
      res.status(200).json({ message: "Properties Created"});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


export {getAllPropertiesController , createPropertyController}