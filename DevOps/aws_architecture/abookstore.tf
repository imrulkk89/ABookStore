terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
        }
    }
}

variable "user_access_id" {
  description = "AWS User Access ID"
  #default = ""
  type = string
}

variable "user_secret_key" {
  description = "AWS User Secret Key"
  #default = ""
  type = string
}

variable "db_password" {
  description = "RDS root user password"
  sensitive   = true
}

variable "db_username" {
  description = "RDS root username"
  default = "admin"
  type = string
}

variable "db_name" {
  description = "RDS root username"
  default = "abookstore_db"
  type = string
}

provider "aws" {
  region = "eu-west-1"
  access_key = var.user_access_id
  secret_key = var.user_secret_key
}

#1. Create VPC

resource "aws_vpc" "abookstore" {
  tags = {
    Name = "ABookStore"
  }
  cidr_block = "172.16.0.0/23"
}

#2.Create Internet Gateway
resource "aws_internet_gateway" "abookstore_igw" {
  tags = {
    Name = "AbookStore IGW"
  }
  vpc_id = aws_vpc.abookstore.id
}

#3. All Subnets 
#Group 1 
##Public Subnet A
resource "aws_subnet" "public_subnet_a" {
  tags = {
      Name = "Public Subnet A"
  }

  vpc_id = aws_vpc.abookstore.id
  cidr_block = "172.16.0.0/26"
  availability_zone = "eu-west-1a"
  depends_on = [
    aws_internet_gateway.abookstore_igw
  ]
}

##Private Subnet A
resource "aws_subnet" "private_subnet_a" {
  tags = {
      Name = "Private Subnet A"
  }

  vpc_id = aws_vpc.abookstore.id
  cidr_block = "172.16.0.64/26"
  availability_zone = "eu-west-1a"
}

##Data Subnet A
resource "aws_subnet" "data_subnet_a" {
    tags = {
      Name = "Data Subnet A"
  }

  vpc_id = aws_vpc.abookstore.id
  cidr_block = "172.16.0.128/26"
  availability_zone = "eu-west-1a"
}

#Group 2
##Public Subnet B
resource "aws_subnet" "public_subnet_b" {
  tags = {
      Name = "Public Subnet B"
  }

  vpc_id = aws_vpc.abookstore.id
  cidr_block = "172.16.1.0/26"
  availability_zone = "eu-west-1b"
  depends_on = [
    aws_internet_gateway.abookstore_igw
  ]
}

##Private Subnet B
resource "aws_subnet" "private_subnet_b" {
  tags = {
      Name = "Private Subnet B"
  }

  vpc_id = aws_vpc.abookstore.id
  cidr_block = "172.16.1.64/26"
  availability_zone = "eu-west-1b"
}

##Data Subnet B
resource "aws_subnet" "data_subnet_b" {
    tags = {
      Name = "Data Subnet B"
  }

  vpc_id = aws_vpc.abookstore.id
  cidr_block = "172.16.1.128/26"
  availability_zone = "eu-west-1b"
}

#4. DB Subnet Groups
resource "aws_db_subnet_group" "abookstore" {
  tags = {
      Name = "RDS Subnet Group"
  }    
  name = "rds_subnet_group"

  subnet_ids = [aws_subnet.data_subnet_a.id, aws_subnet.data_subnet_b.id]  
}

#5. Route Tables in A
## Public Route Table
resource "aws_route_table" "public_rt" {
  tags = {
      Name = "Public Route Table A"
  }

  vpc_id = aws_vpc.abookstore.id

  route {
      cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.abookstore_igw.id
  }
}

##Private Route Table A
resource "aws_route_table" "private_rt_a" {
  tags = {
    Name = "Private Route Table A"
  }

  vpc_id = aws_vpc.abookstore.id  
}

##Private Route Table B
resource "aws_route_table" "private_rt_b" {
  tags = {
    Name = "Private Route Table B"
  }

  vpc_id = aws_vpc.abookstore.id  
}

