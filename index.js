import select from '@inquirer/select';
import pg from 'pg';

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
    console.log(`Connected to the movies_db database.`)
)

const displayOptions = async () => {
    const answer = await select({
        message: 'What would you like to do?',
        choices: [
            {
                value: 'View All Employees'
            },
            {
                value: 'Add Employee'
            },
            {
                value: 'Update Employee Role'
            },
            {
                value: 'View All Roles'
            },
            {
                value: 'Add Role'
            },
            {
                value: 'View All Departments'
            },
            {
                value: 'Add Department'
            },
            {
                value: 'Update Department'
            },
            {
                value: 'Exit'
            }]
    });
    queryDatabase(answer);
}

async function queryDatabase(answer) {
    let result = {};
    switch (answer) {
        case 'View All Employees':
            result = await pool.query(
                `SELECT e.id, e.first_name, e.last_name, title, departments.name AS department, salary, m.first_name || ' ' || m.last_name AS manager
                 FROM employees AS e
                 INNER JOIN roles ON e.role_id = roles.id
                 INNER JOIN departments ON roles.department_id = departments.id
                 LEFT JOIN employees AS m ON e.manager_id = m.id`);
            console.table(result.rows);
            return displayOptions();

        case 'View All Roles':
            result = await pool.query(`SELECT roles.id, title, name AS department, salary FROM roles 
                INNER JOIN departments ON roles.department_id = departments.id`);
            console.table(result.rows);
            return displayOptions();

        case 'View All Departments':
            result = await pool.query(`SELECT * FROM departments`);
            console.table(result.rows);
            return displayOptions();

        case 'Exit':
            return console.log('Goodbye!');
    }
}

pool.connect();

displayOptions();