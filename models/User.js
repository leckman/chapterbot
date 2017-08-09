var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var userSchema = new mongoose.Schema({
  name: String,
  preferred_name: String,
  birthday: Date,
  school_email: { type: String, unique: true },
  personal_email: { type: String, unique: true },
  preferred_contact_method: { type: String, default: "SCHOOL" },
  email_preferences: [String],
  pledge_class: String,
  graduation_date: String,
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  personal_permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, schemaOptions);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

userSchema.options.toJSON = {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

var userModel = mongoose.model('User', userSchema);

var User = (function(userModel) {

  var that = {};

  /**
   * Creates a new user.
   * @param {Object} json - form
   *    {
   *      name:
   *      preferred_name:
   *      birthday:
   *      school_email:
   *      personal_email:
   *      pledge_class:
   *      graduation_date:
   *      roles:
          personal_permissions:
   *    }
   * @param {Function} callback - a function of form callback(err, newUser)
   */
  that.create = function(json, callback) {
    var user = new userModel(json);
    user.save(function(err) {
      callback(err, user);
    });
  };

  /**
   * Validates that a password reset token is valid and unexpired
   * If so, returns the associated user
   * @param {String} token - the password reset token provided to the user
   * @param {Function} callback - a function of the form callback(error, user)
   */
  that.validatePasswordReset = function(token, callback) {

    userModel.findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .exec(callback);
  };

  /**
   * Copy of findById
   */
  that.findById = function(userid, callback) {
    userModel.findById(userid, callback);
  };

  /**
   * Gets all permissions for a user designated by a given id
   * when finished, calls callback(err, permissions)
   */
  that.getPermissionsForId = function(id, callback) {
    userModel.findById(id, function(err, user) {
      if (err) {
        callback(err);
        return;
      }

      // permissions of a user is the union of their personal permissions
      // and permissions held by their roles

      // TODO populate permissions from roles
      var rolePermissions =

      allPermissions = set(rolePermissions).junction(user.personal_permissions);
      callback(null, allPermissions);
    });
  }

  /**
   * Copy of remove function to delete documents
   */
  that.removeById = function(id, callback) {
    userModel.remove({_id: id}, callback);
  };

  Object.freeze(that);

  return that;

}(userModel));

module.exports = User;
