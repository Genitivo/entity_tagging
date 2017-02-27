var groundtruth_results = './result_data/groundtruth.txt';
var lector_results = './result_data/lector_output.txt';
var tagme_results = './result_data/tagme_output_results.txt';
var fs = require("fs");

function checkContents(string, array){

  for(let i=0;i<array.length;i++)
    if(array[i].indexOf(string)!=-1)
      return true

  return false;
}

function toLowerCaseArray(array){
  for(let i=0;i<array.length;i++)
    array[i] = array[i].toLowerCase();

  return array;
}

function getItemFromTitle(title,dictionary){

  for(let i=0;i<dictionary.length;i++){
    if(dictionary[i]!==null)
      if(dictionary[i].wiki_id===title)
        return dictionary[i];
  }

    return null;
}

function becomeAnchorText(array){

  for(let i=0;i<array.length;i++){
    if(array[i].indexOf('(')!=-1)
      array[i] = array[i].substring(0,array[i].indexOf('(')-1);
  }
  return array;
}

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
};

fs.readFile(groundtruth_results,function(err_groundtruth, groundtruth_data) {
  if(err_groundtruth) {
    console.log(err_groundtruth);
  }

  fs.readFile(lector_results, function(err_lector, lector_data){
    if(err_lector){
      console.log(err_lector);
    }

    fs.readFile(tagme_results, function(err_tagme, tagme_data){
      if(err_tagme){
    		console.log(err_tagme);
    	}

      var groundtruth = JSON.parse(groundtruth_data.toString());
      let lector = JSON.parse(lector_data.toString());
      let tagme = JSON.parse(tagme_data.toString());


      for(let i=0;i<groundtruth.length;i++){
        if(groundtruth[i].wiki_id!==""){

          let l_pe_abs = 0;
          let l_pe_body = 0;
          let l_seeds_abs = 0;
          let l_seeds_body = 0;
          let l_se_abstract = 0;
          let l_se_body = 0;

          let t_pe_abs = 0;
          let t_pe_body = 0;
          let t_se_abstract = 0;
          let t_se_body = 0;

          let groundtruth_row = groundtruth[i];

          groundtruth_row.se_abstract = toLowerCaseArray(groundtruth_row.se_abstract);
          groundtruth_row.se_body = toLowerCaseArray(groundtruth_row.se_body);

          groundtruth_row.se_abstract = becomeAnchorText(groundtruth_row.se_abstract);
          groundtruth_row.se_body = becomeAnchorText(groundtruth_row.se_body);

          let lector_row = getItemFromTitle(groundtruth_row.wiki_id,lector);
          let tagme_row = getItemFromTitle(groundtruth_row.wiki_id,tagme);

          if(groundtruth_row!==null)
          console.log("ground :"+groundtruth_row.wiki_id);

          if(lector_row!==null){
            console.log("lector :"+lector_row.wiki_id);

            lector_row.se_abstract = toLowerCaseArray(lector_row.se_abstract);
            lector_row.se_body = toLowerCaseArray(lector_row.se_body);

            let temp_abs = arr_diff(groundtruth_row.se_abstract,lector_row.se_abstract);
            let temp_body = arr_diff(groundtruth_row.se_body,lector_row.se_body);
            let diff_abs = [];
            let diff_body = [];

            for(let k=0;k<temp_abs.length;k++){
              if(checkContents(temp_abs[k],arr_diff(lector_row.se_abstract,groundtruth_row.se_abstract)) === false)
                diff_abs.push(temp_abs[k]);
            }

            for(let k=0;k<temp_body.length;k++){
              if(checkContents(temp_body[k],arr_diff(lector_row.se_body,groundtruth_row.se_body)) === false)
                diff_body.push(temp_body[k]);
            }

            l_pe_abs = lector_row.pe_abstract;
            l_pe_body = lector_row.pe_body;
            l_seeds_abs = lector_row.seed_abstract;
            l_seeds_body = lector_row.seed_body;
            l_se_abstract = groundtruth_row.se_abstract.length - diff_abs.length;
            l_se_body = groundtruth_row.se_body.length - diff_body.length;

            // console.log("se: "+groundtruth_row.se_abstract.length+" noi "+l_se_abstract+" ----> "+"se : "+groundtruth_row.se_body.length+" noi"+l_se_body);
          }


          if(tagme_row!==null){
            console.log("tagme :"+tagme_row.wiki_id);

            tagme_row.se_body_entities = toLowerCaseArray(tagme_row.se_body_entities);
            tagme_row.se_abstract_entities = toLowerCaseArray(tagme_row.se_abstract_entities);

            let diff_tagme_abs = [];
            let diff_tegme_body = [];

            let temp_abs_tagme = arr_diff(groundtruth_row.se_abstract,tagme_row.se_abstract_entities);
            let temp_body_tagme = arr_diff(groundtruth_row.se_body,tagme_row.se_body_entities);

            for(let k=0;k<temp_abs_tagme.length;k++){

              if(checkContents(temp_abs_tagme[k],arr_diff(tagme_row.se_abstract_entities,groundtruth_row.se_abstract)) === false)
                diff_tagme_abs.push(temp_abs_tagme[k]);
            }
            for(let k=0;k<temp_body_tagme.length;k++){
              if(checkContents(temp_body_tagme[k],arr_diff(tagme_row.se_body_entities,groundtruth_row.se_body)) === false)
                diff_tegme_body.push(temp_body_tagme[k]);
            }

            t_pe_abs = tagme_row.pe_abstract;
            t_pe_body = tagme_row.pe_body;
            t_se_abstract = groundtruth_row.se_abstract.length - diff_tagme_abs.length;
            t_se_body = groundtruth_row.se_body.length - diff_tegme_body.length;
            console.log(t_se_abstract+" ----> "+t_se_body);

          }

          fs.appendFile("output_data/results_comparison.tsv",groundtruth_row.wiki_id +'\t'+groundtruth_row.pe_abstrac+'\t'+l_pe_abs+'\t'+t_pe_abs+'\t'+groundtruth_row.pe_body+'\t'+l_pe_body+'\t'+t_pe_body+'\t'+groundtruth_row.seed_abstract+'\t'+l_seeds_abs+'\t'+groundtruth_row.seed_body+'\t'+l_seeds_body+'\t'+groundtruth_row.se_abstract.length+'\t'+l_se_abstract+'\t'+t_se_abstract+'\t'+groundtruth_row.se_body.length+'\t'+l_se_body+'\t'+t_se_body+'\r\n', function(err) {
  					if(err) {
  						return console.log(err);
  					}
  				});

        }

      }
    })
  })
});
