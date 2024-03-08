const models=require('../models');
const {Op}=require('sequelize');

const getSkillsById=(req,res)=>{
    const id=req.params.id;
    models.Skill.findByPk(id).then(result=>{
        if(!result)return res.status(401).json({
            message:"Not Found"
        })
        return res.status(200).json(result);
    }).catch(error=>{
        return res.status(500).json({
            message:"Somthing error",
            error:error
        })
    });
}

const searchSkills=async (req,res)=>{
    try{
        const searchtitle=(req.query.title.length)?req.query.title:"null";
        const searchdescription=(req.query.description.length)?req.query.description:"null";
        const result= await models.Skill.findAll({
            where:{
                [Op.or]:[
                    {title:{[Op.like]:'%'+searchtitle.toLowerCase()+'%'}},
                    {description:{[Op.like]:'%'+searchdescription.toLowerCase()+'%'}}
                ]
            }
        })

        if(!result.length)return res.status(200).json({message:"Not results found"})

        return res.status(200).json(result);
    }catch(e){
        return res.status(500).json({ message:"An error occurred" });
    }
}

module.exports={
    getSkillsById,
    searchSkills
};