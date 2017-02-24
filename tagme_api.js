var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require("fs");

module.exports = function(text, callback){

  var url = 'https://tagme.d4science.org/tagme/tag?lang=en&gcube-token=fdb15e10-ae52-4f10-bd07-005e92d627ea-843339462&text='+text;
  var output_data = [];

  request({
  uri: url,
  method: "POST",
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
}, function(err, res, body) {
    if (!err && res.statusCode == 200) {

      let json = JSON.parse(body);
      var annotations = json.annotations;

      for(var i=0;i<annotations.length;i++){
        var temp = annotations[i];
        var first = temp.spot.charAt(0);

        if (first !== first.toLowerCase() && first === first.toUpperCase()){
          output_data.push(temp.spot);

          }
        }

        return callback(null, output_data);
    }
  });

}
