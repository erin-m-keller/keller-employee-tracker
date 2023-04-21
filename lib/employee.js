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
            SELECT empMgr.first_name AS first, empMgr.last_name AS last,
            GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name) SEPARATOR ' | ') AS list
            FROM employees emp
            LEFT JOIN employees AS empMgr ON emp.manager_id = empMgr.id
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
                table.push([row.first, row.last, row.list]);
            });
            console.log(table.toString());
            callback();
        });
    }
    viewEmployeesByDept (callback) {
        let query = `
            SELECT emp.first_name AS first, emp.last_name AS last, dept.name AS department
            FROM employees emp
            INNER JOIN roles AS role ON emp.role_id = role.id
            INNER JOIN departments AS dept ON role.department_id = dept.id
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const empDeptData = result;
            const table = new Table({
                head: ['Employee First Name', 'Employee Last Name', 'Department'],
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
            empDeptData.forEach((row) => {
                table.push([row.first, row.last, row.department]);
            });
            console.log(table.toString());
            callback();
        });
    }
};

module.exports = Employee;