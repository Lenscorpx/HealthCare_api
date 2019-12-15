var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

// Create connection to database
var config = {
    userName: 'sa', // update me
    password: 'LensX@2018.com?', // update me
    server: 'DESKTOP-04B2434',
    options: {
        database: 'db_weka'
    }
  }
  var connection = new Connection(config);

function Start(callback) {
    console.log('Debut de traitement...');
    callback(null);
}

function Read(callback) {
    console.log('Lecture des datas de la table dependants...');

    // Read all rows from table
    request = new Request(
    'select * from t_user',
    //'select * from t_agent;',
    function(err, rowCount, rows) {
    if (err) {
        callback(err);
    } else {
        console.log(rowCount + ' lignes retournees');
        callback(null);
    }
    });

    // Print the rows read
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}

function Complete(err, result) {
    if (err) {
        callback(err);
    } else {
        console.log("tache accomplie!");
    }
}

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');

    // Execute all functions in the array serially
    async.waterfall([
        Read
    ], Complete)
  }
});