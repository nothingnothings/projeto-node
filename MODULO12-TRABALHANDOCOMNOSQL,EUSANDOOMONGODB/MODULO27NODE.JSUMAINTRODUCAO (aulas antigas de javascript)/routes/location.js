const express = require('express');
const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/locations?retryWrites=true&w=majority';





const router = express.Router();

const locationStorage = {
    locations: []
};





router.post('/add-location', (req, resp, next) => {
    //const id = Math.random();
    


    Mongoclient.connect(function(err, client) {
        const db = client.db('locations');

        db.collection('user-locations').insertOne(
            {
                address: req.body.address,
                coords: { lat: req.body.lat, lng: req.body.lng }
            }, 
            function(err, r) {  ////'r' stands for 'response'...
                //if(err) {}
                console.log(r);
                r.json( { message: 'Stored location!', locId: r.insertedId });
            }
        )

    //locationStorage.locations.push({
        //id: Math.random(),
      /*  id: id,
        address: req.body.address,
        coords: { lat: req.body.lat, lng: req.body.lng }
    }); */



    });


})




router.get('/location/:lid', (req, resp, next) => {
    const locationId = req.params.lid;
    /*const location = locationStorage.locations.find(loc => {
        return loc.id === locationId; */
        Mongoclient.connect(function(err, client) {
            const db = client.db('locations');

            //Insert a single document
            db.collection('user-locations').findOne(
                {
                    //_id: locationId
                    _id: new mongodb.ObjectId('locationId')  ///faz com que seja possível fazer 'query' das propriedades/objetos especiais dentro dos 'documents'/propriedades/objetos armazenados dentro das collections do mongoDb...
                }, 

                function(err, doc) {
                    if(!doc) {
                        return resp.status(404).json( {
                            message: 'Not Found!'
                        })
                    }
                    resp.json( {address: doc.address, coordinates: doc.coords})
                }
            )
        });


}
)



module.exports = router;