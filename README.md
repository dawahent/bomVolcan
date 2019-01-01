# bomVolcan

## Technique Issues

1 when set up nginx:

nginx configuration file default locations can be found by 'sudo nginx -h' in command line

put 'include /path/to/here' to one line of http {} of configure file, and comment out others if neccessary

in command line, use 'sudo nginx -p /path/to/static' to specify prefix location for static files, note that this will change global setting for prefix of relative path specification

POST MUST HAVE trailling /

location /dynamic will not work

location /dynamic/ works!

2 github:

example for push:
git push -u ori master

if you don't know how to merge, just delete and pull again

3 database:

Setting up Mongodb: in terminal:

mkdir data

echo 'mongod --bind_ip=127.0.0.1 --dbpath=data --nojournal --rest "$@"' > mongod

chmod a+x mongod

./mongod

FROM https://community.c9.io/t/setting-up-mongodb/1717 You Know how to set up mongod and install it

\*\*bind_ip=127.0.0.1 because only access from local server is allowed

How to terminate mongod (or any processes):

find pid by:

ps ax | grep mongod

from out put find the one that looks mostly like 'mongod --bind_ip=127.0.0.1 --dbpath=data --nojournal --rest "$@"'

sudo kill -2 'pid'

-2 is SIGINT, -9 kill can leave locker issues.

4 python

generally, you would not manual search pymongo by \_id, if you have to, you will need to first:

from bson.objectid import ObjectId

then query by Objectid(\_id) rather than simple \_id strings

##Logic:

1 database:

a. session table

b. account base

c. product base

d. part base
