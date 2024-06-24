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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Update Department', 'Exit']
        }
    ]
    );
    queryDatabase(choice);
}

async function queryDatabase(choice) {
    let result = {};
    let response = {};
    // let rows = {};
    switch (choice) {
        case 'View All Employees':
            result = await pool.query(
                `SELECT e.id, e.first_name, e.last_name, title, departments.name AS department, salary, m.first_name || ' ' || m.last_name AS manager
                 FROM employees AS e
                 INNER JOIN roles ON e.role_id = roles.id
                 INNER JOIN departments ON roles.department_id = departments.id
                 LEFT JOIN employees AS m ON e.manager_id = m.id`);
            break;

        case 'View All Roles':
            result = await pool.query(`SELECT roles.id, title, name AS department, salary FROM roles 
                INNER JOIN departments ON roles.department_id = departments.id`);
            break;

        case 'View All Departments':
            result = await pool.query(`SELECT * FROM departments`);
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
            // console.log(result);
            console.log(`Added ${response.name} to the database`);
            return displayOptions();

        case 'Add Role':

            response = await pool.query(`SELECT * from departments`);
            // Map the rows array to match the object keys of value and name in the choices array of Inquirer.prompt 
            response.rows = response.rows.map((item) => ({ value: item.id, name: item.name }));
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
                    choices: response.rows
                }
            ]);
            await pool.query(`INSERT INTO roles (title, department_id, salary) VALUES ($1,$2,$3)`, [response.name, response.departmentId, response.salary]);
            console.log(`Added ${response.name} to the database`);
            return displayOptions();

        case 'Add Employee':
            response = await pool.query(`SELECT * from roles`);
            // Map the rows array to match the object keys of value and name in the choices array of Inquirer.prompt 
            const roles = response.rows.map((item) => ({ value: item.id, name: item.title }));
            response = await pool.query(`SELECT * from employees`);
            const employees = response.rows.map((item) => ({ value: item.id, name: item.first_name + ' ' + item.last_name }));

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

        case 'Exit':
            return console.log('Goodbye!');
    }
    table(result.rows);
    return displayOptions();
}

pool.connect();

displayOptions();