#!/bin/bash

docker run -d -p 80:8080 ${repo}/inspector-f

# Connect to DNS
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
yum install -y noip

noip2 -C -u ${dns_user} -p ${dns_login} -U 30 -I docker0
systemctl enable noip.service
systemctl start noip.service
