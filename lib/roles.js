const connection = require('./db');
const Table = require('cli-table3');

class Roles {
    viewAllRoles (callback) {
        let query = `
            SELECT role.id, role.title, dept.name AS department, role.salary
            FROM roles role
            INNER JOIN departments AS dept ON role.department_id = dept.id
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const deptData = result;
            const table = new Table({
                head: ['ID', 'Title', 'Department ID', 'Salary'],
                colWidths: [10, 30],
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
            deptData.forEach((row) => {
                table.push([row.id, row.title, row.department, row.salary]);
            });
            console.log(table.toString());
            callback();
        });
    }
};

module.exports = Roles;