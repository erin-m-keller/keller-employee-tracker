const connection = require('./db');
const Table = require('cli-table3');

class Employee {
    viewAllEmployees (callback) {
        let query = `
            SELECT emp.id, emp.first_name, emp.last_name, role.title, dept.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
            FROM employees emp
            INNER JOIN roles role ON emp.role_id = role.id
            INNER JOIN departments dept ON role.department_id = dept.id
            LEFT JOIN employees mgr ON emp.manager_id = mgr.id;
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const empData = result;
            const table = new Table({
                head: ['ID', 'Employee First Name', 'Employee Last Name', 'Role', 'Department', 'Salary', 'Manager'],
                colWidths: [10, 30, 30, 30, 30, 12, 60],
                style: {
                    head: ['brightMagenta','bold'],
                    border: ['cyan']
                },
                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                    'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
                    'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
                    'right': '│', 'right-mid': '┤', 'middle': '│'
                }
            });
            empData.forEach((row) => {
                table.push([row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager]);
            });
            console.log(table.toString());
            callback();
        });
    }
    viewEmployeesByManager (callback) {
        let query = `
            SELECT managers.first_name AS mgr_first_name, managers.last_name AS mgr_last_name,
            GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name) SEPARATOR ' | ') AS emp
            FROM employees emp
            LEFT JOIN employees AS managers ON emp.manager_id = managers.id
            GROUP BY emp.manager_id
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const mgrData = result;
            const table = new Table({
                head: ['Manager First Name', 'Manager Last Name', 'Employee List'],
                colWidths: [30, 30, 'auto'],
                style: {
                    head: ['brightMagenta','bold'],
                    border: ['cyan']
                },
                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                    'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
                    'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
                    'right': '│', 'right-mid': '┤', 'middle': '│'
                }
            });
            mgrData.forEach((row) => {
                table.push([row.mgr_first_name, row.mgr_last_name, row.emp]);
            });
            console.log(table.toString());
            callback();
        });
    }
    viewEmployeesByDept (callback) {
        // TODO: work in progress
        //let query = `
        //    SELECT emp.first_name AS emp_first_name, emp.last_name AS emp_last_name, dept.name AS dept_name
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