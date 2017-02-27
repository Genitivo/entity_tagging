var articoli_mentions = './input_data/articoli_out_ground.txt';
var tagme_output = './result_data/tagme_output.txt';
var fs = require("fs");


function countInArray(what,array,new_array) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {

        if (array[i] === what) {
            count++;
        }else{
          new_array.push(array[i]);
        }
    }
    return count;
}

fs.readFile(articoli_mentions, function(err_itspsn, data_itspsn){
  if(err_itspsn){
    console.log(err_itspsn);
  }

  fs.readFile(tagme_output, function(err_tagme, tagme_data){
    if(err_tagme){
      console.log(err_tagme);
    }

    let keywords = JSON.parse(data_itspsn.toString());
    let tagme = JSON.parse(tagme_data.toString());
    let output = [];

    for(var i=34; i<49; i++){

      let pe = keywords[i].pe
      let se = keywords[i].se
      let pe_abstract = 0;
      let pe_body = 0;
      let se_abstract_entities = [];
      let se_body_entities = [];


      for(var k=0;k<pe.length;k++){
  			var words = pe[k].split('_');

  			if(words.length>1)
  				for(var j=0;j<words.length;j++){
  					if(se.indexOf(words[j])===-1 && words[j].length>3){
  							pe.push(words[j]);
            }
          }
      }

      for(var k=0;k<pe.length;k++){
        let pe_temp = pe[k].charAt(0).toUpperCase() + pe[k].slice(1);
        se_abstract_entities = [];
        se_body_entities = [];

        pe_abstract += countInArray(pe_temp, tagme[i-1].abstract, se_abstract_entities);
        pe_body += countInArray(pe_temp, tagme[i-1].body, se_body_entities);

      }
      console.log(pe_abstract+"____"+pe_body)
      console.log(keywords[i].pe[0]+"____"+tagme[i-1].wiki_id)

      output[i] = {
        wiki_id: tagme[i-1].wiki_id,
        pe_abstract: pe_abstract,
        pe_body: pe_body,
        se_abstract_entities: se_abstract_entities,
        se_body_entities: se_body_entities
      };

    }

    fs.appendFile('./result_data/tagme_output_results.txt', JSON.stringify(output)+"]", function(err) {
      if(err) {
      console.log(err);
      }
    })



  })
});
