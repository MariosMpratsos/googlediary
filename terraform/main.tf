terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-north-1" # Στοκχόλμη (εκεί που είναι το 16.171.139.5)
}

# Security Group που ανοίγει τις πόρτες για SSH, K3s, Frontend & Backend
resource "aws_security_group" "k3s_devops_sg" {
  name        = "k3s-devops-portfolio-sg"
  description = "Allow SSH, K3s API, and NodePort traffic for Frontend & Backend"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "K3s Kubernetes API"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend Nginx NodePort"
    from_port   = 30173
    to_port     = 30173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend Node.js NodePort"
    from_port   = 30500
    to_port     = 30500
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Ορισμός του EC2 Instance (Amazon Linux 2023 - Free Tier)
resource "aws_instance" "google_diary_k3s" {
  ami           = "ami-0014ce3e52359afbd" # Amazon Linux 2023 x86_64 (eu-north-1)
  instance_type = "t3.micro"
  security_groups = [aws_security_group.k3s_devops_sg.name]

  root_block_device {
    volume_size = 20 # 20GB Free Tier EBS Disk
    volume_type = "gp3"
  }

  tags = {
    Name        = "GoogleDiary"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

output "public_ip" {
  value = aws_instance.google_diary_k3s.public_ip
}
