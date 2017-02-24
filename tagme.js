var fs = require("fs");
var request = require('request');
var cheerio = require('cheerio');
var tagme_input = './input_data/tagme_input.txt';
var tagme_api = require('./tagme_api');

//var async = require('async');


fs.readFile(tagme_input,function(err_articoli, input_data) {
  if(err_articoli) {
    console.log(err_articoli);
  }

var output_data = [];

for(var i=0; i<10;i++){
  var body_entities = [];
  var abstract_entities = [];

  var testo = JSON.parse(input_data.toString());
  var body = testo[i].body;
  var abstract = testo[i].abstract;
  var title = testo[i].title;

  tagme_api(abstract,function(err,result){

    abstract_entities.concat(result);
    //console.log(abstract_entities);

  });
  while(abstract_entities.length==0)
    console.log(abstract_entities);

  console.log(abstract_entities);



//   abstract_result = request('https://tagme.d4science.org/tagme/tag?lang=en&gcube-token=fdb15e10-ae52-4f10-bd07-005e92d627ea-843339462&text='+abstract, function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//       abstract_result = JSON.parse(html);
//       var annotations = abstract_result.annotations;
//
//       for(var i=0;i<annotations.length;i++){
//         var temp = annotations[i];
//
//         var first = temp.spot.charAt(0);
//         if (first !== first.toLowerCase() && first === first.toUpperCase()){
//           abstract_entities.push(temp.spot);
//
//           }
//         }
//
//     }
//
//     var temp_data = {title: title, part:"1", abstract: abstract_entities};
//
//     fs.appendFile('./output_data/tagme_output.txt', JSON.stringify(output_data[i]), function(err) {
//       if(err) {
//       console.log(err);
//       }
//     })
// });
//
//   var body_split = body.split('\n');
//   var body_result;
//
//   for(var j=0;j<body_split.length;j++){
//
//     body_result = request('https://tagme.d4science.org/tagme/tag?lang=en&gcube-token=fdb15e10-ae52-4f10-bd07-005e92d627ea-843339462&text='+body_split[j], function (error, response, html) {
//       if (!error && response.statusCode == 200) {
//         body_result = JSON.parse(html);
//         var annotations = body_result.annotations;
//
//         for(var k=0;k<annotations.length;k++){
//           var temp = annotations[k];
//
//           var first = temp.spot.charAt(0);
//           if (first !== first.toLowerCase() && first === first.toUpperCase()){
//             body_entities.push(temp.spot);
//           }
//         }
//
//       var temp_data = {title: title, part:"2", body: body_entities};
//
//       fs.appendFile('./output_data/tagme_output.txt', JSON.stringify(temp_data), function(err) {
//         if(err) {
//         console.log(err);
//         }
//       })
//     }
//     });
  }



});
