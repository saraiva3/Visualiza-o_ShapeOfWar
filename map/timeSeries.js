

var edges, conflicts = [], conflictsByYear = [], csv;
// Leitura e preparação dos dados
d3.csv("data/edges.csv").then(function(data){

   edges = d3.nest()
   .key(function(d) { return d.conflict.trim();}).sortKeys(d3.ascending)
   .entries(data.filter(function(d){ return d.relation === "-";}));


   countriesConflicts = {};
   edges.forEach(function(conflict){
      end = conflict.values[0].end.trim();
      if(end === "Ongoing"){
         conflicts.push({conflict:conflict.key, start:+conflict.values[0].start, end:end});
      }else{
         conflicts.push({conflict:conflict.key, start:+conflict.values[0].start, end:+end});
      }
   });

   startYear = 1501;
   currentYear = 2018;

   duration = []

   console.log(conflicts);

   conflicts.forEach(function(d) {
      if(d.end === "Ongoing"){
         duration.push({conflict:d.conflict, duration: currentYear - d.start});
      }else{
         duration.push({conflict:d.conflict, duration: d.end - d.start});
      }
   });
   duration.sort(function(x, y){ return +x.duration < +y.duration ? 1 : -1;});
   console.log(duration);
   var i;

   for(i = 0; i <= currentYear - startYear; i++){
      conflictsByYear.push({year:startYear+i,conflicts:0});
   }


   conflicts.forEach(function(conflict){
      start = conflict.start;
      if(conflict.end == "Ongoing"){
         while(start <= currentYear){
            conflictsByYear[start-startYear].conflicts++;
            start++;
         }
      }else{
         while(start <= conflict.end){
            conflictsByYear[start-startYear].conflicts++;
            start++;
         }
      }
   });

   console.log(conflictsByYear);

   // csv = 'year,conflicts';
   //
   // conflictsByYear.forEach(function(year){
   //    csv += '\n';
   //    csv += year.year;
   //    csv += ',';
   //    csv += year.conflicts;
   // });
   //
   // var a         = document.createElement('a');
   // a.href        = 'data:attachment/csv,' + encodeURIComponent(csv);
   // a.target      = '_blank';
   // a.download    = 'myFile.csv';
   //
   // document.body.appendChild(a);
   // a.click();

});