#6. Route Table Association
##Public A
resource "aws_route_table_association" "public_subnet_a_rta" {
  subnet_id = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_rt.id
}

##Private A
resource "aws_route_table_association" "private_subnet_a_rta" {
  subnet_id = aws_subnet.private_subnet_a.id
  route_table_id = aws_route_table.private_rt_a.id
}

##Data A
resource "aws_route_table_association" "data_subnet_a_rta" {
  subnet_id = aws_subnet.data_subnet_a.id
  route_table_id = aws_route_table.private_rt_a.id
}

##Public B
resource "aws_route_table_association" "public_subnet_b_rta" {
  subnet_id = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_rt.id
}

##Private B
resource "aws_route_table_association" "private_subnet_b_rta" {
  subnet_id = aws_subnet.private_subnet_b.id
  route_table_id = aws_route_table.private_rt_b.id
}

##Data B
resource "aws_route_table_association" "data_subnet_b_rta" {
  subnet_id = aws_subnet.data_subnet_b.id
  route_table_id = aws_route_table.private_rt_b.id
}

#7. Security Groups
## Instance Security Group
resource "aws_security_group" "sg_instance" {
  name = "sg_ec2"
  description = "Allow web traffics and ssh"
  vpc_id = aws_vpc.abookstore.id

  tags = {
    Name = "SG EC2 Instance"
  }

  ingress {
    description = "HTTPS"
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port = 80
    to_port = 80 
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port = 22
    to_port = 22 
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = [ "0.0.0.0/0" ]
  }
}

## RDS Security Groups
resource "aws_security_group" "sg_rds" {
  name = "abookstore_rds"
  vpc_id = aws_vpc.abookstore.id

  tags = {
    Name = "SG - ABookStore MySQL"
  }

   ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["172.16.0.0/23"]
  }

  egress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["172.16.0.0/23"]
  }
}


#8. Create RDS
## DB Parameter Group
resource "aws_db_parameter_group" "abookstore" {
  name   = "abookstore"
  family = "mysql5.7"

   parameter {
    name  = "character_set_server"
    value = "utf8"
  }

  parameter {
    name  = "character_set_client"
    value = "utf8"
  }
}

## DB Instance
resource "aws_db_instance" "abookstore_rds" {
  identifier = "abookstore"
  instance_class = "db.t3.micro"
  allocated_storage = 10
  max_allocated_storage = 100
  engine = "mysql"
  engine_version = "5.7"
  username = var.db_username
  password = var.db_password
  parameter_group_name = aws_db_parameter_group.abookstore.name
  db_subnet_group_name = aws_db_subnet_group.abookstore.name
  vpc_security_group_ids = [aws_security_group.sg_rds.id]
  skip_final_snapshot = true
}

output "abookstore_database" {
  value = aws_db_instance.abookstore_rds.address
}

#9. Create EC2 Instance
## Create Network Interfaces
resource "aws_network_interface" "instance_nic" {
  subnet_id = aws_subnet.public_subnet_a.id
  private_ips = ["172.16.0.50"]
  security_groups = ["${aws_security_group.sg_instance.id}"]
}

resource "aws_network_interface" "blog_instance_nic" {
  subnet_id = aws_subnet.public_subnet_b.id
  private_ips = ["172.16.1.50"]
  security_groups = ["${aws_security_group.sg_instance.id}"]
}

#10. Create Ubuntu EC2 instance
variable "ec2_ami" {
  description = "AMI ID for EC2 instance"
  type = string
}

variable "blog_ec2_ami" {
  description = "AMI ID for Blog EC2 instance"
  type = string
}

variable "ec2_type" {
  description = "EC2 Instance Type"
  type = string
  default = "t2.micro"
}

variable "ec2_ssh_keyname" {
  description = "EC2 Instance SSH Keyname"
  type = string
  default = "abookstore"
}

