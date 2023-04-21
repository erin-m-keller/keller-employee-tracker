require('dotenv').config()
const connection = require('./lib/db'),
      inquirer = require('inquirer'),
      Employee = require('./lib/employee'),
      Department = require('./lib/department'),
      asciiArt = `
        .-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.
        |                                                                            |
        |   ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    |
        |   ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    |
        |   █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗      |
        |   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝      |
        |   ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗    |
        |   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝    |
        |                                                                            |
        |   ██████╗  █████╗ ████████╗ █████╗ ██████╗  █████╗ ███████╗███████╗        |
        !   ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝        !
        :   ██║  ██║███████║   ██║   ███████║██████╔╝███████║███████╗█████╗          :
        :   ██║  ██║██╔══██║   ██║   ██╔══██║██╔══██╗██╔══██║╚════██║██╔══╝          :
        :   ██████╔╝██║  ██║   ██║   ██║  ██║██████╔╝██║  ██║███████║███████╗        :
        :   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝        :
        .                                                                            .
        .   ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗            .
        .   ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗           .
        .   ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝           .
        :   ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗           :
        !   ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║           !
        |                                                                            |
        .-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.
      `;

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to ${connection.config.database} database:` + err.stack);
        return;
    }
    console.log(`Successfully connected to ${connection.config.database} database.`);
    terminalPrompt();
});

// Create the prompts
const applicationPrompts = () => {
    return inquirer.prompt([
        {
            name: "selectedTask",
            type: "list",
            message: "What would you like to do?",
            choices: [
                { name: "\x1b[33mView All Employees\x1b[0m", value: "all_emp"},
                { name: "\x1b[33mView Employees by Manager\x1b[0m", value: "emp_by_mgr"},
                { name: "\x1b[33mView Employees by Department (bonus)\x1b[0m", value: "emp_by_dept"},
                { name: "\x1b[32mAdd Employee\x1b[0m", value: "add_emp"},
                { name: "\x1b[32mDelete Employee (bonus)\x1b[0m", value: "delete_emp"},
                { name: "\x1b[32mUpdate Employee Role\x1b[0m", value: "update_emp_role"},
                { name: "\x1b[32mUpdate Employee Manager (bonus)\x1b[0m", value: "update_emp_mgr"},
                { name: "\x1b[33mView All Roles\x1b[0m", value: "all_roles"},
                { name: "\x1b[32mAdd Role\x1b[0m", value: "add_role"},
                { name: "\x1b[32mDelete Role (bonus)\x1b[0m", value: "delete_role"},
                { name: "\x1b[33mView All Departments\x1b[0m", value: "all_depts"},
                { name: "\x1b[32mAdd Department\x1b[0m", value: "add_dept"},
                { name: "\x1b[32mDelete Department (bonus)\x1b[0m", value: "delete_dpt"},
                { name: "\x1b[31mExit\x1b[0m", value: "exit"},
            ]
            
        }
    ])
};

function terminalPrompt() {
    console.log('\x1b[35m%s\x1b[0m',asciiArt);
    applicationPrompts().then(response => {
        let employeeClass = new Employee(),
            departmentClass = new Department();
        switch (response.selectedTask) {
            case 'all_emp': {
                employeeClass.viewAllEmployees(terminalPrompt);
                break;
            }
            case 'emp_by_mgr': {
                employeeClass.viewEmployeesByManager(terminalPrompt);
                break;
            }
            case 'emp_by_dept': {
                employeeClass.viewEmployeesByDept(terminalPrompt);
                break;
            }
            case 'add_emp': {
                console.info('Add Employee - TODO');
                break;
            }
            case 'delete_emp': {
                console.info('Delete Employee - TODO (bonus)');
                break;
            }
            case 'update_emp_role': {
                console.info('Update Employee Role - TODO');
                break;
            }
            case 'update_emp_mgr': {
                console.info('Update Employee Manager - TODO (bonus)');
                break;
            }
            case 'all_roles': {
                console.info('View All Roles - TODO');
                break;
            }
            case 'add_role': {
                console.info('Add Role - TODO');
                break;
            }
            case 'delete_role': {
                console.info('Delete Role - TODO (bonus)');
                break;
            }
            case 'all_depts': {
                departmentClass.viewAllDepartments(terminalPrompt);
                break;
            }
            case 'add_dept': {
                console.info('Add Department - TODO');
                break;
            }
            case 'delete_dpt': {
                console.info('Delete Department - TODO (bonus)');
                break;
            }
            case 'exit': {
                console.info('Exit the application - TODO');
                break;
            }
            default:
                // default
            }
    }).catch(err => {
        // console log the error
        console.log(`Error: ${err}`)
    });
}
  