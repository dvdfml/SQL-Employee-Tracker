-- Inserting data into department table
INSERT INTO departments (id, name) VALUES
(1, 'Engineering'),
(2, 'Finance'),
(3, 'Legal'),
(4, 'Sales');

-- Inserting data into role table
INSERT INTO roles (id, title, department_id, salary) VALUES
(1, 'Sales Lead', 4, 100000),
(2, 'Salesperson', 4, 80000),
(3, 'Lead Engineer', 1, 150000),
(4, 'Software Engineer', 1, 120000),
(5, 'Account Manager', 2, 160000),
(6, 'Accountant', 2, 125000),
(7, 'Legal Team Lead', 3, 250000),
(8, 'Lawyer', 3, 190000);

-- Inserting data into employee table
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Mike', 'Chan', 2, 1),
(3, 'Ashley', 'Rodriguez', 3, NULL),
(4, 'Kevin', 'Tupik', 4, 3),
(5, 'Kunal', 'Singh', 5, NULL),
(6, 'Malia', 'Brown', 6, 5),
(7, 'Sarah', 'Lourd', 7, NULL),
(8, 'Tom', 'Allen', 8, 7);
