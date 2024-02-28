const models = require("../models");
const { Op } = require('sequelize');

const newResources=(req,res)=>{
    const {name,description,price,quantity} = req.body;
    const owner=req.auth.payload.sub;

    const resources={
        name:name,
        description:description,
        price:price,
        quantity:quantity,
        owner:owner
    }

    models.User.findByPk(owner).then(owner=>{
        if(!owner){
            return res.status(404).json({
                message: "Owner not found",
                success:0
            })
        }
        return models.Resource.create(resources).then(result=>{
                return res.status(201).json({
                    message: "success",
                    success:1
                })
            }).catch(error=>{
                return res.status(500).json({
                    message: "invaled input",
                    success:0
                })
            });
        
    }).catch(error=>{
        return res.status(500).json({
            message: "invaled input",
            success:0
        })
    })
}
const getResourcesById = (req, res) => {
    const id = req.params.id;
    models.Resource.findByPk(id)
        .then(result => {
            if(!result){
                return res.status(400).json({
                    message: "Not Found"
                });
            }
            return res.status(200).json({
                result,
            });
        })
        .catch(error => {
            return res.status(500).json({
                message: "Something Wrong",
                error:error
            });
        });
}

const getAllResources = (req, res) => {
    models.Resource.findAll()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({
                message: "Something Wrong"
            });
        });
}

const updatebyid=(req,res)=>{
    const resourceId=req.params.id;
    const userId=req.auth.payload.sub;
    const {name,description,price,quantity}=req.body;

    const updateResource={
        name:name,
        description:description,
        price:price,
        quantity:quantity
    };

    models.User.findByPk(userId)
        .then(user=>{
            if (!user) {
                return res.status(404).json({message:"User not found"});
            }
            return models.Resource.findOne({where:{id:resourceId}});
        })
        .then(resource=>{
            if (!resource) {
                return res.status(404).json({message:"Resource not found"});
            }
            if (resource.owner!== userId) {
                return res.status(403).json({message:"You are not authorized to update this resource" });
            }
            return resource.update(updateResource);
        })
        .then(()=>{
            return res.status(200).json({message:"Resource updated successfully"});
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({message:"Something went wrong"});
        });
};


const deleteById=(req,res)=>{
    const resourceId = req.params.id;
    const userId = req.auth.payload.sub;
    models.User.findByPk(userId)
        .then(user=>{
            if (!user) {
                return res.status(404).json({message:"User not found"});
            }
            return models.Resource.findOne({where:{id:resourceId}});
        })
        .then(resource=>{
            if (!resource){
                return res.status(404).json({message:"Resource not found"});
            }
            if (resource.owner!==userId) {
                return res.status(403).json({message:"You are not authorized to delete this resource"});
            }

            return resource.destroy();
        })
        .then(()=>{
            return res.status(200).json({message:"Resource deleted successfully"});
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json({message:"Something went wrong"});
        });
}
const searchResources = async (req, res) => {
    try {
        const searchname = (req.query.name.length)?req.query.name:"null";
        const searchdescription = (req.query.description.length)?req.query.description:"null";
        const result = await models.Resource.findAll({
            where:{
                [Op.or]:[
                    {name:{[Op.like]:'%'+searchname.toLowerCase()+'%'}},
                    {description:{[Op.like]:'%'+searchdescription.toLowerCase()+'%'}}
                ]
            }
        });

        if(!result.length)return res.status(200).json({message:"Not results found"})

        return res.status(200).json(result);
    } catch (e) {
        console.error("Error occurred:", e);
        return res.status(500).json({ message:"An error occurred" });
    }
}

module.exports = {
    getAllResources,
    getResourcesById,
    updatebyid,
    newResources,
    deleteById,
    searchResources
};
