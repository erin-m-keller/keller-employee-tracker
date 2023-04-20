const connection = require('./db');

class Employee {
    viewAllEmployees (callback) {
        let query = `SELECT * FROM employees`;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            console.table(result);
            callback();
        });
        connection.end();
    }
    viewEmployeesByManager (callback) {
        let query = `
            SELECT managers.first_name AS mgr_first_name, managers.last_name AS mgr_last_name,
            GROUP_CONCAT(CONCAT(employees.first_name, ' ', employees.last_name) SEPARATOR ', ') AS employees
            FROM employees
            LEFT JOIN employees AS managers ON employees.manager_id = managers.id
            GROUP BY employees.manager_id
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            console.table(result);
            callback();
        });
        connection.end();
    }
};

module.exports = Employee;