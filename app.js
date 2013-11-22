var Percolator = require('percolator').Percolator;
var CRUDCollection = require('percolator').CRUDCollection;

var server = new Percolator();
var ibadan = require('./modules/ibadan');
var ibadanTest = require('./modules/ibadanTest');

server.route('/', {
    GET: function(req, res) {
        res.object({message: 'Hello!'}).send();
    }
});
/*
var ibIdenSchema = {
    CustomerName: "string",
    AccountNumber: "string",
    Address: "string",
    BillPeriod: "string",
    CurrentBill: "string",
    BusinessUnit: "string",
    Zone: "string",
    EReceipt: "string"
};

var ibIdenCollection = new CRUDCollection({
    schema: ibIdenSchema,
    
    create: function(req, res, obj, cb) {
        cb();
    },
    
    update: function(req, res, id, obj, cb) {
        cb();
    },
    
    destroy: function(req, res, id, cb) {
        cb();
    },
    
    list: function(req, res, cb) {
        var objects = undefined;
        return cb(null, objects);
    },
    
    fetch: function(req, res, cb) {
        var id = req.uri.child();
        ibadan.identify(id, function(err, resp) {
            if(err) {
                return cb(err, null);
            } else {
                if(resp) {
                    var foundObject = {
                        CustomerName: resp.CustomerName[0],
                        AccountNumber: resp.AccountNumber[0],
                        Address: resp.Address[0],
                        BillPeriod: resp.BillPeriod[0],
                        CurrentBill: resp.currentbill[0],
                        BusinessUnit: resp.BusinessUnit[0],
                        Zone: resp.Zone[0],
                        EReceipt: resp.EReceipt[0]
                    };
                    return cb(null, foundObject);
                }
            }
        });
        
    }
});

server.route('/ibadan', ibIdenCollection.handler);
server.route('/ibadan/:id', ibIdenCollection.wildcard);
*/

server.route('/ibadan/:id', {
    GET: function(req, res) {
        var id = req.uri.child(); console.log(id);
        ibadan.identify(id, function(err, resp) {
            if(err) {
                res.status.notFound();
                //res.object({}).send();
            } else {
                if(resp) {
                    var foundObject = {
                        CustomerName: resp.CustomerName[0],
                        AccountNumber: resp.AccountNumber[0],
                        Address: resp.Address[0],
                        BillPeriod: resp.BillPeriod[0],
                        CurrentBill: resp.currentbill[0],
                        BusinessUnit: resp.BusinessUnit[0],
                        Zone: resp.Zone[0],
                        EReceipt: resp.EReceipt[0]
                    };
                    res.object(foundObject).send();
                }
            }
        });
        
    }
});
server.route('/ibadan/:id/:ereceipt/:amount/:tref/:customer/:zone/:bu', {
    basicAuthenticate: function(username, password, req, res, cb) {
        return cb(true);
    },
    
    POST: function(req, res) {
        var path = req.uri.path();
        console.log(path);
        
        var parts = path.split('/');
        var meter = parts[2]; console.log(meter);
        var ereceipt = parts[3]; console.log(ereceipt);
        var amount = parts[4]; console.log(amount);
        var tref = parts[5]; console.log(tref);
        var customer = req.uri.decode(parts[6]); console.log(customer);
        var zone = req.uri.decode(parts[7]); console.log(zone);
        var bu = req.uri.decode(parts[8]); console.log(bu);
        
        ibadan.pay(meter, ereceipt, amount, tref, customer, zone, bu, function(err, resp) {
            if(err) {
                res.status.notFound();
            } else {
                if(resp) {
                    res.object(resp).send();
                }
            }
        });
    }
});

server.route('/test/ibadan/:id', {
    GET: function(req, res) {
        var id = req.uri.child(); console.log(id);
        ibadanTest.identify(id, function(err, resp) {
            if(err) {
                res.status.notFound();
                //res.object({}).send();
            } else {
                if(resp) {
                    var foundObject = {
                        CustomerName: resp.CustomerName[0],
                        AccountNumber: resp.AccountNumber[0],
                        Address: resp.Address[0],
                        BillPeriod: resp.BillPeriod[0],
                        CurrentBill: resp.currentbill[0],
                        BusinessUnit: resp.BusinessUnit[0],
                        Zone: resp.Zone[0],
                        EReceipt: resp.EReceipt[0]
                    };
                    res.object(foundObject).send();
                }
            }
        });
        
    }
});
server.route('/test/ibadan/:id/:ereceipt/:amount/:tref/:customer/:zone/:bu', {
    /*
    basicAuthenticate: function(username, password, req, res, cb) {
        var user = require('./models/thirdPartyTest');
        user.connect('mongodb://nodejitsu_johnthas:o56jk26qemf6js2v0dsa70plir@ds045978.mongolab.com:45978/nodejitsu_johnthas_nodejitsudb5477107579');
        
        user.read(username, function(err, doc) {
            if(err) {
                return cb(true);
            } else {
                if(doc) { console.log(doc);
                    if(('password' in doc) && doc.password == password) {
                        user.disconnect();
                        return cb(null, doc);
                    }
                } else {
                    return cb(true);
                }
            }
        });
    },
    */
    POST: function(req, res) {
        var path = req.uri.path();
        console.log(path);
        
        var parts = path.split('/');
        var meter = parts[3]; console.log(meter);
        var ereceipt = parts[4]; console.log(ereceipt);
        var amount = parts[5]; console.log(amount);
        var tref = parts[6]; console.log(tref);
        var customer = req.uri.decode(parts[7]); console.log(customer);
        var zone = req.uri.decode(parts[8]); console.log(zone);
        var bu = req.uri.decode(parts[9]); console.log(bu);
        
        ibadanTest.pay(meter, ereceipt, amount, tref, customer, zone, bu, function(err, resp) {
            if(err) {
                res.status.notFound();
            } else {
                if(resp) {
                    res.object(resp).send();
                }
            }
        });
    }
});

server.listen(function() {
    console.log(server.server.router.routes);
    console.log('server is listening on port ', server.port);
});