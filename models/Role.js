var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var roleSchema = new mongoose.Schema({
  term_start: Date,
  term_end: Date,
  min_num_users: Number,
  max_num_users: Number,
  permissions: [{ type: Schema.ObjectId, ref: 'Permission'}]
}, schemaOptions);

var roleModel = mongoose.model('Role', roleSchema);

var Role = (function(roleModel) {

  var that = {};

  /**
   * Creates a new role.
   * @param {Object} json - form
   *    {
   *      term_start:
   *      term_end:
   *      min_num_users:
   *      max_num_users:
   *      permissions:
   *    }
   * @param {Function} callback - a function of form callback(err, newRole)
   */
  that.create = function(json, callback) {
    var role = new roleModel(json);
    role.save(function(err) {
      callback(err, role);
    });
  };

  /**
   * Copy of findById
   */
  that.findById = function(id, callback) {
    roleModel.findById(id, callback);
  };

  /**
   * Copy of remove function to delete documents
   */
  that.removeById = function(id, callback) {
    roleModel.remove({_id: id}, callback);
  };

  Object.freeze(that);

  return that;

}(roleModel));

module.exports = Role;
