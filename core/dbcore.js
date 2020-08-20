const mssql = require('mssql');
const settings = require('../settings');
const { MSSQLError } = require('mssql/lib/error');


module.exports = {
    executeSQL: function (sql, callback) {
        mssql.connect(settings.dbConfig)
            .then((pool) => {
                const tran = new mssql.Transaction(pool)
                tran.begin()
                    .then(() => {
                        return new mssql.Request(tran)
                            .query(sql)
                    }).
                    then((result) => {
                        tran.commit();
                        callback(result);
                    })
                    // .then(() => {
                    //     console.log('erer');
                    //     pool.close();
                    // })
                    .catch(err => {
                        tran.rollback();
                        callback(null, err);
                    });
            })

            .catch(err => {
                callback(null, err);
            });
    },
    // executeSQL: function (sql, callback) {
    //     mssql.connect(settings.dbConfig)
    //         .then(pool => {
    //             return pool.request()
    //                 .query(sql)
    //         })
    //         .then(result => {
    //             callback(result);
    //         })
    //         .catch(err => {
    //             callback(null, err);
    //         });
    // },
    executeSP: function (spname, parameters, callback) {
        // console.log(parameters);
        mssql.connect(settings.dbConfig)
            .then(pool => {
                let request = pool.request();
                if (parameters) {
                    for (var i = 0; i < parameters.length; i++) {
                        //console.log(parameters[i].name, sqlType(parameters[i].dataType), parameters[i].value);
                        if (parameters[i] === this.ParamType.OUTPUT)
                            request.output(parameters[i].name, sqlType(parameters[i].dataType), parameters[i].value);
                        else
                            request.input(parameters[i].name, sqlType(parameters[i].dataType), parameters[i].value);
                    }
                }
                return request.execute(spname)
            })
            .then(result => {
                callback(result);
            })
            .catch(err => {
                callback(null, err);
            })
    },
    executeQuery: function (query, parameters) {
        mssql.connect(settings.dbConfig, function (err) {
            if (err) {
                console.log("there is a database connection error -> " + err);
                res.send(err);
            }
            else {
                // create request object
                var request = new mssql.Request();
                // Add parameters
                parameters.forEach(function (p) {
                    request.input(p.name, p.sqlType, p.value);
                });

                // query to the database
                request.execute(query, function (err, result) {
                    if (err) {
                        console.log("error while querying database -> " + err);
                    }
                    else {
                        console.log(result);
                        mssql.close();
                    }
                });
            }
        });
    },
    DataType: {
        INT: 'Int',
        STRING: 'Varchar',
        DATE: 'DateOnly',
        NUMBER: 'Numeric'
    },
    ParamType: {
        INPUT: 'input',
        OUTPUT: 'output'
    },
    Parameter: class {
        constructor(name, dataType, value, paramType, fieldLength) {
            this.name = name;
            this.dataType = dataType;
            this.value = value;
            this.paramType = paramType;
            this.fieldLength = fieldLength;
        }
    },
};



const sqlType = (paramtype) => {
    switch (paramtype) {
        case 'Int':
            return mssql.Int;
            break;
        case 'Varchar':
            return mssql.VarChar(50)
            break;
        default:
            break;
    }
}
// Change execute query to accept parameters.


// var connect = mssql.connect(
//     settings.dbConfig, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('Connected');
//             let request = new mssql.Request();
//             request.query("Select * from tblEmployee", function (err, data) {
//                 if (err) console.log(err);
//                 console.table(data.recordset);

//             })

//         }
//     });