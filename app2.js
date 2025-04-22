var http = require('http');
var url = require('url');
var qs = require('querystring');
var fs = require('fs');
var port = process.env.PORT || 3000;

function Place(Name) {
    this.Name = Name;
    this.zips = new Array();

    this.addZip= (zip) => {
        this.zips.push(zip);
    }

    this.placeMatch=(checkName) => { return checkName == this.Name };
}

const { MongoClient } = require('mongodb'); // no idea if this will work
const mongo = new MongoClient(process.env.MONGO_URI);

console.log("Starting App2");

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    urlObj = url.parse(req.url,true)
    path = urlObj.pathname;
    if (path == "/")
    {
      file="app2_form.html";
      fs.readFile(file, function(err, home) {
      res.write("<h1>Determine A Location:</h1>");
      res.write(home);
      res.end();
      });
    }
    else if (path == "/process")
    {
      res.write ("<h1>Processing:</h1>");
      var myPlace = new Place();
      var post_data = '';
      req.on('data', chunk => { post_data += chunk.toString();  });
      req.on('end', async () => 
          { 
          try {
            await mongo.connect(); // must be async to work.
            mongoPlaces = mongo.db('assign10db').collection('places');
            var loc = qs.parse(post_data).Location;
            var zipMatch = /^[0-9]{5}/; // create regex to match query
            var nameMatch = /^[A-Z][a-z]*/;
            if ( zipMatch.test(loc) ) {
                myPlace = await mongoPlaces.findOne({ zips: loc });
            } else if ( nameMatch.test(loc) ) {
                myPlace = await mongoPlaces.findOne({ Name: loc });
            } else {
                console.log("Location not found");
            }
            console.log(myPlace);

            if (myPlace != null) {
                res.write("Location Name: " + myPlace.Name + "<br/>");
                res.write("Location Zips: " + myPlace.zips + "<br/>");
            } else {
                res.write("Location Unknown!<br/>");
            }

          } catch (err) {
            console.error(err);
          } finally {
            mongo.close();
          }
          

          res.write ("<p>The Original Search Term was " + loc + "</p>");
          res.end();
          });
    }
  
}).listen(port);
