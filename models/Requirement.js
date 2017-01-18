var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var requirementSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadline: Date,
  required_permissions: [{ type: Schema.ObjectId, ref: 'Permission' }],
  assigned: [{ type: Schema.ObjectId, ref: 'User' }]
}, schemaOptions);

var requirementModel = mongoose.model('Requirement', requirementSchema);

var Requirement = (function(requirementModel) {

  var that = {};

  /**
   * Creates a new requirement.
   * @param {Object} json - form
   *    {
   *      name:
   *      description:
   *      deadline:
   *      required_permissions:
   *      assigned:
   *    }
   * @param {Function} callback - a function of form callback(err, newRequirement)
   */
  that.create = function(json, callback) {
    var newRequirement = new requirementModel(json);
    newRequirement.save(function(err) {
      callback(err, newRequirement);
    });
  };

  /**
   * Copy of findById
   */
  that.findById = function(id, callback) {
    requirementModel.findById(id, callback);
  };

  /**
   * Copy of remove function to delete documents
   */
  that.removeById = function(id, callback) {
    requirementModel.remove({_id: id}, callback);
  };

  Object.freeze(that);

  return that;

}(requirementModel));

module.exports = Requirement;
