var groundtruth = './input_data/Groundtruth_ENG.tsv';
var fs = require("fs");

fs.readFile(groundtruth,function(err_articoli, data) {

  let array = data.toString().split('\n');
  let groudtruth_data = [];

  for(let i=4;i<94;i++){
    let temp = array[i].split('\t');

    groudtruth_data[i-4] = { wiki_id: temp[2],
                           pe_abstract: temp[5]+temp[7],
                           pe_body: temp[6]+temp[8],
                           seed_abstract: temp[9],
                           seed_body: temp[10],
                           se_abstract: temp[14].split(' '),
                           se_body: temp[15].split(' ')
                         };

   }

   let output = [];

   for(let i=0;i<groudtruth_data.length;i++){
     //console.log(groudtruth_data[i]);

     if(groudtruth_data[i].se_abstract.length>0){
      output.push(groudtruth_data[i]);
      console.log(output[i]);
    }
   }

   fs.writeFile('./output_data/groundtruth.txt', JSON.stringify(output), function(err) {
      if(err) { console.log(err); }
    })
});
