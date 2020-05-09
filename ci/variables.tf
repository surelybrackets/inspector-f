variable "aws_access_key_id" {
  type = string
}

variable "aws_secret_access_key" {
  type = string
}

variable "docker_tag_version" {
  type = string
}

variable "docker_repo" {
  type = string
}

variable "dns_user" {
  type = string
}

variable "dns_login" {
  type = string
}

variable "aws_region" {
  type = string
  default = "us-east-1"
}

