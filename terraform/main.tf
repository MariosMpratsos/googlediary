provider "aws" {
  region = "eu-north-1"
}

resource "aws_security_group" "k3s_sg" {
  name        = "k3s-reminder-sg"
  description = "Allow SSH, HTTP, HTTPS and K3s NodePorts"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend HTTP NodePort"
    from_port   = 30173
    to_port     = 30173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend HTTPS NodePort"
    from_port   = 30443
    to_port     = 30443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend NodePort"
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

resource "aws_instance" "k3s_server" {
  ami                    = "ami-0705384c0b33c194c"
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.k3s_sg.id]

  # Cloud-Init (Αντικαθιστά πλήρως το Ansible στο Cloud!)
  user_data = <<-EOF
              #!/bin/bash
              dd if=/dev/zero of=/swapfile bs=1M count=2048
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
              curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --disable servicelb --disable metrics-server --write-kubeconfig-mode 644" sh -
              chown -R ec2-user:ec2-user /home/ec2-user
              EOF

  tags = {
    Name = "Reminder-K3s-Server"
  }
}
