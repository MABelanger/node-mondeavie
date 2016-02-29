var mongoose = require('mongoose');

mongoose.connect('localhost/mondeavie');

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
	mongoose.connection.db.listCollections().toArray(function(err, names) {
	    if (err) {
	        console.log(err);
	    }
	    else {
        console.log(names); // [{ name: 'dbname.myCollection' }]
        mongoose.connection.close();
	    }
	});

})