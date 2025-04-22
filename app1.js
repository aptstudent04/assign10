// app1
const fs = require('node:fs');

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


try {
    const zipCodeData = fs.readFileSync(process.env.ZIPSF, 'utf8');

    console.log(zipCodeData);
    zipCodeData.split(/\r?\n/).forEach(line => {
        if (line != '') {
            const Loc = line.split(',');
            if (places.find(o => o.placeMatch(Loc[0]))) {
                places.find(o => o.placeMatch(Loc[0])).addZip(Loc[1]);
            } else {
                const newPlace = new Place(Loc[0]);
                newPlace.addZip(Loc[1]);
                places.push(newPlace);
            }
            console.log(`Line: ${line}`);
        }
    });
    console.log(places);

} catch (err) {
    console.error(err);
}