resource "aws_instance" "web_server" {
  tags = {
    Name = "ABookStore Backend"
  }

  ami = var.ec2_ami   # Pre-made AMI where everything is configured      
  instance_type = var.ec2_type
  availability_zone = "eu-west-1a"
  key_name = var.ec2_ssh_keyname

  network_interface {
     device_index = 0
     network_interface_id = aws_network_interface.instance_nic.id
  }

  # user_data blocked because currently we're using pre-made AMI
  /* user_data = <<-EOF
                #!/bin/bash
                sudo apt update -y
                sudo apt install git -y
                sudo apt install nginx -y 
                sudo systemctl start nginx
                sudo systemctl enable nginx
                sudo apt install curl -y
                curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
                sudo apt update -y                
                sudo apt install gcc g++ make -y
                sudo apt install build-essential -y
                sudo apt install nodejs -y
                sudo npm install -g node-gyp node-pre-gyp
                sudo npm install -g @adonisjs/cli
                sudo apt remove cmdtest -y
                sudo apt remove yarn                
                sudo apt update -y                                
                sudo apt install mariadb-client -y
                sudo npm install -g yarn
                sudo npm install -g pm2 
                sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
                sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
                curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
                sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"
                sudo apt update
                sudo apt-get install docker-ce -y
                sudo docker run -d --name abookstore-redis -p 6379:6379 redis
                EOF */

}

resource "aws_instance" "blog_web_server" {
  tags = {
    Name = "ABookStore Blog"
  }

  ami = var.blog_ec2_ami   # Pre-made AMI where everything is configured      
  instance_type = var.ec2_type
  availability_zone = "eu-west-1b"
  key_name = var.ec2_ssh_keyname

  network_interface {
     device_index = 0
     network_interface_id = aws_network_interface.blog_instance_nic.id
  }

  # user_data blocked because currently we're using pre-made AMI
  user_data = <<-EOF
                #!/bin/bash
                sudo apt update -y
                sudo apt install git -y
                sudo apt install nginx -y 
                sudo systemctl start nginx
                sudo systemctl enable nginx
                sudo apt install curl -y                                             
                sudo apt install gcc g++ make -y
                sudo apt install build-essential -y
                sudo apt install mariadb-client -y
                sudo apt install php7.4 php7.4-gd php7.4-mysql php7.4-zip php7.4-fpm -y
                sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
                curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
                sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"
                sudo apt update
                sudo apt-get install docker-ce -y                
                EOF

}


#11. Assign Elastic IP to the Network Interface
resource "aws_eip" "abookstore" {
  tags = {
    Name = "ABookStore Elastic IP"
  }

  vpc = true
  network_interface = aws_network_interface.instance_nic.id
  associate_with_private_ip = "172.16.0.50"
  depends_on = [
    aws_internet_gateway.abookstore_igw,
    aws_instance.web_server
  ]
}

resource "aws_eip" "abookstore_blog" {
  tags = {
    Name = "ABookStore Blog Elastic IP"
  }

  vpc = true
  network_interface = aws_network_interface.blog_instance_nic.id
  associate_with_private_ip = "172.16.1.50"
  depends_on = [
    aws_internet_gateway.abookstore_igw,
    aws_instance.blog_web_server
  ]
}

output "instance_elastic_ip" {
  value = aws_eip.abookstore.public_ip
}

output "blog_elastic_ip" {
  value = aws_eip.abookstore_blog.public_ip
}

#12. Route 53 configuration

variable "domain_name" {
  description = "A Domain Name"
  #default = ""
  type = string
}

variable "sub_domain_name" {
  description = "Sub Domain Name"
  #default = ""
  type = string  
}

#resource "aws_route53_zone" "main" {
#  name = var.domain_name
#}

/* resource "aws_route53_zone" "sub_domain" {
  name = var.sub_domain_name
  comment = "Hosted zone for admin panel"

  tags = {
     Environment = "prod"
  }
} */

/* resource "aws_route53_record" "sub_domain_ns" {

  zone_id = aws_route53_zone.main.zone_id
  name = var.sub_domain_name
  type = "NS"
  ttl  = "30"
  records = aws_route53_zone.sub_domain.name_servers
}

output "dns_records" {
  value = aws_route53_record.sub_domain_ns.records
} */







 

 






