const db = require('../db/index');
const categoryModel = require('../db/models/categories');
const stringsService = require('../services/stringServise');
const imagesService = require('../services/imagesService');
const languageService = require('../services/languageServise');
const constants = require('../utils/Constants');
const functions = require('../utils/functions');

const addCategory = async (body, file) => {
    return db.transaction()
        .then(async transaction => {
            if(!body.name) throw functions.badRequest('Name is required');

            let string = await stringsService.addString(body.name, transaction);
            let image = await imagesService.addImage(file.filename, transaction);
            return categoryModel.create({nameId:string.id, imageId:image.id}, {transaction, returning:true})
                .then(async category => {
                    transaction.commit();
                    return getCategories(category.id, 'eng', true);
                }).catch(error => {
                    console.log(error);
                    throw error;
                })
            })
        .catch(error => {
            throw error
        })
};

const getCategories = async (id, lang = constants.DefaultLanguage, admin) => {
    if(! await languageService.checkLanguageByKey(lang)) throw functions.badRequest('Wrong language key');
    if(id){
        if(!parseInt(id)) throw functions.badRequest('Invalid category id');
        return categoryModel.findOne(
            {
                where:{id:id},
                attributes:['id'],
                include:[{association:'name', attributes:{exclude:['id']}}, {association:'image'}]
            })
            .then(category => {
                return {
                    id:category.id,
                    name:admin ? category.name : category.name[lang],
                    image:category.image.name
                }
            })
            .catch(error => {
                console.log(error);
                throw error;
            })
    }else{
        return categoryModel.findAll({
            attributes:['id'],
            include:[
                {association:'name', attributes:{exclude:['id']}},
                {association:'image', attributes:['name']}
                ]
        }).then(categories => {
            let resultList = [];
            categories.forEach(category => {
                resultList.push({
                    id:category.id,
                    name: admin ? category.name : category.name[lang],
                    image:category.image.name
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

const editCategory = async (id, image, name) => {
    return categoryModel.findOne({where:{id:id}})
        .then(category => {
            if(!category) throw functions.badRequest('Wrong id');
           return db.transaction()
               .then(async transaction => {
                let Obj = {};
                let newString = await stringsService.editString(name, category.nameId, transaction);
                Obj.nameId = newString.id;
                if(image){
                  let newImage = await imagesService.updateImage(category.imageId, image.filename, 'categories', transaction);
                  Obj.imageId = newImage.id;
                }
               return category.update(Obj, {returning:true, transaction})
                   .then(result => {
                       transaction.commit();
                       return getCategories(result.id, 'eng', true)
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

const deleteCategory = async (id) => {
    return categoryModel.findOne({where:{id}})
        .then(category => {
            if(!category) throw functions.badRequest('Wrong category id');
            return  db.transaction()
                .then(transaction => {
                   return category.destroy()
                       .then(async result => {
                           await imagesService.deleteImage(category.imageId, 'categories', transaction);
                           await stringsService.deleteString(category.nameId, transaction);
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

const isExistCategory = async (id) => {
     return categoryModel.findOne({where:{id}})
};

module.exports = {
    addCategory,
    getCategories,
    deleteCategory,
    editCategory,
    isExistCategory
};
