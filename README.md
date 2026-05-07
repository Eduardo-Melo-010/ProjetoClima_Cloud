# Comandos para Rodar a Aplicação com Terraform

## 1. Acessar a pasta do projeto

bash

cd "/c/Users/eduar/OneDrive/Área de Trabalho/Projetos_Senac/CloudComputing/Docker"

## 2. Subir a infraestrutura na AWS

cd terraform

terraform init

yes

## 3. Copiar o IP público

ip_publico = "SEU_IP_PUBLICO"

## 4. Acessar a aplicação
   
Exemplo - http://11.111.111.111 - FRONTEND

Exemplo - http://54.158.197.234:3000/weather?city=Recife - BACKEND

## 5. Atualizar os containers manualmente na EC2

ssh -i "/c/Users/eduar/OneDrive/Documentos/AWS_EC2/101291@edu3232.pem" ec2-user@SEU_IP_PUBLICO

sudo docker rm -f backend-weather frontend-weather

sudo docker pull eduardomelo010/backend-weather:latest
sudo docker pull eduardomelo010/frontend-weather:latest

sudo docker run -d --name backend-weather -p 3000:3000 eduardomelo010/backend-weather:latest
sudo docker run -d --name frontend-weather -p 80:80 eduardomelo010/frontend-weather:latest

sudo docker ps
