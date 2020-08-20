module.exports = {
    dbConfig: {
        user: "sa",
        password: "sql2008",
        server: "Debasis-PC\\MSSQLSERVER2008",
        database: "Sample",
        port: 1433,
        options: {
            encrypt: false,
            enableArithAbort: false // set to silence the tedious deprecated message 
        }
    },
    WEBPORT: process.env.PORT || "9000",
    MESSAGEFORMAT: "json"
}