CREATE TABLE role
(
    id   int AUTO_INCREMENT PRIMARY KEY,
    name varchar(30) NOT NULL
);

CREATE TABLE user
(
    id         int AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30) NOT NULL,
    last_name  varchar(30) NOT NULL,
    birth      date,
    gender     varchar(10),
    gmail      varchar(30) NOT NULL,
    password   varchar(30) NOT NULL,
    avatar     varchar(100),
    is_deleted boolean,
    phone      varchar(30),
    role       int         NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (role) REFERENCES role (id)
);

CREATE TABLE package
(
    id          int AUTO_INCREMENT PRIMARY KEY,
    name        varchar(30) NOT NULL,
    price       int         NOT NULL,
    description text,
    is_deleted  bool,
    time        int
);


CREATE TABLE register
(
    id          int AUTO_INCREMENT PRIMARY KEY,
    created_at  DATE,
    package     int NOT NULL,
    register_by int NOT NULL,
    trainer     int NOT NULL,
    customer    int NOT NULL,
    is_deleted  boolean,
    price       int,
    CONSTRAINT fk_package FOREIGN KEY (package) REFERENCES package (id),
    CONSTRAINT fk_register FOREIGN KEY (register_by) REFERENCES user (id),
    CONSTRAINT fk_trainer FOREIGN KEY (trainer) REFERENCES user (id),
    CONSTRAINT fk_customer FOREIGN KEY (customer) REFERENCES user (id)
);


CREATE TABLE feedback
(
    id                 int AUTO_INCREMENT PRIMARY KEY,
    content            text NOT NULL,
    created_at         DATE,
    user               int  NOT NULL,
    parent_feedback_id int,
    is_deleted         boolean,
    CONSTRAINT fk_user_feedback FOREIGN KEY (user) REFERENCES user (id)
);

CREATE TABLE ep_category
(
    id   int AUTO_INCREMENT PRIMARY KEY,
    name varchar(30) NOT NULL
);


CREATE TABLE room
(
    id         int AUTO_INCREMENT PRIMARY KEY,
    name       varchar(30) NOT NULL,
    address    varchar(30),
    acreage    int,
    is_deleted bool
);


CREATE TABLE equipment
(
    id              int AUTO_INCREMENT PRIMARY KEY,
    name            varchar(30) NOT NULL,
    purchase_date   DATE,
    price           int         NOT NULL,
    warranty_period int,
    category        int         NOT NULL,
    room            int         NOT NULL,
    is_deleted      bool,
    CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES ep_category (id),
    CONSTRAINT fk_room FOREIGN KEY (room) REFERENCES room (id)
);


CREATE TABLE process
(
    id         int AUTO_INCREMENT PRIMARY KEY,
    created_at DATE,
    content    TEXT,
    register   int NOT NULL,
    CONSTRAINT fk_process_register FOREIGN KEY (register) REFERENCES register (id)
);


-- Neu da co DATA tu truoc thi go lenh:
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE process;
TRUNCATE TABLE feedback;
TRUNCATE TABLE equipment;
TRUNCATE TABLE room;
TRUNCATE TABLE ep_category;
TRUNCATE TABLE register;
TRUNCATE TABLE package;
TRUNCATE TABLE user;
TRUNCATE TABLE role;
SET FOREIGN_KEY_CHECKS = 1;


# INSERT data
INSERT INTO role (name)
VALUES ('MANAGER'),
       ('CUSTOMER'),
       ('TRAINER'),
       ('SALE'),
       ('CUSTOMER_CARE');

INSERT INTO user (first_name, last_name, birth, gender, gmail, password, avatar, is_deleted, phone, role)
VALUES ('Tống', 'Phúc', '2002-05-15', 'Male', 'admin@gmail.com', 'admin', 'avatar1.jpg', FALSE, '1234567890', 1),
       ('Trường', 'Hoàng', '2002-12-10', 'Male', 'trainer@gmail.com', 'trainer', 'avatar3.jpg', FALSE, '4567890123', 3),
       ('Emily', 'Davis', '1995-07-03', 'Female', 'emilydavis@gmail.com', 'abc123xyz', 'avatar4.jpg', FALSE,
        '8901234567', 3),
       ('Anh', 'Nguyễn', '2002-02-28', 'Male', 'sale@gmail.com', 'sale', 'avatar5.jpg', FALSE, '0123456789', 4),
       ('Olivia', 'Wilson', '1991-11-14', 'Female', 'oliviawilson@gmail.com', 'hello123', 'avatar6.jpg', FALSE,
        '9876543210', 4),
       ('Lê', 'Quý', '2002-06-25', 'Male', 'customercare@gmail.com', 'customercare', 'avatar7.jpg', FALSE, '1234567890',
        5),
       ('Sophia', 'Anderson', '1994-03-18', 'Female', 'sophiaanderson@gmail.com', 'password789', 'avatar8.jpg', FALSE,
        '4567890123', 5),
       ('Quang', 'Nguyễn', '2002-09-05', 'Male', 'customer@gmail.com', 'customer', 'avatar9.jpg', FALSE, '8901234567',
        2),
       ('Jane', 'Smith', '1985-09-20', 'Female', 'janesmith@gmail.com', 'pass456', 'avatar2.jpg', FALSE, '9876543210',
        2),
       ('Mia', 'Robinson', '1996-01-08', 'Female', 'miarobinson@gmail.com', 'testpass', 'avatar10.jpg', FALSE,
        '0123456789', 2);

