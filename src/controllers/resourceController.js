const {Resource} = require("../models");


// const newResources=(req,res)=>{
//     const resources={
//         name:req.body.name,
//         description:req.body.description,
//         price:req.body.price,
//         quantity:req.body.quantity,
//         owner:req.body.owner
//     }

//     models.create(resources).then(result=>{
//         return res.status(201).json({
//             message: "success"
//         })
//     }).catch(error=>{
//         return res.status(500).json({
//             message: "worng input"
//         })
//     })
// }
// const getResourcesById = (req, res) => {
//     const id = req.params.id;
//     models.findByPk(id)
//         .then(result => {
//             res.status(200).json(result);
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: "Something Wrong"
//             });
//         });
// }

// const getAllResources = (req, res) => {
//     models.findAll()
//         .then(result => {
//             res.status(200).json(result);
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: "Something Wrong"
//             });
//         });
// }
exports.getAllResources =async function getAllResources(req,res,next){
    try{
        const resource = await Resource.findAll();
        if (!resource) {
            const err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        res.json(resource.dataValues);
    }catch(err){
        next(err);
    }
}
// const update = (req, res) => {
//     const resourceId = req.params.id;
//     const userId = req.user.id;
//     const updateResource = {
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//         quantity: req.body.quantity
//     };

//     models.findByPk(resourceId)
//         .then(resource => {
//             if (!resource) {
//                 return res.status(404).json({ message: "Resource not found" });
//             }
//             if (resource.owner !== userId) {
//                 return res.status(403).json({ message: "You are not authorized to update this resource" });
//             }

//             return models.update(updateResource, { where: { id: resourceId } });
//         })
//         .then(result => {
//             if (!result[0]) {
//                 return res.status(404).json({ message: "Resource not found" });
//             }
//             return res.status(200).json({ message: "Resource updated successfully" });
//         })
//         .catch(error => {
//             console.error("Error updating resource:", error);
//             return res.status(500).json({ message: "Something went wrong" });
//         });
// };
// module.exports = {
//     getResourcesById,
//     getAllResources,
//     update,
//     newResources
// };
