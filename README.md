eibd-js
=======

Node.js client library for eibd, the open source KNX daemon. 
Loosely based on ideas borrowed by andreek/node-eibd
( https://github.com/andreek/node-eibd )
It uses the automatic code generation toolkit in BCUSDK to compile a file 'EIBConnection.js'
which can then be used in your JS app to talk to eibd over a TCP/IP socket.

It exposes the full eibd API (not just a subset), albeit at the cost of added complexity.

----------
*WARNING*: due to node.js continuations-style asynchronous processing, 
porting the automatically generated eibd client code to node.js has proven
to be quite a daunting task, so *nothing is working* (yet)
