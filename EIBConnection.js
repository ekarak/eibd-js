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
#   MERCHANTABILITY || FITNESS FOR A PARTICULAR PURPOSE.  See the
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
    if (url.slice(0,6) == 'local:') {
      return this.EIBSocketLocal(url.slice(6))
    if (url.slice(0,3) == 'ip:') {
      parts=url.split(':')
      if (parts.length == 2) {
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
    if (data.length < 2 || data.length > 0xffff) {
      this.errno = errno.EINVAL
      return -1
    data = [ (data.length>>8)&0xff, (data.length)&0xff ] + data;
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
    if (this.readlen < 2 || (this.readlen >= 2 & this.readlen < this.datalen + 2)) return 0;
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
      this.errno = errno.ECONNRESET;
      return -1;
    }
    if (this.readlen == 0) {
      this.head = [];
      this.data = [];
    }
    if (this.readlen < 2) {
      this.fd.setblocking(block);
      result = this.fd.recv (2-this.readlen);
      for (a in result)         this.head.append(ord(a))
      this.readlen += result.length
    }
    if (this.readlen < 2) {
      return 0;
    }
    this.datalen = ((this.head[0] << 8) | this.head[1]);
    if (this.readlen < this.datalen + 2) {
      this.fd.setblocking(block);
      result = this.fd.recv (this.datalen + 2 -this.readlen);
      for (a in result)         this.data.append(ord(a));
      this.readlen += result.length;
    }
    return 0;
}
EIBConnection.prototype.__EIBGetAPDU_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 37 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    this.buf.buffer = this.data.slice(2)
    return this.buf.buffer.length
}

EIBConnection.prototype.EIBGetAPDU_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = buf;
    this.__complete = this.__EIBGetAPDU_Complete;
    return 0
}

EIBConnection.prototype.EIBGetAPDU = function( buf) {
    if(this.EIBGetAPDU_async (buf) == -1) {
      return (-1);
    }
    return this.EIBComplete();
}

EIBConnection.prototype.__EIBGetAPDU_Src_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 37 || this.data.length < 4 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    if(this.ptr5 != null) {
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]))
    }
    this.buf.buffer = this.data.slice(4);
    return this.buf.buffer.length
}

EIBConnection.prototype.EIBGetAPDU_Src_async = function( buf, src) {
    ibuf = [0] * 2;
    this.buf = buf;
    this.ptr5 = src;
    this.__complete = this.__EIBGetAPDU_Src_Complete();
    return 0;
}

EIBConnection.prototype.EIBGetAPDU_Src = function( buf, src) {
    if(this.EIBGetAPDU_Src_async (buf, src) == -1) {
      return (-1);
    }
    return this.EIBComplete();
}

EIBConnection.prototype.__EIBGetBusmonitorPacket_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if ((((this.data[0])<<8)|(this.data[0+1])) != 20 || this.data.length < 2) {
      this.errno = errno.ECONNRESET;
      return (-1);
    }
    this.buf.buffer = this.data.slice(2);
    return this.buf.buffer.length;
}

EIBConnection.prototype.EIBGetBusmonitorPacket_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = buf
    this.__complete = this.__EIBGetBusmonitorPacket_Complete;
    return 0


}

