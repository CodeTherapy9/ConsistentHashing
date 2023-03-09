var os = require("os");
var hostname = os.hostname();
// CRUD Controllers
//Return Id requested
exports.getId = (req,res,next)=>{
    const Id = req.params.id;
    res.status(200).json({message:`This is Response for ${Id}`,hostname:hostname});
}

// Return Health status

exports.getHealth = (req,res,next)=>{
    res.status(200).json({message:"Server is Healthy!",hostname:hostname});
}

