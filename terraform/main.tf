terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "app_sg" {
  name        = "app-security-group"
  description = "Security group para aplicacao Docker na EC2"

  ingress {
    description = "Liberar acesso HTTP frontend"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Liberar acesso backend Node.js"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Liberar acesso SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Permitir saida para internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "docker_ec2" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  key_name      = "101291@edu3232"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data_replace_on_change = true

  user_data = <<-EOF
#!/bin/bash

yum update -y

amazon-linux-extras install docker -y || yum install docker -y

systemctl start docker
systemctl enable docker

docker pull eduardomelo010/backend-weather:latest
docker pull eduardomelo010/frontend-weather:latest

docker rm -f backend-weather || true
docker rm -f frontend-weather || true

docker run -d --name backend-weather -p 3000:3000 eduardomelo010/backend-weather:latest
docker run -d --name frontend-weather -p 80:80 eduardomelo010/frontend-weather:latest

EOF

  tags = {
    Name = "Projeto-Docker-Terraform"
  }
}

output "ip_publico" {
  value = aws_instance.docker_ec2.public_ip
}