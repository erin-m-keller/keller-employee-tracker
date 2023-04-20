const connection = require('./db');

class Employee {
    viewAllEmployees (callback) {
        let query = 'SELECT * FROM employees';
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            console.table(result);
            callback();
        });
    }
};

module.exports = Employee;