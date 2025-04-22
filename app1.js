// app1
const fs = require('node:fs');


const { MongoClient } = require('mongodb'); // no idea if this will work
const mongo = new MongoClient(process.env.MONGO_URI);


console.log("This is a test.");

function Place(Name) {
    this.Name = Name;
    this.zips = new Array();

    this.addZip= (zip) => {
        this.zips.push(zip);
    }

    this.placeMatch=(checkName) => { return checkName == this.Name };
}


// Create array of Places
const places = new Array();
// Set up objects
try {
    const zipCodeData = fs.readFileSync(process.env.ZIPSF, 'utf8');

    //console.log(zipCodeData); // verify data read from file.

    zipCodeData.split(/\r?\n/).forEach(line => {
        if (line != '') {
            const Loc = line.split(',');
            if (places.find(o => o.placeMatch(Loc[0]))) {
                places.find(o => o.placeMatch(Loc[0])).addZip(Loc[1]);
                console.log("Adding " + Loc[1] + " to " + Loc[0]);
            } else {
                const newPlace = new Place(Loc[0]);
                newPlace.addZip(Loc[1]);
                places.push(newPlace);
                console.log("Creating " + Loc[0] + " with " + Loc[1]);
            }
            //console.log(`Line: ${line}`);
        }
    });
    //console.log(places);

} catch (err) {
    console.error(err);
}
/*
mongo.connect( async function(err, placeDB ) {
    if (err) { return console.error(err); } 

    mongoPlaces = placeDB.db('assign10db').collection('places');

    places.forEach(myPlace => async() => {
        tryName = myPlace.Name;
        console.log("Evaluating " + tryName);
        if (await mongoPlaces.findOne({ Name: tryName })){
            console.log("Already inserted " + tryName);
        } else {
            await mongoPlaces.insertOne(myPlace, function(err, res) {
                if (err) { return console.error(err); }
                console.log("Added " + res);
            });
        }
    });

});
mongo.close();

*/

(async () => {
try {
    await mongo.connect();
    mongoPlaces = mongo.db('assign10db').collection('places');
    console.log("Success?");
//    mongoPlaces.command();
    /*
    await places.forEach(myPlace => {
        tryName = myPlace.Name;
        console.log("Evaluating " + tryName);
        if (mongoPlaces.findOne({ Name: tryName })){
            console.log("Already inserted " + tryName);
        } else {
            mongoPlaces.insertOne(myPlace);
            console.log("Inserting " + tryName);
        }

    });
    //pause.then(mongo.close());
    console.log("Finished");
    */
    await mongoPlaces.insertMany(places);
    console.log("Inserted Many Places");

} catch (err) {
    console.error(err);
} finally {
    mongo.close();

}
})();

