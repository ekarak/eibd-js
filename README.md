eibd-js
=======

Javascript client library for eibd, the open source KNX daemon. 
Loosely based on ideas borrowed by andreek/node-eibd
( https://github.com/andreek/node-eibd )

This is a 'pure' Javascript client for bcusdk 0.0.5, aiming at node.js compatibility.
It uses the automatic code generation toolkit in BCUSDK to compile a file 'EIBConnection.js'
which can then be used in your JS app to talk to eibd over a TCP/IP socket.

It exposes the full eibd API (not just a subset), albeit at the cost of added complexity.
