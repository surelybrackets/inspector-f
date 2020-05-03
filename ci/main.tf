variable "aws_access_key_id" {
  type = "string"
}

variable "aws_secret_access_key" {
  type = "string"
}

variable "docker_username" {
  type = "string"
}

variable "docker_tag_version" {
  type = "string"
}

variable "aws_region" {
  type = "string"
  default = "us-east-1"
}


provider "aws" {
  access_key = "${var.aws_access_key_id}"
  secret_key = "${var.aws_secret_access_key}"
  region = "${var.aws_region}"
}

locals {
  repo_name = "inspector-f"
  init_time = "${timestamp()}"
}

resource "aws_instance" "api_host" {
  ami = "ami-0aee8ced190c05726"
  instance_type = "t2.micro"
  key_name = "inspector-f"
  security_groups = [
    "Amazon ECS-Optimized Amazon Linux 2 AMI-2-0-20200430-AutogenByAWSMP-",
    "Amazon ECS-Optimized Amazon Linux 2 AMI-2-0-20200430-AutogenByAWSMP-2",
    "Amazon ECS-Optimized Amazon Linux 2 AMI-2-0-20200430-AutogenByAWSMP-1"
  ]
  tags {
    name = "${local.repo_name}-${var.docker_tag_version}-${local.init_time}"
  }
}
