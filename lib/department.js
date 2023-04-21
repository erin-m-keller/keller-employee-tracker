const connection = require('./db');
const Table = require('cli-table3');

class Department {
    viewAllDepartments (callback) {
        let query = `SELECT * FROM departments`;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const deptData = result;
            const table = new Table({
                head: ['ID', 'Name'],
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
                table.push([row.id, row.name]);
            });
            console.log(table.toString());
            callback();
        });
    }
};

module.exports = Department;