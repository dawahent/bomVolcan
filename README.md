# bomVolcan

1 when set up nginx:

nginx configuration file default locations can be found by 'sudo nginx -h' in command line

put 'include /path/to/here' to one line of http {} of configure file, and comment out others if neccessary

in command line, use 'sudo nginx -p /path/to/static' to specify prefix location for static files, note that this will change global setting for prefix of relative path specification
