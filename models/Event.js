var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  organizer: { type: Schema.ObjectId, ref: 'User' },
  requirements: [{ type: Schema.ObjectId, ref: 'Requirement' },
  when: Date,
  is_recruitment: Boolean
}, schemaOptions);

var eventModel = mongoose.model('Event', eventSchema);

var Event = (function(eventModel) {

  var that = {};

  /**
   * Creates a new event.
   * @param {Object} json - form
   *    {
   *      name:
   *      description:
   *      organizer:
   *      requirements:
   *      time:
   *      is_recruitment:
   *    }
   * @param {Function} callback - a function of form callback(err, newEvent)
   */
  that.create = function(json, callback) {
    var newEvent = new eventModel(json);
    newEvent.save(function(err) {
      callback(err, newEvent);
    });
  };

  /**
   * Copy of findById
   */
  that.findById = function(id, callback) {
    eventModel.findById(id, callback);
  };

  /**
   * Copy of remove function to delete documents
   */
  that.removeById = function(id, callback) {
    eventModel.remove({_id: id}, callback);
  };

  Object.freeze(that);

  return that;

}(eventModel));

module.exports = Event;
