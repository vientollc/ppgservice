var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dburl = undefined;
var moment = require('moment');

exports.connect = function(url, callback) {
    dburl = url;
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

var tpProdSchema = mongoose.Schema({
    username: String,
    password: String,
    company: String
});

var USER = mongoose.model('ThirdPartyProd', tpProdSchema);

exports.create = function(username, password, company, callback){
    var user = new USER();
    user.username = username;
    user.password = password;
    user.company = company;
    user.save(function(err) {
        if(err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

exports.update = function(username, password, company, callback) {
    exports.read(username, function(err, doc) {
        if(err) {
            callback(err);
        } else {
            doc.password = password;
            doc.company = company;
            doc.save(function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
}

exports.read = function(username, callback) {
    USER.findOne({username: username}, function(err, doc) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, doc);
        }
    });
}

exports.list = function(callback) {
    USER.find().exec(function(err, docs) {
        if(err) {
            callback(err);
        } else {
            if(docs) {
                callback(null, docs);
            } else {
                callback(null, null);
            }
        }
    });
}