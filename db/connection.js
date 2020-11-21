const Datastore = require('nedb');
const db = new Datastore({ filename: 'db/database.db', autoload: true , timestampData: true});


module.exports = db;