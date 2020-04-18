const errorStatus = (error) => {
  return error.status ? error.status : 500;
};

const errorInfo = (error) => {
 if(process.env.NODE_ENV === 'production') {
     return error.info ? error.info : 'Internal Server Error';
 }else{
     return error.info ? error.info : error;
 }
};

const badRequest = (message) => {
    return {
        status:400,
        info:message
    }
};

module.exports = {
    errorInfo,
    errorStatus,
    badRequest
};