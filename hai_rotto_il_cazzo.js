var request = require('request');

var text =  "Army of Darkness (also known as Evil Dead III or Evil Dead III: Army of Darkness) is a 1992 American horror comedy film directed by Sam Raimi. It is the third installment of the  Evil Dead  franchise. The film was written by Sam Raimi and his brother Ivan, produced by Robert Tapert, and stars Bruce Campbell (also acting as co-producer) and Embeth Davidtz. Continuing from  Evil Dead II , Ash Williams (Campbell) is trapped in the Middle Ages and battles the undead in his quest to return to the present. The film was produced as part of a production deal with Universal Studios after the financial success of  Darkman . Filming took place in California in 1991.  Army of Darkness  premiered on October 9, 1992 at the Sitges Film Festival, and was released in the United States on February 19, 1993. It grossed $11.503 million domestically and another $10 million outside the USA for a total worldwide gross of $21.5 million. Critical response was positive. Since its video release it has acquired a massive cult following, along with the other two films in the trilogy. The film was dedicated to Irvin Shapiro, who died during the film's production in 1989 on New Year's Day. The makeup and creature effects for the film were handled by two different companies: Tony Gardner (designer) and his company Alterian Studios, Inc. (Alterian, Inc.) were responsible for the Ash & Sheila Makeup Effects, while Kurtzman, Nicotero & Berger EFX Group was credited for the remaining Special Makeup Effects characters."
var tagme_token = 'https://tagme.d4science.org/tagme/tag?lang=en&gcube-token=fdb15e10-ae52-4f10-bd07-005e92d627ea-843339462&text='+text;

function tag_abstract(text){

  var url = tagme_token+text;
  var abstract_entities = [];

  request({uri: url,method:  "GET" }, function(err, res, body) {

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
          console.log( "[" +abstract_entities+ "]" );
        }
        else {
          console.log( cazzo )

        }
      });
}

let temp = text.split( "." );
for(let j=0;j<temp.length;j++)
  tag_abstract(temp[j]);
