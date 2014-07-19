/** 
    EIBD client library for Javascript
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
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
# 
#   You should have received a copy of the GNU General Public License
#   along with this program; if not, write to the Free Software
#   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
# 
*/

//import errno;
//import socket;

function EIBBuffer(buf) {
    this.buffer = buf || [];
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
    this.data = [];
    this.readlen = 0;
    this.datalen = 0;
    this.fd = null;
    this.errno = 0;
    this.__complete = null;
}

EIBConnection.prototype.EIBSocketLocal = function(path) {
    if (this.fd != null) {
      this.errno = errno.EUSERS;
      return -1
    }
    fd = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    fd.connect(path)
    this.data = []
    this.readlen = 0
    this.fd = fd
    return 0
}

EIBConnection.prototype.EIBSocketRemote = function(host, port = 6720) {
    if (this.fd != null) {
      this.errno = errno.EUSERS
      return -1
    fd = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    fd.connect((host, port))
    this.data = []
    this.readlen = 0
    this.fd = fd
    return 0

}

EIBConnection.prototype.EIBSocketURL = function(url) {
    if (url[0:6] == 'local:') {
      return this.EIBSocketLocal(url[6:])
    if (url[0:3] == 'ip:') {
      parts=url.split(':')
      if (len(parts) == 2) {
        parts.append(6720)
      return this.EIBSocketRemote(parts[1], int(parts[2]))
    this.errno = errno.EINVAL
    return -1

}

EIBConnection.prototype.EIBComplete = function() {
    if (this.__complete == null) {
      this.errno = errno.EINVAL
      return -1
    }
    return this.__complete()

}

EIBConnection.prototype.EIBClose = function() {
    if (this.fd == null) {
      this.errno = errno.EINVAL
      return -1
    this.fd.close()
    this.fd = null

}

EIBConnection.prototype.EIBClose_sync = function() {
    this.EIBReset()
    return this.EIBClose()

}

EIBConnection.prototype.__EIB_SendRequest = function(data) {
    if (this.fd == null) {
      this.errno = errno.ECONNRESET
      return -1
    if (len(data) < 2 or len(data) > 0xffff) {
      this.errno = errno.EINVAL
      return -1
    data = [ (len(data)>>8)&0xff, (len(data))&0xff ] + data;
    result = '';
    for (i in data)       result += chr(i);
    this.fd.send(result);
    return 0;

}

EIBConnection.prototype.EIB_Poll_FD = function() {
    if (this.fd == null) {
      this.errno = errno.EINVAL
      return -1
    }
    return this.fd;
}

EIBConnection.prototype.EIB_Poll_Complete = function() {
    if (this.__EIB_CheckRequest(False) == -1)  return -1;
    if (this.readlen < 2 or (this.readlen >= 2 & this.readlen < this.datalen + 2)) return 0;
    return 1;
}

EIBConnection.prototype.__EIB_GetRequest = function() {
    while (true) {
      if (this.__EIB_CheckRequest(true) == -1) {
        return -1
	  }
      if ((this.readlen >= 2) && (this.readlen >= this.datalen + 2)) {
        this.readlen = 0;
        return 0;
      }
    }
}

EIBConnection.prototype.__EIB_CheckRequest = function(block) {
    if (this.fd == null) {
      this.errno = errno.ECONNRESET
      return -1
    }
    if (this.readlen == 0) {
      this.head = []
      this.data = []
    }
    if (this.readlen < 2) {
      this.fd.setblocking(block)
      result = this.fd.recv (2-this.readlen)
      for (a in result)         this.head.append(ord(a))
      this.readlen += len(result)
    }
    if (this.readlen < 2) {
      return 0;
    }-
    this.datalen = (this.head[0] << 8) | this.head[1]);
    if (this.readlen < this.datalen + 2) {
      this.fd.setblocking(block);
      result = this.fd.recv (this.datalen + 2 -this.readlen)
      for (a in result)         this.data.append(ord(a))
      this.readlen += len(result);
    }
    return 0;
}
EIBConnection.prototype.__EIBGetAPDU_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 37 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIBGetAPDU_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = bu;
    this.__complete = this.__EIBGetAPDU_Complete;
    return ;
;

EIBConnection.prototype.EIBGetAPDU = function( buf) {
    if(this.EIBGetAPDU_async (buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBGetAPDU_Src_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 37 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    if(this.ptr5 != None;
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]);
    this.buf.buffer = this.data[4:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIBGetAPDU_Src_async = function( buf, src) {
    ibuf = [0] * 2;
    this.buf = bu;
    this.ptr5 = sr;
    this.__complete = this.__EIBGetAPDU_Src_Complete;
    return ;
;

EIBConnection.prototype.EIBGetAPDU_Src = function( buf, src) {
    if(this.EIBGetAPDU_Src_async (buf, src) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBGetBusmonitorPacket_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 20 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIBGetBusmonitorPacket_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = bu;
    this.__complete = this.__EIBGetBusmonitorPacket_Complete;
    return ;
;

EIBConnection.prototype.EIBGetBusmonitorPacket = function( buf) {
    if(this.EIBGetBusmonitorPacket_async (buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBGetGroup_Src_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 39 or len(this.data) < 6;
      this.errno = errno.ECONNRESE;
      return (-1);
    if(this.ptr5 != None;
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]);
    if(this.ptr6 != None;
      this.ptr6.data = (((this.data[4])<<8)|(this.data[4+1]);
    this.buf.buffer = this.data[6:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIBGetGroup_Src_async = function( buf, src, dest) {
    ibuf = [0] * 2;
    this.buf = bu;
    this.ptr5 = sr;
    this.ptr6 = des;
    this.__complete = this.__EIBGetGroup_Src_Complete;
    return ;
;

EIBConnection.prototype.EIBGetGroup_Src = function( buf, src, dest) {
    if(this.EIBGetGroup_Src_async (buf, src, dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBGetTPDU_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 37 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    if(this.ptr5 != None;
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]);
    this.buf.buffer = this.data[4:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIBGetTPDU_async = function( buf, src) {
    ibuf = [0] * 2;
    this.buf = bu;
    this.ptr5 = sr;
    this.__complete = this.__EIBGetTPDU_Complete;
    return ;
;

EIBConnection.prototype.EIBGetTPDU = function( buf, src) {
    if(this.EIBGetTPDU_async (buf, src) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_Clear_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 114 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_Cache_Clear_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Clear_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_Clear = function() {
    if(this.EIB_Cache_Clear_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_Disable_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 113 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_Cache_Disable_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Disable_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_Disable = function() {
    if(this.EIB_Cache_Disable_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_Enable_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 112 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_Cache_Enable_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Enable_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_Enable = function() {
    if(this.EIB_Cache_Enable_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_Read_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 117 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    if((((this.data[4])<<8)|(this.data[4+1])) == 0;
      this.errno = 'ENODEV';
      return (-1);
    if len(this.data) <= 6;
      this.errno = 'ENOENT';
      return (-1);
    if(this.ptr5 != None;
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]);
    this.buf.buffer = this.data[6:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_Cache_Read_async = function( dst, src, buf) {
    ibuf = [0] * 4;
    this.buf = bu;
    this.ptr5 = sr;
    ibuf[2] = ((dst>>8)&0xff;
    ibuf[3] = ((dst)&0xff;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Read_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_Read = function( dst, src, buf) {
    if(this.EIB_Cache_Read_async (dst, src, buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_Read_Sync_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 116 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    if((((this.data[4])<<8)|(this.data[4+1])) == 0;
      this.errno = 'ENODEV';
      return (-1);
    if len(this.data) <= 6;
      this.errno = 'ENOENT';
      return (-1);
    if(this.ptr5 != None;
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]);
    this.buf.buffer = this.data[6:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_Cache_Read_Sync_async = function( dst, src, buf, age) {
    ibuf = [0] * 6;
    this.buf = bu;
    this.ptr5 = sr;
    ibuf[2] = ((dst>>8)&0xff;
    ibuf[3] = ((dst)&0xff;
    ibuf[4] = ((age>>8)&0xff;
    ibuf[5] = ((age)&0xff;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Read_Sync_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_Read_Sync = function( dst, src, buf, age) {
    if(this.EIB_Cache_Read_Sync_async (dst, src, buf, age) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_Remove_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 115 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_Cache_Remove_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Remove_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_Remove = function( dest) {
    if(this.EIB_Cache_Remove_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_Cache_LastUpdates_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 118 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    if(this.ptr4 != None;
      this.ptr4.data = (((this.data[2])<<8)|(this.data[2+1]);
    this.buf.buffer = this.data[4:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_Cache_LastUpdates_async = function( start, timeout, buf, ende) {
    ibuf = [0] * 5;
    this.buf = bu;
    this.ptr4 = end;
    ibuf[2] = ((start>>8)&0xff;
    ibuf[3] = ((start)&0xff;
    ibuf[4] = ((timeout)&0xff;
    ibuf[0] = ;
    ibuf[1] = 11;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_LastUpdates_Complete;
    return ;
;

EIBConnection.prototype.EIB_Cache_LastUpdates = function( start, timeout, buf, ende) {
    if(this.EIB_Cache_LastUpdates_async (start, timeout, buf, ende) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_LoadImage_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 99 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]);
;

EIBConnection.prototype.EIB_LoadImage_async = function( image) {
    ibuf = [0] * 2;
    if len(image) < 0;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(image;
    ibuf += imag;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_LoadImage_Complete;
    return ;
;

EIBConnection.prototype.EIB_LoadImage = function( image) {
    if(this.EIB_LoadImage_async (image) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Authorize_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 87 or len(this.data) < 3;
      this.errno = errno.ECONNRESE;
      return (-1);
    return this.data[2;
;

EIBConnection.prototype.EIB_MC_Authorize_async = function( key) {
    ibuf = [0] * 6;
    if len(key) != 4;
      this.errno = errno.EINVA;
      return (-1);
    ibuf[2:6] = ke;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Authorize_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Authorize = function( key) {
    if(this.EIB_MC_Authorize_async (key) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Connect_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 80 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_Connect_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Connect_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Connect = function( dest) {
    if(this.EIB_MC_Connect_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Individual_Open_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 73 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_Individual_Open_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[0] = ;
    ibuf[1] = 7;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Individual_Open_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Individual_Open = function( dest) {
    if(this.EIB_MC_Individual_Open_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_GetMaskVersion_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 89 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]);
;

EIBConnection.prototype.EIB_MC_GetMaskVersion_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_GetMaskVersion_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_GetMaskVersion = function() {
    if(this.EIB_MC_GetMaskVersion_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_GetPEIType_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 85 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]);
;

EIBConnection.prototype.EIB_MC_GetPEIType_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_GetPEIType_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_GetPEIType = function() {
    if(this.EIB_MC_GetPEIType_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Progmode_Off_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_Off_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((0)&0xff;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_Off_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_Off = function() {
    if(this.EIB_MC_Progmode_Off_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Progmode_On_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_On_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((1)&0xff;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_On_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_On = function() {
    if(this.EIB_MC_Progmode_On_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Progmode_Status_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 or len(this.data) < 3;
      this.errno = errno.ECONNRESE;
      return (-1);
    return this.data[2;
;

EIBConnection.prototype.EIB_MC_Progmode_Status_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((3)&0xff;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_Status_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_Status = function() {
    if(this.EIB_MC_Progmode_Status_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Progmode_Toggle_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_Toggle_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((2)&0xff;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_Toggle_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Progmode_Toggle = function() {
    if(this.EIB_MC_Progmode_Toggle_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_PropertyDesc_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 97 or len(this.data) < 6;
      this.errno = errno.ECONNRESE;
      return (-1);
    if(this.ptr2 != None;
      this.ptr2.data = this.data[2;
    if(this.ptr4 != None;
      this.ptr4.data = (((this.data[3])<<8)|(this.data[3+1]);
    if(this.ptr3 != None;
      this.ptr3.data = this.data[5;
    return ;
;

EIBConnection.prototype.EIB_MC_PropertyDesc_async = function( obj, propertyno, proptype, max_nr_of_elem, access) {
    ibuf = [0] * 4;
    this.ptr2 = proptyp;
    this.ptr4 = max_nr_of_ele;
    this.ptr3 = acces;
    ibuf[2] = ((obj)&0xff;
    ibuf[3] = ((propertyno)&0xff;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyDesc_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_PropertyDesc = function( obj, propertyno, proptype, max_nr_of_elem, access) {
    if(this.EIB_MC_PropertyDesc_async (obj, propertyno, proptype, max_nr_of_elem, access) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_PropertyRead_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 83 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_MC_PropertyRead_async = function( obj, propertyno, start, nr_of_elem, buf) {
    ibuf = [0] * 7;
    this.buf = bu;
    ibuf[2] = ((obj)&0xff;
    ibuf[3] = ((propertyno)&0xff;
    ibuf[4] = ((start>>8)&0xff;
    ibuf[5] = ((start)&0xff;
    ibuf[6] = ((nr_of_elem)&0xff;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyRead_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_PropertyRead = function( obj, propertyno, start, nr_of_elem, buf) {
    if(this.EIB_MC_PropertyRead_async (obj, propertyno, start, nr_of_elem, buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_PropertyScan_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 98 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_MC_PropertyScan_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = bu;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyScan_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_PropertyScan = function( buf) {
    if(this.EIB_MC_PropertyScan_async (buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_PropertyWrite_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 84 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_MC_PropertyWrite_async = function( obj, propertyno, start, nr_of_elem, buf, res) {
    ibuf = [0] * 7;
    ibuf[2] = ((obj)&0xff;
    ibuf[3] = ((propertyno)&0xff;
    ibuf[4] = ((start>>8)&0xff;
    ibuf[5] = ((start)&0xff;
    ibuf[6] = ((nr_of_elem)&0xff;
    if len(buf) < 0;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(buf;
    ibuf += bu;
    this.buf = re;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyWrite_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_PropertyWrite = function( obj, propertyno, start, nr_of_elem, buf, res) {
    if(this.EIB_MC_PropertyWrite_async (obj, propertyno, start, nr_of_elem, buf, res) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_ReadADC_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 86 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    if(this.ptr1 != None;
      this.ptr1.data = (((this.data[2])<<8)|(this.data[2+1]);
    return ;
;

EIBConnection.prototype.EIB_MC_ReadADC_async = function( channel, count, val) {
    ibuf = [0] * 4;
    this.ptr1 = va;
    ibuf[2] = ((channel)&0xff;
    ibuf[3] = ((count)&0xff;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_ReadADC_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_ReadADC = function( channel, count, val) {
    if(this.EIB_MC_ReadADC_async (channel, count, val) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Read_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 81 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_MC_Read_async = function( addr, buf_len, buf) {
    ibuf = [0] * 6;
    this.buf = bu;
    ibuf[2] = ((addr>>8)&0xff;
    ibuf[3] = ((addr)&0xff;
    ibuf[4] = ((buf_len>>8)&0xff;
    ibuf[5] = ((buf_len)&0xff;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Read_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Read = function( addr, buf_len, buf) {
    if(this.EIB_MC_Read_async (addr, buf_len, buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Restart_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 90 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_Restart_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Restart_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Restart = function() {
    if(this.EIB_MC_Restart_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_SetKey_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 2) {
      this.errno = 'EPERM';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 88 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_MC_SetKey_async = function( key, level) {
    ibuf = [0] * 7;
    if len(key) != 4;
      this.errno = errno.EINVA;
      return (-1);
    ibuf[2:6] = ke;
    ibuf[6] = ((level)&0xff;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_SetKey_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_SetKey = function( key, level) {
    if(this.EIB_MC_SetKey_async (key, level) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Write_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 68) {
      this.errno = 'EIO';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 82 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return this.sendle;
;

EIBConnection.prototype.EIB_MC_Write_async = function( addr, buf) {
    ibuf = [0] * 6;
    ibuf[2] = ((addr>>8)&0xff;
    ibuf[3] = ((addr)&0xff;
    ibuf[4] = (((len(buf))>>8)&0xff;
    ibuf[5] = (((len(buf)))&0xff;
    if len(buf) < 0;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(buf;
    ibuf += bu;
    ibuf[0] = ;
    ibuf[1] = 8;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Write_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Write = function( addr, buf) {
    if(this.EIB_MC_Write_async (addr, buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_MC_Write_Plain_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 91 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return this.sendle;
;

EIBConnection.prototype.EIB_MC_Write_Plain_async = function( addr, buf) {
    ibuf = [0] * 6;
    ibuf[2] = ((addr>>8)&0xff;
    ibuf[3] = ((addr)&0xff;
    ibuf[4] = (((len(buf))>>8)&0xff;
    ibuf[5] = (((len(buf)))&0xff;
    if len(buf) < 0;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(buf;
    ibuf += bu;
    ibuf[0] = ;
    ibuf[1] = 9;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Write_Plain_Complete;
    return ;
;

EIBConnection.prototype.EIB_MC_Write_Plain = function( addr, buf) {
    if(this.EIB_MC_Write_Plain_async (addr, buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_GetMaskVersion_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 49 or len(this.data) < 4;
      this.errno = errno.ECONNRESE;
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]);
;

EIBConnection.prototype.EIB_M_GetMaskVersion_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[0] = ;
    ibuf[1] = 4;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_GetMaskVersion_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_GetMaskVersion = function( dest) {
    if(this.EIB_M_GetMaskVersion_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_Progmode_Off_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_Off_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[4] = ((0)&0xff;
    ibuf[0] = ;
    ibuf[1] = 4;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_Progmode_Off_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_Off = function( dest) {
    if(this.EIB_M_Progmode_Off_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_Progmode_On_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_On_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[4] = ((1)&0xff;
    ibuf[0] = ;
    ibuf[1] = 4;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_Progmode_On_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_On = function( dest) {
    if(this.EIB_M_Progmode_On_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_Progmode_Status_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 or len(this.data) < 3;
      this.errno = errno.ECONNRESE;
      return (-1);
    return this.data[2;
;

EIBConnection.prototype.EIB_M_Progmode_Status_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[4] = ((3)&0xff;
    ibuf[0] = ;
    ibuf[1] = 4;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_Progmode_Status_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_Status = function( dest) {
    if(this.EIB_M_Progmode_Status_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_Progmode_Toggle_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_Toggle_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[4] = ((2)&0xff;
    ibuf[0] = ;
    ibuf[1] = 4;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_Progmode_Toggle_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_Progmode_Toggle = function( dest) {
    if(this.EIB_M_Progmode_Toggle_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_ReadIndividualAddresses_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 50 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    this.buf.buffer = this.data[2:;
    return len(this.buf.buffer;
;

EIBConnection.prototype.EIB_M_ReadIndividualAddresses_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = bu;
    ibuf[0] = ;
    ibuf[1] = 5;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_ReadIndividualAddresses_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_ReadIndividualAddresses = function( buf) {
    if(this.EIB_M_ReadIndividualAddresses_async (buf) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIB_M_WriteIndividualAddress_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 65) {
      this.errno = 'EADDRINUSE';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 67) {
      this.errno = 'ETIMEDOUT';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 66) {
      this.errno = 'EADDRNOTAVAIL';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 64 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIB_M_WriteIndividualAddress_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[0] = ;
    ibuf[1] = 6;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_WriteIndividualAddress_Complete;
    return ;
;

EIBConnection.prototype.EIB_M_WriteIndividualAddress = function( dest) {
    if(this.EIB_M_WriteIndividualAddress_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenBusmonitor_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 16 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenBusmonitor_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 1;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenBusmonitor_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenBusmonitor = function() {
    if(this.EIBOpenBusmonitor_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenBusmonitorText_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 17 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenBusmonitorText_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 1;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenBusmonitorText_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenBusmonitorText = function() {
    if(this.EIBOpenBusmonitorText_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpen_GroupSocket_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 38 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpen_GroupSocket_async = function( write_only) {
    ibuf = [0] * 5;
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpen_GroupSocket_Complete;
    return ;
;

EIBConnection.prototype.EIBOpen_GroupSocket = function( write_only) {
    if(this.EIBOpen_GroupSocket_async (write_only) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenT_Broadcast_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 35 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenT_Broadcast_async = function( write_only) {
    ibuf = [0] * 5;
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);
    this.__complete = this.__EIBOpenT_Broadcast_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenT_Broadcast = function( write_only) {
    if(this.EIBOpenT_Broadcast_async (write_only) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenT_Connection_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 32 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenT_Connection_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_Connection_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenT_Connection = function( dest) {
    if(this.EIBOpenT_Connection_async (dest) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenT_Group_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 34 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenT_Group_async = function( dest, write_only) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_Group_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenT_Group = function( dest, write_only) {
    if(this.EIBOpenT_Group_async (dest, write_only) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenT_Individual_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 33 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenT_Individual_async = function( dest, write_only) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_Individual_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenT_Individual = function( dest, write_only) {
    if(this.EIBOpenT_Individual_async (dest, write_only) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenT_TPDU_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 36 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenT_TPDU_async = function( src) {
    ibuf = [0] * 5;
    ibuf[2] = ((src>>8)&0xff;
    ibuf[3] = ((src)&0xff;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_TPDU_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenT_TPDU = function( src) {
    if(this.EIBOpenT_TPDU_async (src) == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenVBusmonitor_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 18 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenVBusmonitor_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 1;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenVBusmonitor_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenVBusmonitor = function() {
    if(this.EIBOpenVBusmonitor_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBOpenVBusmonitorText_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1;
    ;
    if((((this.data[0])<<8)|(this.data[0+1])) != 19 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBOpenVBusmonitorText_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = 1;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenVBusmonitorText_Complete;
    return ;
;

EIBConnection.prototype.EIBOpenVBusmonitorText = function() {
    if(this.EIBOpenVBusmonitorText_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.__EIBReset_Complete = function() {
    this.__complete = None;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 4 or len(this.data) < 2;
      this.errno = errno.ECONNRESE;
      return (-1);
    return ;
;

EIBConnection.prototype.EIBReset_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = ;
    ibuf[1] = ;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBReset_Complete;
    return ;
;

EIBConnection.prototype.EIBReset = function() {
    if(this.EIBReset_async () == -1) {
      return (-1);
    return this.EIBComplete (;

;

EIBConnection.prototype.EIBSendAPDU = function( data) {
    ibuf = [0] * 2;
    if len(data) < 2;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(data;
    ibuf += dat;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    return this.sendle;
;

EIBConnection.prototype.EIBSendGroup = function( dest, data) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    if len(data) < 2;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(data;
    ibuf += dat;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    return this.sendle;
;

EIBConnection.prototype.EIBSendTPDU = function( dest, data) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff;
    ibuf[3] = ((dest)&0xff;
    if len(data) < 2;
      this.errno = errno.EINVA;
      return (-1);
    this.sendlen = len(data;
    ibuf += dat;
    ibuf[0] = ;
    ibuf[1] = 3;
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    return this.sendle;


IMG_UNKNOWN_ERROR = 0
IMG_UNRECOG_FORMAT = 1
IMG_INVALID_FORMAT = 2
IMG_NO_BCUTYPE = 3
IMG_UNKNOWN_BCUTYPE = 4
IMG_NO_CODE = 5
IMG_NO_SIZE = 6
IMG_LODATA_OVERFLOW = 7
IMG_HIDATA_OVERFLOW = 8
IMG_TEXT_OVERFLOW = 9
IMG_NO_ADDRESS = 10
IMG_WRONG_SIZE = 11
IMG_IMAGE_LOADABLE = 12
IMG_NO_DEVICE_CONNECTION = 13
IMG_MASK_READ_FAILED = 14
IMG_WRONG_MASK_VERSION = 15
IMG_CLEAR_ERROR = 16
IMG_RESET_ADDR_TAB = 17
IMG_LOAD_HEADER = 18
IMG_LOAD_MAIN = 19
IMG_ZERO_RAM = 20
IMG_FINALIZE_ADDR_TAB = 21
IMG_PREPARE_RUN = 22
IMG_RESTART = 23
IMG_LOADED = 24
IMG_NO_START = 25
IMG_WRONG_ADDRTAB = 26
IMG_ADDRTAB_OVERFLOW = 27
IMG_OVERLAP_ASSOCTAB = 28
IMG_OVERLAP_TEXT = 29
IMG_NEGATIV_TEXT_SIZE = 30
IMG_OVERLAP_PARAM = 31
IMG_OVERLAP_EEPROM = 32
IMG_OBJTAB_OVERFLOW = 33
IMG_WRONG_LOADCTL = 34
IMG_UNLOAD_ADDR = 35
IMG_UNLOAD_ASSOC = 36
IMG_UNLOAD_PROG = 37
IMG_LOAD_ADDR = 38
IMG_WRITE_ADDR = 39
IMG_SET_ADDR = 40
IMG_FINISH_ADDR = 41
IMG_LOAD_ASSOC = 42
IMG_WRITE_ASSOC = 43
IMG_SET_ASSOC = 44
IMG_FINISH_ASSOC = 45
IMG_LOAD_PROG = 46
IMG_ALLOC_LORAM = 47
IMG_ALLOC_HIRAM = 48
IMG_ALLOC_INIT = 49
IMG_ALLOC_RO = 50
IMG_ALLOC_EEPROM = 51
IMG_ALLOC_PARAM = 52
IMG_SET_PROG = 53
IMG_SET_TASK_PTR = 54
IMG_SET_OBJ = 55
IMG_SET_TASK2 = 56
IMG_FINISH_PROC = 57
IMG_WRONG_CHECKLIM = 58
IMG_INVALID_KEY = 59
IMG_AUTHORIZATION_FAILED = 60
IMG_KEY_WRITE = 61
