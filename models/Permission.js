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
  is_physical: Boolean
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

  Object.freeze(that);

  return that;

}(permissionModel));

module.exports = Permission;