EIBConnection.prototype.EIBGetBusmonitorPacket = function( buf) {
    if(this.EIBGetBusmonitorPacket_async (buf) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBGetGroup_Src_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 39 || this.data.length < 6) {
      this.errno = errno.ECONNRESET
      return (-1);
    if(this.ptr5 != null) {
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]))
    if(this.ptr6 != null) {
      this.ptr6.data = (((this.data[4])<<8)|(this.data[4+1]))
    this.buf.buffer = this.data.slice(6)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIBGetGroup_Src_async = function( buf, src, dest) {
    ibuf = [0] * 2;
    this.buf = buf
    this.ptr5 = src
    this.ptr6 = dest
    this.__complete = this.__EIBGetGroup_Src_Complete;
    return 0


}

EIBConnection.prototype.EIBGetGroup_Src = function( buf, src, dest) {
    if(this.EIBGetGroup_Src_async (buf, src, dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBGetTPDU_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 37 || this.data.length < 4) {
      this.errno = errno.ECONNRESET
      return (-1);
    if(this.ptr5 != null) {
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]))
    this.buf.buffer = this.data.slice(4)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIBGetTPDU_async = function( buf, src) {
    ibuf = [0] * 2;
    this.buf = buf
    this.ptr5 = src
    this.__complete = this.__EIBGetTPDU_Complete;
    return 0


}

EIBConnection.prototype.EIBGetTPDU = function( buf, src) {
    if(this.EIBGetTPDU_async (buf, src) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_Clear_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 114 || this.data.length < 2) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_Cache_Clear_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 114
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Clear_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_Clear = function() {
    if(this.EIB_Cache_Clear_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_Disable_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 113 || this.data.length < 2) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_Cache_Disable_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 113
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Disable_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_Disable = function() {
    if(this.EIB_Cache_Disable_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_Enable_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 112 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_Cache_Enable_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 112
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Enable_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_Enable = function() {
    if(this.EIB_Cache_Enable_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_Read_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 117 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    if((((this.data[4])<<8)|(this.data[4+1])) == 0) {
      this.errno = 'ENODEV';
      return (-1);
    if (this.data.length <= 6) {
      this.errno = 'ENOENT';
      return (-1);
    if(this.ptr5 != null) {
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]))
    this.buf.buffer = this.data.slice(6)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_Cache_Read_async = function( dst, src, buf) {
    ibuf = [0] * 4;
    this.buf = buf
    this.ptr5 = src
    ibuf[2] = ((dst>>8)&0xff)
    ibuf[3] = ((dst)&0xff)
    ibuf[0] = 0
    ibuf[1] = 117
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Read_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_Read = function( dst, src, buf) {
    if(this.EIB_Cache_Read_async (dst, src, buf) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_Read_Sync_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 116 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    if((((this.data[4])<<8)|(this.data[4+1])) == 0) {
      this.errno = 'ENODEV';
      return (-1);
    if (this.data.length <= 6) {
      this.errno = 'ENOENT';
      return (-1);
    if(this.ptr5 != null) {
      this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]))
    this.buf.buffer = this.data.slice(6)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_Cache_Read_Sync_async = function( dst, src, buf, age) {
    ibuf = [0] * 6;
    this.buf = buf
    this.ptr5 = src
    ibuf[2] = ((dst>>8)&0xff)
    ibuf[3] = ((dst)&0xff)
    ibuf[4] = ((age>>8)&0xff)
    ibuf[5] = ((age)&0xff)
    ibuf[0] = 0
    ibuf[1] = 116
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Read_Sync_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_Read_Sync = function( dst, src, buf, age) {
    if(this.EIB_Cache_Read_Sync_async (dst, src, buf, age) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_Remove_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 115 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_Cache_Remove_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[0] = 0
    ibuf[1] = 115
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_Remove_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_Remove = function( dest) {
    if(this.EIB_Cache_Remove_async (dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_Cache_LastUpdates_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 118 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    if(this.ptr4 != null) {
      this.ptr4.data = (((this.data[2])<<8)|(this.data[2+1]))
    this.buf.buffer = this.data.slice(4)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_Cache_LastUpdates_async = function( start, timeout, buf, ende) {
    ibuf = [0] * 5;
    this.buf = buf
    this.ptr4 = ende
    ibuf[2] = ((start>>8)&0xff)
    ibuf[3] = ((start)&0xff)
    ibuf[4] = ((timeout)&0xff)
    ibuf[0] = 0
    ibuf[1] = 118
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_Cache_LastUpdates_Complete;
    return 0


}

EIBConnection.prototype.EIB_Cache_LastUpdates = function( start, timeout, buf, ende) {
    if(this.EIB_Cache_LastUpdates_async (start, timeout, buf, ende) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_LoadImage_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 99 || this.data.length < 4 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]))


}

EIBConnection.prototype.EIB_LoadImage_async = function( image) {
    ibuf = [0] * 2;
    if (image.length < 0) {
      this.errno = errno.EINVAL
      return (-1);
    }
    this.sendlen = image.length;
    ibuf += image;
    ibuf[0] = 0;
    ibuf[1] = 99;
    if(this.__EIB_SendRequest(ibuf) == -1)  return (-1);
    this.__complete = this.__EIB_LoadImage_Complete();
    return 0;
}

EIBConnection.prototype.EIB_LoadImage = function( image) {
    if(this.EIB_LoadImage_async (image) == -1)  return (-1);
    return this.EIBComplete ();
}

EIBConnection.prototype.__EIB_MC_Authorize_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 87 || this.data.length < 3 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return this.data[2];
}

EIBConnection.prototype.EIB_MC_Authorize_async = function( key) {
    ibuf = [0] * 6;
    if (key.length != 4) {
      this.errno = errno.EINVAL
      return (-1);
    for (i = 2; i < 6; i++) ibuf[i] = key[i-2];
    ibuf[0] = 0;
    ibuf[1] = 87;
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);
    this.__complete = this.__EIB_MC_Authorize_Complete;
    return 0;
}

EIBConnection.prototype.EIB_MC_Authorize = function( key) {
    if(this.EIB_MC_Authorize_async (key) == -1) return (-1);
    return this.EIBComplete();
}

EIBConnection.prototype.__EIB_MC_Connect_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 80 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_Connect_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 80
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Connect_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Connect = function( dest) {
    if(this.EIB_MC_Connect_async (dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Individual_Open_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 73 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_Individual_Open_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[0] = 0
    ibuf[1] = 73
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Individual_Open_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Individual_Open = function( dest) {
    if(this.EIB_MC_Individual_Open_async (dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_GetMaskVersion_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 89 || this.data.length < 4 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]))


}

EIBConnection.prototype.EIB_MC_GetMaskVersion_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 89
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_GetMaskVersion_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_GetMaskVersion = function() {
    if(this.EIB_MC_GetMaskVersion_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_GetPEIType_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 85 || this.data.length < 4 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return (((this.data[2])<<8)|(this.data[2+1]))


}

EIBConnection.prototype.EIB_MC_GetPEIType_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 85
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_GetPEIType_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_GetPEIType = function() {
    if(this.EIB_MC_GetPEIType_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Progmode_Off_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_Off_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((0)&0xff)
    ibuf[0] = 0
    ibuf[1] = 96
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_Off_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_Off = function() {
    if(this.EIB_MC_Progmode_Off_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Progmode_On_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_On_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((1)&0xff)
    ibuf[0] = 0
    ibuf[1] = 96
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_On_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_On = function() {
    if(this.EIB_MC_Progmode_On_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Progmode_Status_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 || this.data.length < 3 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return this.data[2]


}

EIBConnection.prototype.EIB_MC_Progmode_Status_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((3)&0xff)
    ibuf[0] = 0
    ibuf[1] = 96
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_Status_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_Status = function() {
    if(this.EIB_MC_Progmode_Status_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Progmode_Toggle_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 96 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_Toggle_async = function() {
    ibuf = [0] * 3;
    ibuf[2] = ((2)&0xff)
    ibuf[0] = 0
    ibuf[1] = 96
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Progmode_Toggle_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Progmode_Toggle = function() {
    if(this.EIB_MC_Progmode_Toggle_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_PropertyDesc_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 97 || this.data.length < 6 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    if(this.ptr2 != null) {
      this.ptr2.data = this.data[2]
    if(this.ptr4 != null) {
      this.ptr4.data = (((this.data[3])<<8)|(this.data[3+1]))
    if(this.ptr3 != null) {
      this.ptr3.data = this.data[5]
    return 0


}

EIBConnection.prototype.EIB_MC_PropertyDesc_async = function( obj, propertyno, proptype, max_nr_of_elem, access) {
    ibuf = [0] * 4;
    this.ptr2 = proptype
    this.ptr4 = max_nr_of_elem
    this.ptr3 = access
    ibuf[2] = ((obj)&0xff)
    ibuf[3] = ((propertyno)&0xff)
    ibuf[0] = 0
    ibuf[1] = 97
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyDesc_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_PropertyDesc = function( obj, propertyno, proptype, max_nr_of_elem, access) {
    if(this.EIB_MC_PropertyDesc_async (obj, propertyno, proptype, max_nr_of_elem, access) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_PropertyRead_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 83 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    this.buf.buffer = this.data.slice(2)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_MC_PropertyRead_async = function( obj, propertyno, start, nr_of_elem, buf) {
    ibuf = [0] * 7;
    this.buf = buf
    ibuf[2] = ((obj)&0xff)
    ibuf[3] = ((propertyno)&0xff)
    ibuf[4] = ((start>>8)&0xff)
    ibuf[5] = ((start)&0xff)
    ibuf[6] = ((nr_of_elem)&0xff)
    ibuf[0] = 0
    ibuf[1] = 83
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyRead_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_PropertyRead = function( obj, propertyno, start, nr_of_elem, buf) {
    if(this.EIB_MC_PropertyRead_async (obj, propertyno, start, nr_of_elem, buf) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_PropertyScan_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 98 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    this.buf.buffer = this.data.slice(2)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_MC_PropertyScan_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = buf
    ibuf[0] = 0
    ibuf[1] = 98
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_PropertyScan_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_PropertyScan = function( buf) {
    if(this.EIB_MC_PropertyScan_async (buf) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_PropertyWrite_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 84 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    this.buf.buffer = this.data.slice(2)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_MC_PropertyWrite_async = function( obj, propertyno, start, nr_of_elem, buf, res) {
    ibuf = [0] * 7;
    ibuf[2] = ((obj)&0xff)
    ibuf[3] = ((propertyno)&0xff)
    ibuf[4] = ((start>>8)&0xff)
    ibuf[5] = ((start)&0xff)
    ibuf[6] = ((nr_of_elem)&0xff)
    if (buf.length < 0) {
      this.errno = errno.EINVAL
      return (-1); 
    }
    this.sendlen = buf.length;
    ibuf += buf;
    this.buf = res;
    ibuf[0] = 0;
    ibuf[1] = 84;
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);
    this.__complete = this.__EIB_MC_PropertyWrite_Complete;
    return 0
}

EIBConnection.prototype.EIB_MC_PropertyWrite = function( obj, propertyno, start, nr_of_elem, buf, res) {
    if(this.EIB_MC_PropertyWrite_async (obj, propertyno, start, nr_of_elem, buf, res) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_ReadADC_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 86 || this.data.length < 4 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    if(this.ptr1 != null) {
      this.ptr1.data = (((this.data[2])<<8)|(this.data[2+1]))
    return 0


}

EIBConnection.prototype.EIB_MC_ReadADC_async = function( channel, count, val) {
    ibuf = [0] * 4;
    this.ptr1 = val
    ibuf[2] = ((channel)&0xff)
    ibuf[3] = ((count)&0xff)
    ibuf[0] = 0
    ibuf[1] = 86
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_ReadADC_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_ReadADC = function( channel, count, val) {
    if(this.EIB_MC_ReadADC_async (channel, count, val) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Read_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 81 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    this.buf.buffer = this.data.slice(2)
    return this.buf.buffer.length


}

EIBConnection.prototype.EIB_MC_Read_async = function( addr, buf_len, buf) {
    ibuf = [0] * 6;
    this.buf = buf
    ibuf[2] = ((addr>>8)&0xff)
    ibuf[3] = ((addr)&0xff)
    ibuf[4] = ((buf_len>>8)&0xff)
    ibuf[5] = ((buf_len)&0xff)
    ibuf[0] = 0
    ibuf[1] = 81
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Read_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Read = function( addr, buf_len, buf) {
    if(this.EIB_MC_Read_async (addr, buf_len, buf) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Restart_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 90 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_Restart_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 90
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_MC_Restart_Complete;
    return 0


}

EIBConnection.prototype.EIB_MC_Restart = function() {
    if(this.EIB_MC_Restart_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_SetKey_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 2) {
      this.errno = 'EPERM';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 88 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_MC_SetKey_async = function( key, level) {
    ibuf = [0] * 7;
    if (key.length != 4) {
      this.errno = errno.EINVAL
      return (-1);
    }
    for (i = 2; i < 6; i++) ibuf[i] = key[i-2];
    ibuf[6] = ((level)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 88;
    if(this.__EIB_SendRequest(ibuf) == -1)  return (-1);
    this.__complete = this.__EIB_MC_SetKey_Complete;
    return 0;
}

EIBConnection.prototype.EIB_MC_SetKey = function( key, level) {
    if(this.EIB_MC_SetKey_async (key, level) == -1)    return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Write_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 68) {
      this.errno = 'EIO';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 82 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return this.sendlen


}

EIBConnection.prototype.EIB_MC_Write_async = function( addr, buf) {
    ibuf = [0] * 6;
    ibuf[2] = ((addr>>8)&0xff);
    ibuf[3] = ((addr)&0xff);
    ibuf[4] = (((buf))>>8)&0xff.length;
    ibuf[5] = (((buf)))&0xff.length;
    if (buf.length < 0) {
      this.errno = errno.EINVAL
      return (-1);
    }
    this.sendlen = buf.length;
    ibuf += buf;
    ibuf[0] = 0;
    ibuf[1] = 82;
    if(this.__EIB_SendRequest(ibuf) == -1)  return (-1);
    this.__complete = this.__EIB_MC_Write_Complete;
    return 0;
}

EIBConnection.prototype.EIB_MC_Write = function( addr, buf) {
    if(this.EIB_MC_Write_async (addr, buf) == -1)  return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_MC_Write_Plain_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 91 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return this.sendlen
}

EIBConnection.prototype.EIB_MC_Write_Plain_async = function( addr, buf) {
    ibuf = [0] * 6;
    ibuf[2] = ((addr>>8)&0xff);
    ibuf[3] = ((addr)&0xff);
    ibuf[4] = (((buf))>>8)&0xff.length;
    ibuf[5] = (((buf)))&0xff.length;
    if (buf.length < 0) {
      this.errno = errno.EINVAL;
      return (-1);
    }
    this.sendlen = buf.length;
    ibuf += buf;
    ibuf[0] = 0;
    ibuf[1] = 91;
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);
    this.__complete = this.__EIB_MC_Write_Plain_Complete;
    return 0;
}

EIBConnection.prototype.EIB_MC_Write_Plain = function( addr, buf) {
    if(this.EIB_MC_Write_Plain_async (addr, buf) == -1) return (-1);
    return this.EIBComplete ();
}

EIBConnection.prototype.__EIB_M_GetMaskVersion_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 49 || this.data.length < 4 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return (((this.data[2])<<8)|(this.data[2+1]));
}

EIBConnection.prototype.EIB_M_GetMaskVersion_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[0] = 0
    ibuf[1] = 49
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);;
    this.__complete = this.__EIB_M_GetMaskVersion_Complete;
    return 0
}

EIBConnection.prototype.EIB_M_GetMaskVersion = function( dest) {
    if(this.EIB_M_GetMaskVersion_async (dest) == -1) return (-1);
    return this.EIBComplete ()
}

EIBConnection.prototype.__EIB_M_Progmode_Off_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return 0
}

EIBConnection.prototype.EIB_M_Progmode_Off_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[4] = ((0)&0xff)
    ibuf[0] = 0
    ibuf[1] = 48
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);
    this.__complete = this.__EIB_M_Progmode_Off_Complete;
    return 0
}

EIBConnection.prototype.EIB_M_Progmode_Off = function( dest) {
    if(this.EIB_M_Progmode_Off_async (dest) == -1) return (-1);
    return this.EIBComplete ()
}

EIBConnection.prototype.__EIB_M_Progmode_On_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return 0;
}

EIBConnection.prototype.EIB_M_Progmode_On_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[4] = ((1)&0xff)
    ibuf[0] = 0
    ibuf[1] = 48
    if(this.__EIB_SendRequest(ibuf) == -1)  return (-1);;
    this.__complete = this.__EIB_M_Progmode_On_Complete;
    return 0


}

EIBConnection.prototype.EIB_M_Progmode_On = function( dest) {
    if(this.EIB_M_Progmode_On_async (dest) == -1) return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_M_Progmode_Status_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 || this.data.length < 3 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return this.data[2];
}

EIBConnection.prototype.EIB_M_Progmode_Status_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[4] = ((3)&0xff)
    ibuf[0] = 0
    ibuf[1] = 48
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);;
    this.__complete = this.__EIB_M_Progmode_Status_Complete;
    return 0
}

EIBConnection.prototype.EIB_M_Progmode_Status = function( dest) {
    if(this.EIB_M_Progmode_Status_async (dest) == -1) return (-1);
    return this.EIBComplete ()
}

EIBConnection.prototype.__EIB_M_Progmode_Toggle_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 48 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    return 0
}

EIBConnection.prototype.EIB_M_Progmode_Toggle_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[4] = ((2)&0xff)
    ibuf[0] = 0
    ibuf[1] = 48
    if(this.__EIB_SendRequest(ibuf) == -1) return (-1);;
    this.__complete = this.__EIB_M_Progmode_Toggle_Complete;
    return 0
}

EIBConnection.prototype.EIB_M_Progmode_Toggle = function( dest) {
    if(this.EIB_M_Progmode_Toggle_async (dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_M_ReadIndividualAddresses_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 50 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    }
    this.buf.buffer = this.data.slice(2);
    return this.buf.buffer.length;
}

EIBConnection.prototype.EIB_M_ReadIndividualAddresses_async = function( buf) {
    ibuf = [0] * 2;
    this.buf = buf
    ibuf[0] = 0
    ibuf[1] = 50
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_ReadIndividualAddresses_Complete;
    return 0


}

EIBConnection.prototype.EIB_M_ReadIndividualAddresses = function( buf) {
    if(this.EIB_M_ReadIndividualAddresses_async (buf) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIB_M_WriteIndividualAddress_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 65) {
      this.errno = 'EADDRINUSE';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 67) {
      this.errno = 'ETIMEDOUT';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 66) {
      this.errno = 'EADDRNOTAVAIL';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 64 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIB_M_WriteIndividualAddress_async = function( dest) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[0] = 0
    ibuf[1] = 64
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIB_M_WriteIndividualAddress_Complete;
    return 0


}

EIBConnection.prototype.EIB_M_WriteIndividualAddress = function( dest) {
    if(this.EIB_M_WriteIndividualAddress_async (dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenBusmonitor_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 16 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenBusmonitor_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 16
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenBusmonitor_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenBusmonitor = function() {
    if(this.EIBOpenBusmonitor_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenBusmonitorText_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 17 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenBusmonitorText_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 17
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenBusmonitorText_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenBusmonitorText = function() {
    if(this.EIBOpenBusmonitorText_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpen_GroupSocket_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 38 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpen_GroupSocket_async = function( write_only) {
    ibuf = [0] * 5;
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = 0
    ibuf[1] = 38
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpen_GroupSocket_Complete;
    return 0


}

EIBConnection.prototype.EIBOpen_GroupSocket = function( write_only) {
    if(this.EIBOpen_GroupSocket_async (write_only) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenT_Broadcast_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 35 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenT_Broadcast_async = function( write_only) {
    ibuf = [0] * 5;
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = 0
    ibuf[1] = 35
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);
    this.__complete = this.__EIBOpenT_Broadcast_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenT_Broadcast = function( write_only) {
    if(this.EIBOpenT_Broadcast_async (write_only) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenT_Connection_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 32 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenT_Connection_async = function( dest) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    ibuf[0] = 0
    ibuf[1] = 32
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_Connection_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenT_Connection = function( dest) {
    if(this.EIBOpenT_Connection_async (dest) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenT_Group_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 34 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenT_Group_async = function( dest, write_only) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = 0
    ibuf[1] = 34
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_Group_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenT_Group = function( dest, write_only) {
    if(this.EIBOpenT_Group_async (dest, write_only) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenT_Individual_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 33 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenT_Individual_async = function( dest, write_only) {
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    if(write_only != 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    ibuf[0] = 0
    ibuf[1] = 33
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_Individual_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenT_Individual = function( dest, write_only) {
    if(this.EIBOpenT_Individual_async (dest, write_only) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenT_TPDU_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 36 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenT_TPDU_async = function( src) {
    ibuf = [0] * 5;
    ibuf[2] = ((src>>8)&0xff)
    ibuf[3] = ((src)&0xff)
    ibuf[0] = 0
    ibuf[1] = 36
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenT_TPDU_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenT_TPDU = function( src) {
    if(this.EIBOpenT_TPDU_async (src) == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenVBusmonitor_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 18 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenVBusmonitor_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 18
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenVBusmonitor_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenVBusmonitor = function() {
    if(this.EIBOpenVBusmonitor_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBOpenVBusmonitorText_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 1) {
      this.errno = 'EBUSY';
      return (-1)
    }
    if((((this.data[0])<<8)|(this.data[0+1])) != 19 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBOpenVBusmonitorText_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 19
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBOpenVBusmonitorText_Complete;
    return 0


}

EIBConnection.prototype.EIBOpenVBusmonitorText = function() {
    if(this.EIBOpenVBusmonitorText_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.__EIBReset_Complete = function() {
    this.__complete = null;
    if (this.__EIB_GetRequest() == -1) return(-1);
    if((((this.data[0])<<8)|(this.data[0+1])) != 4 || this.data.length < 2 ) {
      this.errno = errno.ECONNRESET
      return (-1);
    return 0


}

EIBConnection.prototype.EIBReset_async = function() {
    ibuf = [0] * 2;
    ibuf[0] = 0
    ibuf[1] = 4
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    this.__complete = this.__EIBReset_Complete;
    return 0


}

EIBConnection.prototype.EIBReset = function() {
    if(this.EIBReset_async () == -1) {
      return (-1);
    return this.EIBComplete ()

}

EIBConnection.prototype.EIBSendAPDU = function( data) {
    ibuf = [0] * 2;
    if (data.length < 2) { 
      this.errno = errno.EINVAL
      return (-1);
    this.sendlen = data.length
    ibuf += data
    ibuf[0] = 0
    ibuf[1] = 37
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    return this.sendlen


}

EIBConnection.prototype.EIBSendGroup = function( dest, data) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    if (data.length < 2) { 
      this.errno = errno.EINVAL
      return (-1);
    this.sendlen = data.length
    ibuf += data
    ibuf[0] = 0
    ibuf[1] = 39
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    return this.sendlen


}

EIBConnection.prototype.EIBSendTPDU = function( dest, data) {
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff)
    ibuf[3] = ((dest)&0xff)
    if (data.length < 2) { 
      this.errno = errno.EINVAL
      return (-1);
    this.sendlen = data.length
    ibuf += data
    ibuf[0] = 0
    ibuf[1] = 37
    if(this.__EIB_SendRequest(ibuf) == -1) {
      return (-1);;
    return this.sendlen


}
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
