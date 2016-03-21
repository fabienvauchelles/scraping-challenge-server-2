#!/usr/bin/env bash

for i in {1..97}
do
    url="https://randomuser.me/api/portraits/med/men/$i.jpg"
    wget $url
done
