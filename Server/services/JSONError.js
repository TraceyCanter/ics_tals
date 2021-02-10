// Constructor
function JSONError(status, message) {

    Error.prototype.constructor.call(this, status + ': ' + message);
    this.status = status;
    this.message = message;
};

JSONError.prototype = Object.create(Error);
JSONError.prototype.constructor = JSONError;


module.exports = JSONError;