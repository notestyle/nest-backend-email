create table users(
 id uuid default gen_random_uuid() primary key,
 username varchar(100) not null,
 firstname varchar(150) not null,
 lastname varchar(150) not null,
 password varchar(500) not null,
 created_date timestamp not null default now(),
 updated_date timestamp,
 created_by varchar(50) not null default 'unknown',
 updated_by varchar(50)
);