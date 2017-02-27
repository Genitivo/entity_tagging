var wiki_text = './input_data/wiki_00_ground.txt';
var articoli_mentions = './input_data/articoli_out_ground.txt';
var fs = require("fs");
var synonyms = require('./synonyms');
var tcom = require('thesaurus-com');
var async = require('async');


fs.readFile(wiki_text,function(err_articoli, data_articoli) {
  if(err_articoli) {
    console.log(err_articoli);
  }

  fs.readFile(articoli_mentions, function(err_itspsn, data_itspsn){
  			if(err_itspsn){
  				console.log(err_itspsn);
  			}

  var keywords = JSON.parse(data_itspsn.toString());
  var not_title = new RegExp("(.*?)\n\n", "g");
  var empty_line = new RegExp("^\s*$", "gm");
  var doc_tag = new RegExp("<doc (.*?)>", "g");
  var titoli = [];

  data_articoli = data_articoli.toString();
  data_articoli = data_articoli.replace(not_title, "");
  data_articoli = data_articoli.replace(empty_line, "");

  data_articoli = data_articoli.replace(doc_tag, function (match, capture) {
    titoli.push(capture.substring(capture.indexOf("title=\"")+7, capture.length-1));
    return "";
  });

  var titles = titoli;
  //console.log(titles);

  data_articoli = data_articoli.split("<\/doc>");
  data_articoli.pop();

  let output_data = [];

  for(var i=0; i<data_articoli.length; i++) {
    var article_split = data_articoli[i].split(/=======.*?=======/ig);
		var abstract = article_split[0];
		article_split.splice(0,1);
    data_articoli[i] = {title: titles[i], id:i, abstract: abstract, body: article_split.join("")};
    }

    // FILE DI INPUT PER TAGME
    // fs.writeFile('./input_data/tagme_input.txt', JSON.stringify(data_articoli), function(err) {
    //   if(err) {
    //   console.log(err);
    //   }
    // })

  for(var i=0; i<keywords.length; i++){

    var syns = [];
    var title = data_articoli[i].title;
    var id = i;

		var se = keywords[i].se;
    let se_abstract = [];
    let se_body = [];

		var pe = keywords[i].pe;
		var seeds = keywords[i].seeds;
    var pe_words = [];

    // synonyms(seeds,function(output) {
    //   syns = output;
    // });

		for(var k=0;k<pe.length;k++){
			var words = pe[k].split(' ');

			if(words.length>1)
				for(var j=0;j<words.length;j++){
					if(se.indexOf(words[j])===-1 && words[j].length>3){
							pe_words.push(words[j]);
            }
          }
      }

      for(var j=0; j<se.length; j++) {
        if(se[j]!=""){
          regex = new RegExp(se[j]+'[ .,;:"]', "g");
          data_articoli[i].abstract = data_articoli[i].abstract.replace(regex,function (match, capture) {
            se_abstract.push(match.replace(/ /g,"_").slice(0, -1));
            return  "["+j+"|SE] ";
          });
          data_articoli[i].body = data_articoli[i].body.replace(regex,function (match, capture) {
            se_body.push(match.replace(/ /g,"_").slice(0, -1));
            return  "["+j+"|SE] ";
          });
        }
      }
      for(var j=0; j<pe.length; j++) {
        if(pe[j]!=""){
				 regex = new RegExp(pe[j]+'[ .,;:"]', "ig");
				 data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|PE] ");
				 data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|PE] ");
       }
			}
			for(var j=0; j<seeds.length; j++) {
        if(seeds[j]!=""){
          regex = new RegExp("the "+seeds[j]+'[ .,;:"]', "ig");
				  data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SEED] ");
				  data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SEED] ");
        }
			}
      for(var j=0; j<pe_words.length; j++) {
        if(pe_words[j]!=""){
          regex = new RegExp(pe_words[j]+'[ .,;:"]', "ig");
          data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|PE_WORD] ");
          data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|PE_WORD] ");
        }
      }
      for(var j=0; j<syns.length; j++) {
        regex = new RegExp("the "+syns[j]+'[ .,;:"]', "ig");
        data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SYN] ");
        data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SYN] ");
      }

      for(var j=0; j<se.length; j++) {
        if(se[j]!=""){
           regex = new RegExp("\\["+j+"\\|SE\\]", "g");
           data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+se[j]+"|SE]");
           data_articoli[i].body = data_articoli[i].body.replace(regex, "["+se[j]+"|SE]");
         }
      }
      for(var j=0; j<pe.length; j++) {
        if(pe[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|PE\\]", "ig");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+pe[j]+"|PE]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "["+pe[j]+"|PE]");
         }
      }
      for(var j=0; j<seeds.length; j++) {
        if(seeds[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|SEED\\]", "ig");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "[the "+seeds[j]+"|SEED]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "[the "+seeds[j]+"|SEED]");
        }
      }
      for(var j=0; j<pe_words.length; j++) {
        if(pe_words[j]!=""){
      	   regex = new RegExp("\\["+j+"\\|PE_WORD\\]", "ig");
      	   data_articoli[i].abstract = data_articoli[i].abstract.replace(regex,"["+pe_words[j]+"|PE_WORD]");
      	   data_articoli[i].body = data_articoli[i].body.replace(regex, "["+pe_words[j]+"|PE_WORD]");
         }
      }
      for(var j=0; j<syns.length; j++) {
      	 regex = new RegExp("\\["+j+"\\|SYN\\]", "ig");
      	 data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "[the "+syns[j]+"|SYN]");
      	 data_articoli[i].body = data_articoli[i].body.replace(regex, "[the "+syns[j]+"|SYN]");
      }

      var regex = '';
			var pe_abstract_count = 0;
      var pe_body_count = 0;

			var se_abstract_count = 0;
      var se_body_count = 0;

			var seeds_abstract_count = 0;
      var seeds_body_count = 0;

			var pe_words_abstract_count = 0;
      var pe_words_body_count = 0;

      var syn_abstract_count = 0;
      var syn_body_count = 0;

      var matches_abstract = [];
      var matches_body = [];

      matches_abstract = data_articoli[i].abstract.match(/\|PE]/ig);
      matches_body = data_articoli[i].body.match(/\|PE]/ig);

      if(matches_abstract !== null) {
      	pe_abstract_count = matches_abstract.length;
      }
      if(matches_body !== null) {
      	pe_body_count = matches_body.length;
      }
      matches_abstract = data_articoli[i].abstract.match(/\|SE]/ig);
  	  matches_body = data_articoli[i].body.match(/\|SE]/ig);

      if(matches_abstract !== null) {
      	se_abstract_count = matches_abstract.length;
      }
      if(matches_body !== null) {
      	se_body_count = matches_body.length;
      }

      matches_abstract = data_articoli[i].abstract.match(/\|SEED]/ig);
      matches_body = data_articoli[i].body.match(/\|SEED]/ig);

      if(matches_abstract !== null) {
      	seeds_abstract_count = matches_abstract.length;
      }
      if(matches_body !== null) {
      	seeds_body_count += matches_body.length;
      }

      matches_abstract = data_articoli[i].abstract.match(/\|PE_WORD]/ig);
      matches_body = data_articoli[i].body.match(/\|PE_WORD]/ig);

      if(matches_abstract !== null) {
        pe_words_abstract_count = matches_abstract.length;
      }
      if(matches_body !== null) {
        pe_words_body_count += matches_body.length;
      }

      matches_abstract = data_articoli[i].abstract.match(/\|SYN]/ig);
      matches_body = data_articoli[i].body.match(/\|SYN]/ig);

      if(matches_abstract !== null) {
        syn_abstract_count = matches_abstract.length;
      }
      if(matches_body !== null) {
        syn_body_count = matches_body.length;
      }

      // fs.appendFile('./output_data/page_tagging_out.txt', '=== '+title+' id: '+id+' ==='+'\r\n'+'\r\n'+'PE: '+pe+' ----> Abstract = '+pe_abstract_count+' Body = '+pe_body_count+'\r\n'+'PE_WORDS: '+pe_words+'----> Abstract = '+pe_words_abstract_count+' Body = '+pe_words_body_count+'\r\nSE: '+se+' ----> Abstract = '+se_abstract_count+' Body = '+se_body_count+'\r\nSEEDS: '+seeds+' ---> Abstract ='+seeds_abstract_count+ 'Body = '+seeds_body_count+'\r\nSYNONISMS: '+syns+' ---> '+syn_count+'\r\n'+'---------------------\n'+'Abstract:'+data_articoli[i].abstract+'Body:'+data_articoli[i].body+'\r', function(err) {
      // 		if(err) {
      // 				console.log(err);
      // 						}
      //           });

    output_data[i] = {  wiki_id: title.replace(/ /g,"_"),
                        pe_abstract: pe_abstract_count+pe_words_abstract_count,
                        pe_body: pe_body_count+pe_words_body_count,
                        seed_abstract: seeds_abstract_count+syn_abstract_count,
                        seed_body: seeds_body_count+syn_body_count,
                        se_abstract: se_abstract,
                        se_body: se_body
                      };

    //console.log(output_data[i]);

        }
        fs.writeFile('./output_data/lector_output.txt', JSON.stringify(output_data), function(err) {
          if(err) {
          console.log(err);
          }
        })

      })
});
