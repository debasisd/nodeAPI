const dbcore = require('../core/dbcore');
const messages = require('../core/messages')
const util = require('util');

module.exports = {
    getEmployees: (req, resp) => {
        dbcore.executeSQL("Select * from tblEmployee", (result, err) => {
            if (err) {
                messages.showErrorMessage(req, resp, err, 'html')
            }
            else {
                messages.responseData(req, resp, result);
            }
        })
    },
    getEmployee: (req, resp, empno) => {
        dbcore.executeSQL("Select * from tblEmployee where EmployeeId=" + empno, (result, err) => {
            if (err) {
                messages.showErrorMessage(req, resp, err, 'html')
            }
            else {
                messages.responseData(req, resp, result);
            }
        })
    },
    addEmployee: (req, resp, requestBody) => {
        try {
            if (!requestBody) throw new Error('Input is not valid!')
            var data = JSON.parse(requestBody);
            // console.log(data);
            if (data) {
               // let sql = 'INSERT INTO tblEmployee (Name,City,Department,Gender) values '
                //sql += util.format("('%s','%s','%s','%s')", data.name, data.city, data.department, data.gender);
                 let sql = `INSERT INTO tblEmployee (Name,City,Department,Gender) 
                 values('we','yu','i','m')`;

                dbcore.executeSQL(sql, (result, err) => {
                    if (err) {
                        messages.showErrorMessage(req, resp, err, 'html')
                    }
                    else {
                        //messages.responseData(req, resp, result);
                        messages.showMessage(req, resp, messages.MessageCode.EMPSAVE);
                    }
                })
            }
            else {
                messages.showErrorMessage(req, resp, err, 'html');
            }
        }
        catch (ex) { messages.showErrorMessage(req, resp, ex, 'html'); }
        finally { }

    },
    updateEmployee: (req, resp, requestBody) => {
        try {
            if (!requestBody) throw new Error('Input is not valid!')
            var data = JSON.parse(requestBody);
            // console.log(data);
            if (data) {

                var parameters = [];
                //  parameters.push({ name: "id", sqlType: "Int", value: "2" });

                parameters.push(new dbcore.Parameter("empID", dbcore.DataType.INT, data.employeeId, dbcore.ParamType.INPUT, 1));
                parameters.push(new dbcore.Parameter("name", dbcore.DataType.STRING, data.name, dbcore.ParamType.INPUT, 1));
                parameters.push(new dbcore.Parameter("city", dbcore.DataType.STRING, data.city, dbcore.ParamType.INPUT, 1));
                parameters.push(new dbcore.Parameter("department", dbcore.DataType.STRING, data.department, dbcore.ParamType.INPUT, 1));
                parameters.push(new dbcore.Parameter("gender", dbcore.DataType.STRING, data.gender, dbcore.ParamType.INPUT, 1));

                dbcore.executeSP('spUpdateEmployee', parameters, (result, err) => {
                    if (err) {
                        messages.showErrorMessage(req, resp, err, 'html')
                    }
                    else {
                        messages.showMessage(req, resp, messages.MessageCode.EMPUPDATE);
                    }
                });
            }
            else {
                messages.showErrorMessage(req, resp, err, 'html');
            }
        }
        catch (ex) { messages.showErrorMessage(req, resp, ex, 'html'); }
        finally { }
    },
    deleteEmployee: (req, resp, empno) => {
        var parameters = [];
        parameters.push(new dbcore.Parameter('empId', dbcore.DataType.INT, empno))
        dbcore.executeSP('spDeleteEmployee', parameters, (result, err) => {
            if (err) {
                messages.showErrorMessage(req, resp, err, 'html')
            }
            else {
                messages.showMessage(req, resp, messages.MessageCode.EMPDELETE);
            }
        })
    }
}

// (
//     (req, res) =>
//         dbcore.executeSQL("Select * from tblEmployee", (result, err) => {
//             if (err) {
//                 console.log(err);
//                 resp.writeHead(500, 'Internal server error.', { 'Content-type': 'text/html' });
//                 resp.write(`<html><title>Error</title><body>${err}</body></html>`);
//                 resp.end();
//             }
//             else {
//                 console.table(result.recordset);
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.write(JSON.stringify(result.recordset));
//                 res.end();
//             }
//         })
// )();


// ((req, resp, empno) => {



//     var parameters = [];
//     parameters.push({ name: 'id', sqltype: 'Int', value: 2 });


//     dbcore.executeSP('spGetEmployee', parameters, (result, err) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.table(result.recordset);
//         }
//     })
// })();
