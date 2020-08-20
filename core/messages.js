const settings = require('../settings');

module.exports = {
    showMessage: (req, resp, statementCode, format) => {
        if (format == 'html') {
            let msg = statements(statementCode);

            resp.writeHead(msg.messageCode, msg.messageType, { 'content-type': 'text/html' });
            resp.write(`<html><title>${msg.messageCode}</title>
            <body>
                ${msg.message}
            </body></html>`)
        }
        else {
            let msg = statements(statementCode);
            resp.writeHead(msg.messageCode, msg.messageType, { "content-type": "application/json" });
            resp.write(JSON.stringify(msg));
        }
        resp.end();
    },
    showErrorMessage: (req, resp, err, format) => {
        if (format == 'html') {
            resp.writeHead(500, "Internal error occured.", { 'content-type': 'text/html' });
            resp.write(`<html><title>500</title>
            <body>Error Details: ${err}</body></html>`)
        }
        else {
            resp.writeHead(500, "Internal error occured.", { 'content-type': 'application/json' });
            resp.write(JSON.stringify(err))
        }
        resp.end();
    },
    responseData: (req, resp, data) => {
        resp.writeHead(200, { "content-type": "application/json" });
        if (data) {
            resp.write(JSON.stringify(data));
        }
        resp.end();
    },

    ////Test purpose
    funcA: () => {
        if (arguments.length == 1) {
            return funcOne(arguments[0]);
        } else if (arguments.length == 2) {
            return funcTwo(arguments[0], arguments[1]);
        }
    },
    funcTwo: (a, b) => {
        return a + b;
    },
    funcOne: (c) => {
        return c;
    },
    MessageCode: {
        EMPSAVE: 'empsave',
        EMPUPDATE: 'empupdate',
        EMPDELETE: 'empdelete',
        HOME: 'home',
    }

}

class Message {
    constructor(messageCode, messageType, message) {
        this.messageCode = messageCode;
        this.messageType = messageType;
        this.message = message;
    }
}

const HttpCode = {
    SUCCESS: 200,
    NOTFOUND: 404,
    REQLARGESIZE: 413,
    INTERNALERROR: 500
}


const MessageType = {
    FAILURE: 'Failure',
    SUCCESS: 'Success'
}

const messages = require('../core/messages');

const statements = (code) => {
    switch (code) {
        case "empsave":
            {
                return new Message(HttpCode.SUCCESS, MessageType.SUCCESS, 'Employee record saved successfully.');
                break;
            }
        case "empupdate":
            return new Message(HttpCode.SUCCESS, MessageType.SUCCESS, 'Employee record updated successfully.');
            break;
        case "empdelete":
            return new Message(HttpCode.SUCCESS, MessageType.SUCCESS, 'Employee record deleted successfully.');
            break;
        /////Error codes
        case "404":
            return new Message(HttpCode.NOTFOUND, MessageType.FAILURE, 'Page not found.');
            break;
        case "413":
            return new Message(HttpCode.REQLARGESIZE, MessageType.FAILURE, 'Request body is too large.');
            break;
        case "500":
            return new Message(HttpCode.INTERNALERROR, MessageType.FAILURE, 'Internal server error.');
            break;
        ///Home page
        case 'home':
            return new Message(HttpCode.SUCCESS, MessageType.SUCCESS,
                `Node API help page
                { url: '/employees', operation: 'GET', descrioption: 'Get all employees' }
            `);
            break;
        default:
            break;
    }
}



// class HTTPError extends Error {
//     constructor(message, status) {
//       super(message);
//       this.status = status;
//     }

//     toJSON() {
//       const ret = { message: this.message, status: this.status };
//       if (process.env.NODE_ENV === 'development') {
//         ret.stack = this.stack;
//       }
//       return ret;
//     }
//   }

//   const e = new HTTPError('Fail', 404);
//   // {"message":"Fail","status":404,"stack":"Error: Fail\n    at ...
//   console.log(JSON.stringify(e));