const { error } = require('winston');
const models=require('../models');
const {Op}=require('sequelize');
const CustomError = require("../util/customError");

const handleNotFoundError=(entity,next) => {
    return next(new CustomError(`${entity} Not Found`,404));
};

const getSkillsById=(req,res,next)=>{
    console.log("dd");
    const id = req.params.id;
    models.Skill.findByPk(id).then(result => {
            if(!result){
                return handleNotFoundError('Skill',next);
            }
            return res.status(200).json(result);
        })
        .catch(error=>{
           next(error);
        });
}

const getAllSkills=(req,res,next)=>{
    const limit=req.query.limit;
    const page=req.query.page;
    console.log("skill");
    models.Skill.findAll().then(result=>{
        result=result.slice(((page-1)*limit),(page*limit));

        return ((result.length))?res.status(200).json({page:page,datasize:result.length,result:result}):res.status(200).json({page:page, result:"No Data"});

    }).catch(error=>{
        return next(error);
    })
}

const searchSkills=async (req,res,next)=>{
    try{
        const {title,description}=req.query;
        const searchtitle=(title&&title.length)?title:null;
        const searchdescription=(description&&description.length)?description:null;

        const searchWhere={};

        if(searchtitle){
            searchWhere.title={[Op.like]:'%'+searchtitle.toLowerCase()+'%'};
        }
        
        if(searchdescription){
            searchWhere.description={[Op.like]:'%'+searchdescription.toLowerCase()+'%'};
        }
        const result=await models.Skill.findAll({
            where:searchWhere
        });

        if(!result.length)return handleNotFoundError("Skill",next)

        return res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

const updateById=(req,res,next)=>{
    const skillId=req.params.id;
    const {title,description}=req.body;
    
    const updateSkill={
        title:title,
        description:description
    };
    
    models.Skill.findByPk(skillId)
        .then(result=>{
            if (!result) {
                return handleNotFoundError('Skill',next);
            }
            result.update(updateSkill);
            return res.status(200).json({message:"Skill Updated successfully"});

        })
        .catch(error => {
            next(error);
        });
};

const newSkill=(req,res,next)=>{

    const {title,description}=req.body;

    const skills={
        title:title,
        description:description,
    }

    models.Skill.create(skills).then(result=>{
        return res.status(201).json({
            message: "Created Successfully",
            result:result
        });
    })
    .catch(error=>{
        next(error);
    });

}

const deleteById=(req,res,next)=>{

    const skillId = req.params.id;

    models.Skill.findByPk(skillId)
        .then(skills=>{
            if (!skills){
                return handleNotFoundError('Skill',next);
            }
            skills.destroy();
            return res.status(200).json({message:"Skill Deleted Successfully"});

        })
        .catch(error => {
            next(error);
        });
}


module.exports={
    getSkillsById,
    searchSkills,
    getAllSkills,
    updateById,
    newSkill,
    deleteById
};