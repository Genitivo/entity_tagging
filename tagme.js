var fs = require("fs");
var request = require('request');
var cheerio = require('cheerio');
//var async = require('async');


var text = "Anarchism is a political philosophy that advocates self-governed societies with voluntary institutions. These are often described as stateless societies, but several authors have defined them more specifically as institutions based on non-hierarchical free associations. Anarchism holds the state to be undesirable, unnecessary, or harmful. While anti-statism is central, anarchism entails opposing authority or hierarchical organisation in the conduct of human relations, including, but not limited to, the state system. As an anti-dogmatic philosophy, anarchism draws on many currents of thought and strategy. Anarchism does not offer a fixed body of doctrine from a single particular world view, instead fluxing and flowing as a philosophy. There are many types and traditions of anarchism, not all of which are mutually exclusive. Anarchist schools of thought can differ fundamentally, supporting anything from extreme individualism to complete collectivism. Strains of anarchism have often been divided into the categories of social and individualist anarchism or similar dual classifications. Anarchism is usually considered a radical left-wing ideology, and much of anarchist economics and anarchist legal philosophy reflect anti-authoritarian interpretations of communism, collectivism, syndicalism, mutualism, or participatory economics.";
var entity = [];

var result = request('https://tagme.d4science.org/tagme/tag?lang=en&gcube-token=fdb15e10-ae52-4f10-bd07-005e92d627ea-843339462&text='+text, function (error, response, html) {
if (!error && response.statusCode == 200) {
        //console.log(html);
        result = JSON.parse(html);
        var annotations = result.annotations;

        for(var i=0;i<annotations.length;i++){
          var temp = annotations[i];
          console.log(temp.spot);
        }
    }
});
