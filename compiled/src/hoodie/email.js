// Generated by CoffeeScript 1.3.3
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define('hoodie/email', function() {
  var Email;
  return Email = (function() {

    function Email(hoodie) {
      this.hoodie = hoodie;
      this._handle_email_update = __bind(this._handle_email_update, this);

    }

    Email.prototype.send = function(email_attributes) {
      var attributes, defer,
        _this = this;
      if (email_attributes == null) {
        email_attributes = {};
      }
      defer = this.hoodie.defer();
      attributes = $.extend({}, email_attributes);
      if (!this._is_valid_email(email_attributes.to)) {
        attributes.error = "Invalid email address (" + (attributes.to || 'empty') + ")";
        return defer.reject(attributes).promise();
      }
      this.hoodie.store.create('$email', attributes).then(function(obj) {
        return _this._handle_email_update(defer, obj);
      });
      return defer.promise();
    };

    Email.prototype._is_valid_email = function(email) {
      if (email == null) {
        email = '';
      }
      return /@/.test(email);
    };

    Email.prototype._handle_email_update = function(defer, attributes) {
      var _this = this;
      if (attributes == null) {
        attributes = {};
      }
      if (attributes.error) {
        return defer.reject(attributes);
      } else if (attributes.delivered_at) {
        return defer.resolve(attributes);
      } else {
        return this.hoodie.one("remote:updated:$email:" + attributes.id, function(attributes) {
          return _this._handle_email_update(defer, attributes);
        });
      }
    };

    return Email;

  })();
});
