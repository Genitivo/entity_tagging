var fs = require("fs");
var request = require('request');
var cheerio = require('cheerio');
var tagme_input = './input_data/tagme_input.txt';

//var async = require('async');
var tagme_token = 'https://tagme.d4science.org/tagme/tag?lang=en&gcube-token=fdb15e10-ae52-4f10-bd07-005e92d627ea-843339462&text=';
var body_entities = [];
var abstract_entities = [];
var output_data = [];
let title = "";

var count = 0;
var body_lenght = 0;
var ajaxCallsRemaining = 0;

fs.readFile(tagme_input,function(err_articoli, input_data) {
  if(err_articoli) {
    console.log(err_articoli);
  }

  var input = JSON.parse(input_data.toString());

    let i = 53;

    title = input[i].title;
    console.log(title);

    var body = input[i].body;
    var abstract = input[i].abstract;

    var body_split = body.split('\n');
    body_lenght = body_split.length;

    tag_abstract(abstract,log_abstract);

    for(var j=0;j<body_split.length;j++){
      tag_body(body_split[j],log_body);
      // console.log("BODY: "+j+"\n"+body_split[j])
    }
});


function tag_abstract(text, callback){

  var url = tagme_token+text;

  request({uri: url,method: "GET"}, function(err, res, body) {

      if (!err && res.statusCode === 200) {

        let json = JSON.parse(body);
        var annotations = json.annotations;

        for(var i=0;i<annotations.length;i++){
          var temp = annotations[i];
          var first = temp.spot.charAt(0);

          if (first !== first.toLowerCase() && first === first.toUpperCase()){
            abstract_entities.push(temp.spot);
            }
          }

           callback();
        }
      });
}

function log_abstract(){
  // var temp_data = {title: title, part:"1", abstract: abstract_entities};
  //
  // fs.appendFile('./output_data/tagme_output.txt', JSON.stringify(temp_data), function(err) {
  //       if(err) {
  //       console.log(err);
  //       }
  //     })
}

function tag_body(text, callback){

    let url = tagme_token+text;
    var output = [];

    count++;
    console.log("PRIMA "+count);

    request({uri: url,method: "GET"}, function(err, res, body) {
          if (!err && res.statusCode == 200) {

            let json = JSON.parse(body);
            var annotations = json.annotations;

            for(var i=0;i<annotations.length;i++){
              var temp = annotations[i];
              var first = temp.spot.charAt(0);

              if (first !== first.toLowerCase() && first === first.toUpperCase()){
                output.push(temp.spot);
                }
              }
              Array.prototype.push.apply(body_entities, output);
              callback();
            }
            else{
              console.log("no risp "+count);

              count--;
            }
          });
}

// function log_body(){
//   count--;
//   console.log("PRIMA "+count);
//   if(count==0){
//     let temp_data = {title: title, abstract:abstract_entities, body: body_entities};
//     fs.appendFile('./output_data/tagme_output.txt', JSON.stringify(temp_data)+",", function(err) {
//       if(err) {console.log(err);}
//     })
//   }
// }
