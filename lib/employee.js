const connection = require('./db');

class Employee {
    viewAllEmployees (callback) {
        let query = `SELECT * FROM employees`;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            console.table(result);
            callback();
        });
    }
    viewEmployeesByManager (callback) {
        let query = `
            SELECT managers.first_name AS mgr_first_name, managers.last_name AS mgr_last_name,
            GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name) SEPARATOR ', ') AS emp
            FROM employees emp
            LEFT JOIN employees AS managers ON emp.manager_id = managers.id
            GROUP BY emp.manager_id
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            console.table(result);
            callback();
        });
    }
    viewEmployeesByDept (callback) {
        // TODO: work in progress
        //let query = `
        //    SELECT emp.first_name AS employee_first_name, emp.last_name AS employee_last_name, dept.name AS department_name
        //    FROM employees emp
        //    JOIN departments dept ON emp.department_id = dept.id;
        //`;
        //connection.query(query, (err, result, fields) => {
        //    if (err) throw err;
        //    console.table(result);
        //    callback();
        //});
    }
};

module.exports = Employee;