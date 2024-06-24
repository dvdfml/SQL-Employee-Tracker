import inquirer from 'inquirer';
import pg from 'pg';
import { table } from './utils/table.js';

const { Pool } = pg;
const pool = new Pool(
    {
        // TODO: Enter PostgreSQL username
        user: 'postgres',
        // TODO: Enter PostgreSQL password
        password: 'vegetable',
        host: 'localhost',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
)

const displayOptions = async () => {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: ['View All Employees', 'View Employees by Manager', 'View Employees by Department', 'Add Employee', "Update Employee's Role", "Update Employee's Manager", 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Update Department', 'Exit']
        }
    ]
    );
    queryDatabase(choice);
}

async function queryDatabase(choice) {
    let response = {};
    let departments = {};
    let roles = {};
    let employees = {};

    switch (choice) {
        case 'View All Employees':
            response = await pool.query(
                `SELECT e.id, e.first_name, e.last_name, title, departments.name AS department, salary, m.first_name || ' ' || m.last_name AS manager
                 FROM employees AS e
                 INNER JOIN roles ON e.role_id = roles.id
                 INNER JOIN departments ON roles.department_id = departments.id
                 LEFT JOIN employees AS m ON e.manager_id = m.id`);
            break;

        case 'View Employees by Department':
            response = await pool.query(`SELECT * from departments`);
            // Map the rows array to match the object keys of value and name in the choices array of Inquirer.prompt 
            departments = response.rows.map((item) => ({ value: item.id, name: item.name }));
            response = await inquirer.prompt([
                {
                    type: 'list',
                    message: 'Choose a Department',
                    name: 'departmentId',
                    choices: departments
                }
            ]);
            response = await pool.query(
                `SELECT e.id, e.first_name, e.last_name, title, departments.name AS department, salary, m.first_name || ' ' || m.last_name AS manager
                    FROM employees AS e
                    INNER JOIN roles ON e.role_id = roles.id
                    INNER JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees AS m ON e.manager_id = m.id 
                    WHERE roles.department_id = $1`, [response.departmentId]);
            break;

        case 'View Employees by Manager':
            response = await pool.query(`SELECT * from employees`);
            // Map the rows array to match the object keys of value and name in the choices array of Inquirer.prompt 
            employees = response.rows.map((item) => ({ value: item.id, name: item.first_name + ' ' + item.last_name }));
            response = await inquirer.prompt([
                {
                    type: 'list',
                    message: 'Choose a Manager',
                    name: 'managerId',
                    choices: employees
                }
            ]);
            response = await pool.query(
                `SELECT e.id, e.first_name, e.last_name, title, departments.name AS department, salary, m.first_name || ' ' || m.last_name AS manager
                    FROM employees AS e
                    INNER JOIN roles ON e.role_id = roles.id
                    INNER JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees AS m ON e.manager_id = m.id 
                    WHERE e.manager_id = $1`, [response.managerId]);
            break;

        case 'View All Roles':
            response = await pool.query(`SELECT roles.id, title, name AS department, salary FROM roles 
                INNER JOIN departments ON roles.department_id = departments.id`);
            break;

        case 'View All Departments':
            response = await pool.query(`SELECT * FROM departments`);
            break;

        case 'Add Department':
            response = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the department?',
                    name: 'name'
                }
            ]);
            await pool.query(`INSERT INTO departments (name) VALUES ($1)`, [response.name]);
            console.log(`Added ${response.name} to the database`);
            return displayOptions();

        case 'Add Role':

            response = await pool.query(`SELECT * from departments`);
            // Map the rows array to match the object keys of value and name in the choices array of Inquirer.prompt 
            departments = response.rows.map((item) => ({ value: item.id, name: item.name }));
            response = await inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the role?',
                    name: 'name'
                },
                {
                    type: 'input',
                    message: 'What is the salary of the role?',
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: 'Which department does the role belong to?',
                    name: 'departmentId',
                    choices: departments
                }
            ]);
            await pool.query(`INSERT INTO roles (title, department_id, salary) VALUES ($1,$2,$3)`, [response.name, response.departmentId, response.salary]);
            console.log(`Added ${response.name} to the database`);
            return displayOptions();

        case 'Add Employee':
            response = await pool.query(`SELECT * from roles`);
            // Map the rows array to match the object keys of value and name in the choices array of Inquirer.prompt 
            roles = response.rows.map((item) => ({ value: item.id, name: item.title }));
            response = await pool.query(`SELECT * from employees`);
            employees = response.rows.map((item) => ({ value: item.id, name: item.first_name + ' ' + item.last_name }));

            response = await inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'firstName'
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'lastName'
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'roleId',
                    choices: roles
                },
                {
                    type: 'list',
                    message: "Who is the employee's manager?",
                    name: 'managerId',
                    choices: employees
                }
            ]);
            await pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)`, [response.firstName, response.lastName, response.roleId, response.managerId]);
            console.log(`Added ${response.firstName} ${response.lastName} to the database`);
            return displayOptions();

        case "Update Employee's Role":
            response = await pool.query(`SELECT * from employees`);
            employees = response.rows.map((item) => ({ value: item.id, name: item.first_name + ' ' + item.last_name }));
            response = await pool.query(`SELECT * from roles`);
            roles = response.rows.map((item) => ({ value: item.id, name: item.title }));
            response = await inquirer.prompt([
                {
                    type: 'list',
                    message: "Whose role do you want to update?",
                    name: 'employeeId',
                    choices: employees
                },
                {
                    type: 'list',
                    message: "What role do you want to assign the selected employee?",
                    name: 'roleId',
                    choices: roles
                }
            ]);
            await pool.query(`UPDATE employees SET role_id = $1 WHERE id = $2`, [response.roleId, response.employeeId]);
            console.log("Updated employee's role");
            return displayOptions();

        case "Update Employee's Manager":
            response = await pool.query(`SELECT * from employees`);
            employees = response.rows.map((item) => ({ value: item.id, name: item.first_name + ' ' + item.last_name }));
            response = await inquirer.prompt([
                {
                    type: 'list',
                    message: "Whose manager do you want to update?",
                    name: 'employeeId',
                    choices: employees
                },
                {
                    type: 'list',
                    message: "Which manager do you want to assign the selected employee?",
                    name: 'managerId',
                    choices: employees
                }
            ]);
            await pool.query(`UPDATE employees SET manager_id = $1 WHERE id = $2`, [response.managerId, response.employeeId]);
            console.log("Updated employee's manager");
            return displayOptions();


        case 'Exit':
            return console.log('Goodbye!');
    }
    table(response.rows);
    return displayOptions();
}

pool.connect();

displayOptions();