var soap = require('soap');
var xmljs = require('xml2js');
var parser = new xmljs.Parser();
var util = require('util');

//test

var ibUrl = 'http://50.63.173.81/ibedc/service.asmx?WSDL';
var uname = 'ufugi384igi';
var pwd = '74djgg9d7fu';


//production
/*
var ibUrl = 'http://50.63.116.157/ibedcaggregator/service.asmx?WSDL';
var uname = 'ppg958tyg375';
var pwd = 'udur43829djgp';
*/

function xsdDateTime(date)
{
  function pad(n) {
	 var s = n.toString();
	 return s.length < 2 ? '0'+s : s;
  };

  var yyyy = date.getFullYear();
  var mm1  = pad(date.getMonth()+1);
  var dd   = pad(date.getDate());
  var hh   = pad(date.getHours());
  var mm2  = pad(date.getMinutes());
  var ss   = pad(date.getSeconds());

  return yyyy +'-' +mm1 +'-' +dd +'T' +hh +':' +mm2 +':' +ss;
}

exports.identify = function (meter, cb) {
    console.log('validate meter called');
    
    var args = {
        'tns:authuser': uname,
        'tns:authpwd': pwd,
        'tns:AccountNumber': meter
    };
    
    var meterInfo = {};
    
    soap.createClient(ibUrl, function(err, client) {
        if(err) {
            console.log('soap client error');
            cb(err);
        } else {
            console.log('client created. Testing meter %s', meter);
            client.Service.ServiceSoap.getCustomerInfo(args, function(err, result) {
                if(err) {
                    console.log(err);
                    cb(err);
                } else {
                    console.log('parsing');
                    parser.parseString(result.getCustomerInfoResult, function(err, result) {
                        if(err) {
                            console.log(err);
                            cb(err);
                        } else {
                            console.log(util.inspect(result, false, null));
                            var details = result.CustomerInfo;
                            cb(null, details.Details[0]);
                            //console.log(details.Details[0].CustomerName[0]);
                        }
                    });
                }
            });
        }
    });  
}

exports.pay = function(meter, ereceipt, amount, tref, customer, zone, bu, cb) {
    console.log('pay meter called');
    
    var args = {
        'tns:CustomerCategory': 'PostPaid',
        'tns:CustomerName': customer,
        'tns:authuser': uname,
        'tns:authpwd': pwd,
        'tns:AccountNumber': meter,
        'tns:TransRef': tref,
        'tns:EReceipt': ereceipt,
        'tns:Zone': zone,
        'tns:district': bu,
        'tns:pymtRef': tref,
        'tns:Channel': 2,
        'tns:MeterNum': meter,
        'tns:AmountPaid': amount,
        'tns:TransDate': xsdDateTime(new Date()),
        'tns:ConvenienceFee': 100,
        'tns:AmountRemitted': amount-100
    };
    
    soap.createClient(ibUrl, function(err, client) {
        if(err) {
            console.log('soap client error');
            cb(err);
        } else {
            console.log('client created. paying meter %s', meter);
            client.Service.ServiceSoap.logTransactions(args, function(err, result) {
                if(err) {
                    console.log(err);
                    cb(err);
                } else {
                    var status = result.logTransactionsResult[0];
                    var s = {};
                    if(status == '1'){
                        s.status = 'ok';
                        s.ereceipt = ereceipt;
                        s.amount = amount;
                        cb(null, s);
                        
                        //log transaction
                        //logger.voucherPayment(details, pin, meter, value);
                    } else if(status == '2') {
                        s.status = 'error - check details';
                        s.ereceipt = '';
                        cb(null, s);
                    } else if(status == '3') {
                        s.status = 'ereceipt number has been used for another meter';
                        s.ereceipt = '';
                        cb(null, s);
                    }else if(status == '4') {
                        s.status = 'wrong customer category';
                        s.ereceipt = '';
                        cb(null, s);
                    }
                }
            });
        }
    });  
}