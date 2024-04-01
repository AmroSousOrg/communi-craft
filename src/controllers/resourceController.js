const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");
const { error } = require("winston");

const handleNotFoundError=(entity,next) => {
    return next(new CustomError(`${entity} Not Found`,404));
};

const newResources=(req,res,next)=>{

    const {name,description,price,quantity}=req.body;
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
    const limet=req.query.limit;
    const page=req.query.page;

    models.Resource.findAll()
        .then(result => {
            result=result.slice(((page-1)*limet),(page*limet));
            return ((result.length))?res.status(200).json({page:page,datasize:result.length,result:result}):res.status(200).json({page:page, result:"No Data"});
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

const buyResources=(req,res,next)=>{

    const resourceId=req.params.id;
    const userId=req.auth.payload.sub;

    models.User.findByPk(userId).then(user=>{

        if(!user)return handleNotFoundError("User",next);

        return models.Resource.findOne({where:{id:resourceId}});

    }).then(resource=>{

        if(!resource)return handleNotFoundError("Resource",next);

        if(resource.owner===userId){
            return next(new CustomError("You are owner you cant buy your resources", 403));
        }

        if(resource.quantity===0)return next(new CustomError("This resource is no available",400));

        const quantity=(resource.quantity-1);
        return resource.update({quantity:quantity});
    }).then(()=>{
        return res.status(200).json({message:"Resource Buyed Successfully"});
    }).catch(error=>{
        return next(error);
    })


}

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

const searchResources=async(req, res, next)=>{
    try {
        
        const {name,description,min_price,max_price,min_qty}=req.query;

        const searchname=(name&&name.length)?name:null;
        const searchdescription=(description&&description.length)?description:null;
        const minPrice=(min_price&&min_price.length)?min_price:-1;
        const maxPrice=(max_price&&max_price.length)?max_price:-1;
        const minQty=(min_qty&&min_qty.length)?min_qty:-1;
        const searchWhere={};

        if(searchname){
            searchWhere.name={[Op.like]:'%'+searchname.toLowerCase()+'%'};
        }
        
        if(searchdescription){
            searchWhere.description={[Op.like]:'%'+searchdescription.toLowerCase()+'%'};
        }

        if(minPrice!=-1&&maxPrice!=-1){
            searchWhere.price={[Op.between]:[minPrice,maxPrice]};
        }else {
            if(minPrice!=-1){
                searchWhere.price={[Op.gte]:minPrice};
            }
            if(maxPrice!=-1){
                searchWhere.price={[Op.lte]:maxPrice};
            }
        }
        
        if(minQty!=-1){
            searchWhere.quantity={[Op.gte]:minQty}
        }

        const result=await models.Resource.findAll({
            where:searchWhere
        });

        return(!result.length)?handleNotFoundError('Resource',next):res.status(200).json(result);

    }catch(error){
        next(error);
    }
}


module.exports = {
    getAllResources,
    getResourcesById,
    updateById,
    newResources,
    deleteById,
    searchResources,
    buyResources
};
