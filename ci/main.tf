provider "aws" {
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
  region = var.aws_region
}

locals {
  repo_name = "inspector-f"
}

data "template_file" "init" {
  template = file("scripts/init.tpl")
  vars = {
    repo = var.docker_repo
  }
}

resource "aws_instance" "api_host" {
  ami = "ami-0aee8ced190c05726"
  instance_type = "t2.micro"
  key_name = "inspector-f"
  user_data = data.template_file.init.rendered
  security_groups = [
    "bunch43-sg-ec2-express-api"
  ]
  tags = {
    name = "${local.repo_name}-${var.docker_tag_version}"
    version = var.docker_tag_version
    timestamp = timestamp()
  }
}

output "instance_dns" {
  value = aws_instance.api_host.public_dns
}

