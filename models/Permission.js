var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var permissionSchema = new mongoose.Schema({
  name: String,
  description: String,
  is_physical: Boolean,
}, schemaOptions);

var permissionModel = mongoose.model('Permission', permissionSchema);

var Permission = (function(permissionModel) {

  var that = {};

  /**
   * Creates a new permission.
   * @param {Object} json - form
   *    {
   *      name:
   *      description:
   *      is_physical:
   *    }
   * @param {Function} callback - a function of form callback(err, newPermission)
   */
  that.create = function(json, callback) {
    var permission = new permissionModel(json);
    permission.save(function(err) {
      callback(err, permission);
    });
  };

  /**
   * Copy of findById
   */
  that.findById = function(id, callback) {
    permissionModel.findById(id, callback);
  };

  /**
   * Copy of remove function to delete documents
   */
  that.removeById = function(id, callback) {
    permissionModel.remove({_id: id}, callback);
  };

  that.ADMIN = {
    _id: 'ADMIN',
    name: 'administrator',
    description: 'Has all site permissions including adding members, changing roles, and scheduling events.',
    is_physical: false
  };
  Object.freeze(that.ADMIN);

  that.STORAGE = {
    _id: 'STORAGE',
    name: 'storage access',
    description: 'Has the ability to access the chapter\'s property in storage.',
    is_physical: true
  };
  Object.freeze(that.STORAGE);

  that.EBOARD = {
    _id: 'EBOARD',
    name: 'executive board member',
    description: 'An elected member of a chapter\'s governing body.',
    is_physical: true
  };
  Object.freeze(that.EBOARD);

  Object.freeze(that);

  return that;

}(permissionModel));

module.exports = Permission;
