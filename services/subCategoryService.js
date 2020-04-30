const db = require('../db/index');
const categoryModel = require('../db/models/categories');
const subCategoryModel = require('../db/models/subCategories');
const stringsService = require('../services/stringService');
const imagesService = require('../services/imagesService');
const languageService = require('../services/languageService');
const constants = require('../utils/Constants');
const functions = require('../utils/functions');
const categoryService = require('./categoryService');

const addSubCategory = async (body, file) => {
    return db.transaction()
        .then(async transaction => {
            if(!body.name) throw functions.badRequest('Name is required');
            if(!await categoryService.isExistCategory(body.catId)) functions.badRequest('Wrong catId parameter');

            let string = await stringsService.addString(body.name, transaction);
            let image = await imagesService.addImage(file.filename, transaction);
            return subCategoryModel.create({nameId:string.id, categoryId:body.catId, imageId:image.id}, {transaction, returning:true})
                .then(async subCategory => {
                    transaction.commit();
                    return getSubCategories(subCategory.id, null, 'eng', true);
                }).catch(error => {
                    console.log(error);
                    throw error;
                })
        })
        .catch(error => {
            throw error
        })
};

const getSubCategories = async (id, catId, lang = constants.DefaultLanguage, admin) => {
    if(! await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    if(id){
        if(!parseInt(id)) throw functions.badRequest('Invalid subCategory id');
        return subCategoryModel.findOne(
            {
                where:{id:id},
                attributes:['id'],
                include:[{association:'name', attributes:{exclude:['id']}}, {association:'image'}]
            })
            .then(subCategory => {
                return {
                    id:subCategory.id,
                    name:admin ? subCategory.name : subCategory.name[lang],
                    image:subCategory.image.name
                }
            })
            .catch(error => {
                console.log(error);
                throw error;
            })
    }else{
        return subCategoryModel.findAll({
            where:{categoryId:catId},
            attributes:['id'],
            include:[
                {association:'name', attributes:{exclude:['id']}},
                {association:'image', attributes:['name']}
            ]
        }).then(subCategories => {
            let resultList = [];
            subCategories.forEach(subCategory => {
                resultList.push({
                    id:subCategory.id,
                    name: admin ? subCategory.name : subCategory.name[lang],
                    image:subCategory.image.name
                })
            });
            return resultList;
        })
            .catch(error => {
                console.log(error);
                throw error;
            })
    }

};

const editSubCategory = async (id, catId, image, name) => {
    return subCategoryModel.findOne({where:{id:id}})
        .then(subCategory => {
            if(!subCategory) throw functions.badRequest('Wrong id');
            return db.transaction()
                .then(async transaction => {
                    let Obj = {};
                    let newString = await stringsService.editString(name, subCategory.nameId, transaction);
                    Obj.nameId = newString.id;
                    if(image){
                        let newImage = await imagesService.updateImage(subCategory.imageId, image.filename, 'subcategories', transaction);
                        Obj.imageId = newImage.id;
                    }
                    if(catId){
                        if(!await categoryService.isExistCategory(catId)) functions.badRequest('Wrong catId parameter');
                        Obj.categoryId = catId;
                    }
                    return subCategory.update(Obj, {returning:true, transaction})
                        .then(result => {
                            transaction.commit();
                            return getSubCategories(result.id, null, 'eng', true)
                        })
                        .catch(error => {
                            transaction.rollback();
                            throw error;
                        })
                }).catch(error => {
                    throw error;
                });

        })
        .catch(error => {
            console.log(error);
            throw error;
        })
};

const deleteSubCategory = async (id) => {
    return subCategoryModel.findOne({where:{id}})
        .then(subCategory => {
            if(!subCategory) throw functions.badRequest('Wrong subCategory id');
            return  db.transaction()
                .then(transaction => {
                    return subCategory.destroy()
                        .then(async result => {
                            await imagesService.deleteImage(subCategory.imageId, 'subcategories', transaction);
                            await stringsService.deleteString(subCategory.nameId, transaction);
                            transaction.commit();
                            return true
                        })
                        .catch(error => {
                            transaction.rollback();
                            throw error;
                        })
                })
                .catch(error => {
                    throw error;
                })

        })
        .catch(error => {
            throw error
        })
};

const isExistSubCategory = async (id) => {
    return subCategoryModel.findOne({where:{id}})
};
module.exports = {
    addSubCategory,
    getSubCategories,
    editSubCategory,
    deleteSubCategory,
    isExistSubCategory
};