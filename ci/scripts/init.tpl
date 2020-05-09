#!/bin/bash

# log user_data run
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Start API
docker run -d -p 80:8080 ${repo}/inspector-f

# Connect to DNS
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
yum install -y noip

noip2 -C -u ${dns_user} -p ${dns_login} -U 30 -I docker0
systemctl enable noip.service
systemctl start noip.service
