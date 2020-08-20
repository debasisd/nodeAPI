const http = require('http');
const emp = require('../controllers/employee');
const settings = require('../settings');
const messages = require('../core/messages');
const employee = require('../controllers/employee');

http.createServer((req, resp) => {
    switch (req.method) {
        case 'GET':
            if (req.url === '/') {
                messages.showMessage(req, resp, 'home', 'html');
            }
            else if (req.url === '/employees') {
                emp.getEmployees(req, resp);
            }
            else {
                let empnoPattern = '[0-9]+';
                let patt = new RegExp("/employees/" + empnoPattern)
                if (patt.test(req.url)) {
                    patt = new RegExp(empnoPattern);
                    let empno = patt.exec(req.url);
                    emp.getEmployee(req, resp, empno);
                }
                else {
                    messages.showMessage(req, resp, '404', 'html');
                }
            }
            break;
        case 'POST':
            if (req.url === '/employees') {
                var reqBody = '';
                req.on("data", (data) => {
                    reqBody = reqBody + data;
                    if (reqBody.length > 1e7) //10 MB
                    {
                        messages.showMessage(req, resp, '413', 'html')
                    }

                });
                req.on('end', () => {
                    // console.log(reqBody);
                    employee.addEmployee(req, resp, reqBody);
                });
            }
            break;
        case 'PUT':
            if (req.url === '/employees') {
                var reqBody = '';
                req.on("data", (data) => {
                    reqBody = reqBody + data;
                    if (reqBody.length > 1e7) //10 MB
                    {
                        messages.showMessage(req, resp, '413', 'html')
                    }
                });
                req.on('end', () => {
                    // console.log(reqBody);
                    employee.updateEmployee(req, resp, reqBody);
                });
            }
            break;
        case 'DELETE':
            {
                let empnoPattern = '[0-9]+';
                let patt = new RegExp("/employees/" + empnoPattern)
                if (patt.test(req.url)) {
                    patt = new RegExp(empnoPattern);
                    let empno = patt.exec(req.url);
                    emp.deleteEmployee(req, resp, empno);
                }
                else {
                    messages.showMessage(req, resp, '404', 'html');
                    resp.end();
                }
            }
            break;
        default:
            break;
    }

}).listen(settings.WEBPORT, () => {
    console.log('Started listening port:' + settings.WEBPORT)
})
