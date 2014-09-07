/** 
    EIBD client library for Node.JS
    Copyright (C) 2005-2011 Martin Koegler <mkoegler@auto.tuwien.ac.at>
    Copyright (C) 2014 Elias Karakoulakis <elias.karakoulakis@gmail.com
    
#   This program is free software; you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 2 of the License, or
#   (at your option) any later version.
# 
#   In addition to the permissions in the GNU General Public License, 
#   you may link the compiled version of this file into combinations
#   with other programs, & distribute those combinations without any 
#   restriction coming from the use of this file. (The General Public 
#   License restrictions do apply in other respects; for example, they 
#   cover modification of the file, & distribution when not linked into 
#   a combine executable.)
# 
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY || FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
# 
#   You should have received a copy of the GNU General Public License
#   along with this program; if not, write to the Free Software
#   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
# 
*/

/**
 * a bit of warning: 
 * ==> EIBConnection.js is an AUTOMATICALLY GENERATED FILE <==
 * do NOT edit that file directly as it will get overwritten from eibd's
 * Makefile rules. 

 * Edit these files instead:
 * io.inc: IO static code
 * def.def: C macros to generate the eibd API for Javascript
*/

var sys = require('sys'),
	net = require('net'),
    events = require('events');

function EIBBuffer(buf) {
    this.buffer = buf || new Buffer([]);
}

function EIBAddr(value) {
    this.data = value || 0;
}

function EIBInt8(value) {
    this.data = value || 0;
}

function EIBInt16(value) {
    this.data = value || 0;
}

function EIBInt32(value) {
    this.data = value || 0;
}

function EIBConnection() {
	//
    events.EventEmitter.call(this);
	//
    this.data = new Buffer([]);
    this.readlen = 0;
    this.datalen = 0;
    this.socket = null;
    this.errno = 0;
    this.__complete = null;
}
sys.inherits(EIBConnection, events.EventEmitter);

EIBConnection.prototype.EIBSocketLocal = function(cb, path) {
    if (this.socket !== null) {
      this.errno = errno.EUSERS;
	  cb(-1);
      return;
    }
	this.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM);  // TODO: node.js UNIX sockets??
    this.socket.connect(path);
    this.data = new Buffer([]);
    this.readlen = 0;
    cb(0);
};

EIBConnection.prototype.EIBSocketRemote = function(cb, host, port) {
    if (this.socket !== null) {
      this.errno = 'errno.EUSERS';
      cb(-1); return;
    }
	this.connected = false;
	var h = host;
	var p = port || 6720;
	console.log("EIBSocketRemote connecting to %s:%d", h, p);
	this.socket = net.connect({host: h, port: p}, function(msg) {
		console.log("EIBSocketRemote connected "+msg);
		this.connected = true;
    });
	this.socket.on('data', function(data) {
	  console.log('incoming data: calling __EIB_CheckRequest');
		this.__EIB_CheckRequest(function(rc) {
      console.log('CheckRequest callback');
    }, data);
	});
	this.socket.on('end', function() {
	  console.log('client disconnected');
	});
	this.socket.on('error', function(msg) { 
		new Error('EIBSocketRemote.connect error:'+msg);
	});
    this.data = new Buffer([]);
    this.readlen = 0;
    cb(0);
};

EIBConnection.prototype.EIBSocketURL = function(cb, url) {
    if (url.slice(0,6) == 'local:') 
	return(this.EIBSocketLocal(cb, url.slice(6)));
    if (url.slice(0,3) == 'ip:') {
      	var parts = url.split(':');
	    if (parts.length == 2) {
	      	parts.push(6720);
	      	return this.EIBSocketRemote(cb, parts[1], parts[2]);
	    }
	}
    this.errno = 'errno.EINVAL';
    // return(-1);
};

EIBConnection.prototype.EIBComplete = function() {
    if (this.__complete === null) {
      this.errno = 'errno.EINVAL';
      return(-1);
    }
    return this.__complete();
};

EIBConnection.prototype.EIBClose = function() {
    if (this.socket === null) {
      this.errno = 'errno.EINVAL';
      return(-1);
    }
    this.socket.end();
    this.socket = null;
};

EIBConnection.prototype.EIBClose_sync = function() {
    this.EIBReset();
    return this.EIBClose();
};

EIBConnection.prototype.__EIB_SendRequest = function(cb, data) {
    if (this.socket === null) {
      this.errno = 'errno.ECONNRESET';
      cb(-1); return;
	}
    if (data.length < 2 || data.length > 0xffff) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    data = [ (data.length>>8)&0xff, (data.length)&0xff ] + data;
    this.socket.write(data, function(msg) {
		console.log('sent %d bytes', data.length);
	    cb(0);
	}); 
};

EIBConnection.prototype.EIB_Poll_FD = function() {
    if (this.socket === null) {
      this.errno = 'errno.EINVAL';
      return(-1);
    }
    return this.socket;
};

EIBConnection.prototype.EIB_Poll_Complete = function(cb) {
    if (this.__EIB_CheckRequest(false) == -1)  cb(-1);
    if (this.readlen < 2 || (this.readlen >= 2 & this.readlen < this.datalen + 2)) cb(0);
    cb(1);
};

EIBConnection.prototype.__EIB_GetRequest = function(cb) {
    //while (true) {
		this.__EIB_CheckRequest(function(rc) {
			if (rc === -1) callback(-1);
			if ((this.readlen >= 2) && (this.readlen >= this.datalen + 2)) {
	        	this.readlen = 0;
	        	callback(0);
			}
	    }, this.data);
	//}
};

//
EIBConnection.prototype.__EIB_CheckRequest = function(cb, recvd) {
    if (this.socket === null) {
      this.errno = 'errno.ECONNRESET';
      return -1;
    }
    if (this.readlen === 0) {
      this.head = new Buffer([]);
      this.data = new Buffer([]);
    }
	this.readlen += recvd.length;
	if (!this.headreceived) {
//      this.socket.setblocking(block);// no blocking io on node.js
//      var result = this.socket.read(2-this.readlen);
		
		if (this.readlen >= 2) {
			this.headreceived = true;
			this.head.push(recvd.slice(0,2));
    		this.datalen = ((this.head[0] << 8) | this.head[1]);
	    }
	}
	if (this.readlen > 2) {
		this.data.push(recvd.slice(2));
    }
	if (this.readlen === this.datalen + 2) {
		cb();
	}
//
//    if (this.readlen < this.datalen + 2) {
//      this.socket.setblocking(block); // see above
//      var result2 = this.socket.read(this.datalen + 2 -this.readlen);
//      this.data.push(result2);
//      this.readlen += result2.length;
//    }
};

module.exports = function() {
  var e = new EIBConnection();
  return e;
};


module.exports.str2addr = function(str) {
  var m = str.match(/(\d*)\/(\d*)\/(\d*)/);
  var a, b, c = 0;
  var result = -1;
  
  if(m && m.length > 0) {
    a = (m[1] & 0x01f) << 11;
    b = (m[2] & 0x07) << 8;
    c = m[3] & 0xff;
    result = a | b | c;
  }
  
  if(result > -1) {
    return result;
  } else {
    return new Error("Could not parse address");
  }
};

module.exports.addr2str = function(adr, ga) {
  var str = '';
  var a, b, c;

  if(ga === true) {
    a = (adr>>11)&0xf;
    b = (adr>>8)&0x7;
    c = (adr & 0xff);
    str = a+'/'+b+'/'+c;
  } else {
    a = (adr>>12)&0xf;
    b = (adr>>8)&0xf;
    c = adr&0xff;
    str = a+'.'+b+'.'+c;
  }
  return str;
};
