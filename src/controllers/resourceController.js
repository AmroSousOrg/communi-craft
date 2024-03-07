const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");

const handleNotFoundError=(entity,next) => {
    return next(new CustomError(`${entity} Not Found`,404));
};

const newResources=(req,res,next)=>{
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
            return handleNotFoundError('User',next);
        }
        return models.Resource.create(resources).then(result=>{
                return res.status(201).json({
                    message: "Created Successfully",
                })
            }).catch(error=>{
                next(error);
            });
        
    }).catch(error=>{
        next(error);
    })
}

const getResourcesById = (req, res,next) => {
    const id = req.params.id;
    models.Resource.findByPk(id)
        .then(result => {
            if(!result){
                return handleNotFoundError('Resource',next);
            }
            return res.status(200).json({
                result
            });
        })
        .catch(error => {
           next(error);
        });
}

const getAllResources = (req, res,next) => {
    models.Resource.findAll()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            next(error);
        });
}

const updateById=(req,res,next)=>{
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
                return handleNotFoundError('User',next);
            }
            return models.Resource.findOne({where:{id:resourceId}});
        })
        .then(resource=>{
            if (!resource) {
                return handleNotFoundError('Resource',next);
            }
            if (resource.owner!== userId) {
                return next(new CustomError("You are not authorized to update this resource", 403));
            }
            return resource.update(updateResource);
        })
        .then(()=>{
            return res.status(200).json({message:"Resource Updated successfully"});
        })
        .catch(error => {
            next(error);
        });
};


const deleteById=(req,res,next)=>{
    const resourceId = req.params.id;
    const userId = req.auth.payload.sub;
    models.User.findByPk(userId)
        .then(user=>{
            if (!user) {
                return handleNotFoundError('User',next);
            }
            return models.Resource.findOne({where:{id:resourceId}});
        })
        .then(resource=>{
            if (!resource){
                return handleNotFoundError('Resource',next);
            }
            if (resource.owner!==userId) {
                return next(new CustomError("You are not authorized to update this resource", 403));
            }

            return resource.destroy();
        })
        .then(()=>{
            return res.status(200).json({message:"Resource Deleted Successfully"});
        })
        .catch(error => {
            next(error);
        });
}

const searchResources = async (req,res,next) => {
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

        return(!result.length)?handleNotFoundError('Resource',next):res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllResources,
    getResourcesById,
    updateById,
    newResources,
    deleteById,
    searchResources
};
