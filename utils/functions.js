const errorStatus = (error) => {
    return error.status ? error.status : 500;
};

const errorInfo = (error) => {
    if (process.env.NODE_ENV === 'production') {
        return error.message ? error.message : 'Internal Server Error';
    } else {
        return error.message ? error.message : error;
    }
};

const badRequest = (message) => {
    return {
        status: 400,
        message: message
    }
};

const isArray = (parameter, name) => {
    if (!Array.isArray(parameter)) throw badRequest(`${name} must be an array!`);
    if(parameter.length === 0) throw badRequest(`${name} is empty`);

    return true;

};

const parseString = (string, name) => {
    if(typeof string === 'string') {
        try {
            return JSON.parse(string);
        } catch (e) {
            throw badRequest(`Wrong ${name} object!`)
        }
    }else return string;
};

module.exports = {
    parseString,
    errorInfo,
    errorStatus,
    badRequest,
    isArray
};