INSERT INTO package (name, price, description, is_deleted,time)
VALUES ('Basic', 50, 'Access to basic gym facilities', FALSE, 1),
       ('Standard', 80, 'Access to standard gym facilities and group classes', FALSE,2),
       ('Premium', 120, 'Access to premium gym facilities, group classes, and personal trainer sessions', FALSE,3),
       ('VIP', 200,
        'Access to VIP gym facilities, group classes, personal trainer sessions, and nutritionist consultations',
        FALSE,1),
       ('Trial', 10, 'One-week trial access to gym facilities', FALSE, 2),
       ('Student', 40, 'Discounted package for students', FALSE, 3),
       ('Senior', 40, 'Discounted package for seniors', FALSE, 1),
       ('Couple', 150, 'Package for couples', FALSE, 2),
       ('Family', 200, 'Package for families', FALSE, 3),
       ('Corporate', 300, 'Package for corporate members', FALSE,1);

INSERT INTO register (created_at, package, register_by, trainer, customer, is_deleted, price)
VALUES ('2023-07-01', 1, 1, 2, 3, FALSE, 10000),
       ('2023-07-02', 3, 2, 4, 4, FALSE, 20000),
       ('2023-07-03', 2, 3, 3, 5, FALSE, 30000),
       ('2023-07-04', 4, 1, 2, 6, FALSE, 10000),
       ('2023-07-05', 5, 2, 4, 7, FALSE, 20000),
       ('2023-07-06', 3, 3, 3, 8, FALSE, 30000),
       ('2023-07-07', 6, 1, 2, 9, FALSE, 10000),
       ('2023-07-08', 7, 2, 4, 10, FALSE, 20000),
       ('2023-07-09', 1, 3, 3, 2, FALSE, 30000),
       ('2023-07-10', 8, 1, 2, 1, FALSE, 10000);

INSERT INTO feedback (content, created_at, user, parent_feedback_id, is_deleted)
VALUES ('Great gym with excellent equipment!', '2023-07-02', 3, 0, FALSE),
       ('The trainers are very helpful and friendly.', '2023-07-03', 4, 0, FALSE),
       ('I love the variety of classes offered.', '2023-07-05', 5, 0, FALSE),
       ('The gym is always clean and well-maintained.', '2023-07-06', 6, 0, FALSE),
       ('The nutritionist provided valuable advice for my fitness goals.', '2023-07-08', 7, 0, FALSE),
       ('I enjoy the yoga sessions.', '2023-07-09', 8, 1, FALSE),
       ('The pilates instructor is amazing!', '2023-07-10', 9, 4, FALSE),
       ('The staff is friendly and professional.', '2023-07-11', 10, 1, FALSE),
       ('I highly recommend this gym!', '2023-07-13', 1, 2, FALSE),
       ('The facilities are top-notch.', '2023-07-14', 2, 0, FALSE);

INSERT INTO ep_category (name)
VALUES ('Cardio Equipment'),
       ('Strength Equipment'),
       ('Free Weights'),
       ('Machines'),
       ('Functional Training'),
       ('Group Exercise'),
       ('Yoga & Pilates'),
       ('Sports & Recreation'),
       ('Pool & Spa'),
       ('Sauna & Steam Room');

INSERT INTO room (name, address, acreage, is_deleted)
VALUES ('Room 1', '123 Main Street', 1000, FALSE),
       ('Room 2', '456 Elm Avenue', 800, FALSE),
       ('Room 3', '789 Oak Boulevard', 1200, FALSE),
       ('Room 4', '321 Pine Lane', 900, FALSE),
       ('Room 5', '654 Maple Road', 1500, FALSE),
       ('Room 6', '987 Cedar Drive', 1100, FALSE),
       ('Room 7', '159 Birch Court', 700, FALSE),
       ('Room 8', '753 Walnut Circle', 1000, FALSE),
       ('Room 9', '258 Spruce Lane', 1300, FALSE),
       ('Room 10', '951 Ash Street', 950, FALSE);

INSERT INTO equipment (name, purchase_date, price, warranty_period, category, room, is_deleted)
VALUES ('Treadmill', '2022-01-05', 2000, 12, 1, 1, FALSE),
       ('Stationary Bike', '2022-03-10', 1500, 12, 1, 1, FALSE),
       ('Ell

iptical Trainer', '2022-05-15', 1800, 12, 1, 2, FALSE),
       ('Rowing Machine', '2022-02-20', 1700, 12, 1, 2, FALSE),
       ('Bench Press', '2022-04-25', 1000, 12, 2, 3, FALSE),
       ('Dumbbells Set', '2022-06-30', 800, 12, 3, 3, FALSE),
       ('Leg Press', '2022-03-15', 1200, 12, 2, 4, FALSE),
       ('Smith Machine', '2022-05-20', 2000, 12, 2, 4, FALSE),
       ('Functional Trainer', '2022-01-10', 2500, 12, 5, 5, FALSE),
       ('Cable Crossover', '2022-07-05', 1800, 12, 5, 5, FALSE);

INSERT INTO process (created_at, content, register)
VALUES ('2023-07-01', 'Initial fitness assessment conducted.', 1),
       ('2023-07-02', 'Personal training session scheduled.', 2),
       ('2023-07-03', 'Group class attended: Yoga', 3),
       ('2023-07-04', 'Progress review and goal setting', 4),
       ('2023-07-05', 'Group class attended: Zumba', 5),
       ('2023-07-06', 'Personal training session conducted.', 6),
       ('2023-07-07', 'Group class attended: Pilates', 7),
       ('2023-07-08', 'Nutritionist consultation scheduled.', 8),
       ('2023-07-09', 'Yoga session attended.', 9),
       ('2023-07-10', 'Pilates session attended.', 10);