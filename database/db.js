const path = require('path');
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname ,'/init/data.sql');
const dataSql = fs.readFileSync(dbPath).toString();

const db = new sqlite3.Database('./database/events_data.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {


        const dataArr = dataSql.toString().split(");");
        dataArr.forEach(query => {
            if (query) {
              // Add the delimiter back to each query before you run them
              // In my case the it was `);`
              query += ");";
              db.run(query, err => {
                  
                if (err) {
                    console.log('Table Already Existed')
                    throw err;}
              });
            }
          });      
    }
});


module.exports = db;