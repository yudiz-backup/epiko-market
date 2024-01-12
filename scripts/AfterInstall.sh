#!/bin/sh
cd /home/ubuntu/epiko-market
sudo find . -type d -exec chmod 755 {} \;
sudo find . -type f -exec chmod 644 {} \;
npm install
npm run export
sudo chown -R ubuntu:ubuntu .
service apache2 reload
