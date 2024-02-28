const models=require('../models');

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

module.exports={
    getSkillsById
};