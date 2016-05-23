/**
 * User
 * @description :: Model for storing users
 */
module.exports = {
    schema: true,
    attributes: {
        password: {
            type: 'string'
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },
        name: {
            type: 'string',
            defaultsTo: ''
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    beforeUpdate: function (values, next) {
        TokenService.hashPassword(values);
        next();
    },
    beforeCreate: function (values, next) {
        TokenService.hashPassword(values);
        next();
    }
};
