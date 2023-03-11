create table `server_live` (
	id int primary key not null auto_increment,
	server_port int not null,
    server_status int not null
);

ALTER TABLE `myDb`.`server_live` 
ADD UNIQUE INDEX `server_port_UNIQUE` (`server_port` ASC) VISIBLE;
;
