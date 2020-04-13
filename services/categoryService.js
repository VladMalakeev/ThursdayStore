const db = require('../db/index');
const categoryModel = require('../db/models/categories');
const stringsService = require('../services/StringServise');
const imagesService = require('../services/imagesService');
const languageService = require('../services/languageServise');
const constants = require('../utils/Constants');

const addCategory = async (body, file) => {
    return db.transaction()
        .then(async transaction => {
            try {JSON.parse(body.name)}
            catch (e) {throw 'Wrong name object';}

            let string = await stringsService.addString(JSON.parse(body.name), transaction);
            let image = await imagesService.addImage(file.filename, transaction);
            return categoryModel.create({nameId:string.id, imageId:image.id}, {transaction, returning:true})
                .then(async category => {
                    transaction.commit();
                    return getCategories(category.id, 'eng', true);
                }).catch(error => {
                    console.log(error);
                    throw 'An error occurred, try again later.';
                })
            })
        .catch(error => {
            throw error
        })

};

const getCategories = async (id, lang = constants.DefaultLanguage, admin) => {
    if(! await languageService.checkLanguageByKey(lang)) throw 'Wrong language key.';
    if(id){
        if(!parseInt(id)) throw 'Invalid category id.';
        return categoryModel.findOne(
            {
                where:{id:id},
                attributes:['id'],
                include:[{association:'strings', attributes:{exclude:['id']}}, {association:'images'}]
            })
            .then(category => {
                return {
                    id:category.id,
                    name:admin ? category.strings : category.strings[lang],
                    image:category.images.name
                }
            })
            .catch(error => {
                console.log(error);
                throw 'An error occurred, try again later.';
            })
    }else{
        return categoryModel.findAll({
            attributes:['id'],
            include:[
                {association:'strings', attributes:{exclude:['id']}},
                {association:'images', attributes:['name']}
                ]
        }).then(categories => {
            let resultList = [];
            categories.forEach(category => {
                resultList.push({
                    id:category.id,
                    name: admin ? category.strings : category.strings[lang],
                    image:category.images.name
                })
            });
            return resultList;
        })
            .catch(error => {
                console.log(error);
                throw 'An error occurred, try again later.';
            })
    }

};

module.exports = {
    addCategory,
    getCategories
};
