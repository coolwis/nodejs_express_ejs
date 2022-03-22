create table if not exists movies (
    movie_id int primary key auto_increment,
    title varchar(50),
    director varchar(50),
    year int
) default charater set = utf8;

create table if not exists reviews (
    movie_id int,
    review varchar(255)
) default charater set = utf8;


insert into movies values ( null, 'star war', 'joy', 1977);
insert into movies values ( null, 'terminator', 'kings', 2001);