EIBConnection.prototype.__EIBGetAPDU_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 37) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIBGetAPDU_async = function(cb, buf) {
	console.log('entering EIBGetAPDU_async');
    ibuf = [0] * 2;
    this.buf = buf;
    this.__EIBGetAPDU_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBGetAPDU = function(cb, buf) {
    this.EIBGetAPDU_async (cb, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBGetAPDU_Src_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 37) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    if(this.ptr5 !== null) this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]));
    this.buf.buffer = this.data.slice(4);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIBGetAPDU_Src_async = function(cb, buf, src) {
	console.log('entering EIBGetAPDU_Src_async');
    ibuf = [0] * 2;
    this.buf = buf;
    this.ptr5 = src;
    this.__EIBGetAPDU_Src_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBGetAPDU_Src = function(cb, buf, src) {
    this.EIBGetAPDU_Src_async (cb, buf, src, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBGetBusmonitorPacket_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 20) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIBGetBusmonitorPacket_async = function(cb, buf) {
	console.log('entering EIBGetBusmonitorPacket_async');
    ibuf = [0] * 2;
    this.buf = buf;
    this.__EIBGetBusmonitorPacket_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBGetBusmonitorPacket = function(cb, buf) {
    this.EIBGetBusmonitorPacket_async (cb, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBGetGroup_Src_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 39) || (this.data.length < 6)) {
      throw new Error('ECONNRESET');
    }
    if(this.ptr5 !== null) this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]));
    if(this.ptr6 !== null) this.ptr6.data = (((this.data[4])<<8)|(this.data[4+1]));
    this.buf.buffer = this.data.slice(6);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIBGetGroup_Src_async = function(cb, buf, src, dest) {
	console.log('entering EIBGetGroup_Src_async');
    ibuf = [0] * 2;
    this.buf = buf;
    this.ptr5 = src;
    this.ptr6 = dest;
    this.__EIBGetGroup_Src_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBGetGroup_Src = function(cb, buf, src, dest) {
    this.EIBGetGroup_Src_async (cb, buf, src, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBGetTPDU_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 37) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    if(this.ptr5 !== null) this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]));
    this.buf.buffer = this.data.slice(4);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIBGetTPDU_async = function(cb, buf, src) {
	console.log('entering EIBGetTPDU_async');
    ibuf = [0] * 2;
    this.buf = buf;
    this.ptr5 = src;
    this.__EIBGetTPDU_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBGetTPDU = function(cb, buf, src) {
    this.EIBGetTPDU_async (cb, buf, src, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_Clear_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 114) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_Cache_Clear_async = function(cb) {
	console.log('entering EIB_Cache_Clear_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 114;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_Clear_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_Clear = function(cb) {
    this.EIB_Cache_Clear_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_Disable_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 113) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_Cache_Disable_async = function(cb) {
	console.log('entering EIB_Cache_Disable_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 113;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_Disable_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_Disable = function(cb) {
    this.EIB_Cache_Disable_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_Enable_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 1) {
      throw new Error('EBUSY');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 112) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_Cache_Enable_async = function(cb) {
	console.log('entering EIB_Cache_Enable_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 112;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_Enable_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_Enable = function(cb) {
    this.EIB_Cache_Enable_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_Read_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 117) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    if((((this.data[4])<<8)|(this.data[4+1])) === 0) {
      throw new Error('ENODEV');
    }
    if (this.data.length <= 6) {
      throw new Error('ENOENT');
    }
    if(this.ptr5 !== null) this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]));
    this.buf.buffer = this.data.slice(6);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_Cache_Read_async = function(cb, dst, src, buf) {
	console.log('entering EIB_Cache_Read_async');
    ibuf = [0] * 4;
    this.buf = buf;
    this.ptr5 = src;
    ibuf[2] = ((dst>>8)&0xff);
    ibuf[3] = ((dst)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 117;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_Read_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_Read = function(cb, dst, src, buf) {
    this.EIB_Cache_Read_async (cb, dst, src, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_Read_Sync_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 116) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    if((((this.data[4])<<8)|(this.data[4+1])) === 0) {
      throw new Error('ENODEV');
    }
    if (this.data.length <= 6) {
      throw new Error('ENOENT');
    }
    if(this.ptr5 !== null) this.ptr5.data = (((this.data[2])<<8)|(this.data[2+1]));
    this.buf.buffer = this.data.slice(6);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_Cache_Read_Sync_async = function(cb, dst, src, buf, age) {
	console.log('entering EIB_Cache_Read_Sync_async');
    ibuf = [0] * 6;
    this.buf = buf;
    this.ptr5 = src;
    ibuf[2] = ((dst>>8)&0xff);
    ibuf[3] = ((dst)&0xff);
    ibuf[4] = ((age>>8)&0xff);
    ibuf[5] = ((age)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 116;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_Read_Sync_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_Read_Sync = function(cb, dst, src, buf, age) {
    this.EIB_Cache_Read_Sync_async (cb, dst, src, buf, age, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_Remove_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 115) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_Cache_Remove_async = function(cb, dest) {
	console.log('entering EIB_Cache_Remove_async');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 115;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_Remove_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_Remove = function(cb, dest) {
    this.EIB_Cache_Remove_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_Cache_LastUpdates_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 118) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    if(this.ptr4 !== null) this.ptr4.data = (((this.data[2])<<8)|(this.data[2+1]));
    this.buf.buffer = this.data.slice(4);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_Cache_LastUpdates_async = function(cb, start, timeout, buf, ende) {
	console.log('entering EIB_Cache_LastUpdates_async');
    ibuf = [0] * 5;
    this.buf = buf;
    this.ptr4 = ende;
    ibuf[2] = ((start>>8)&0xff);
    ibuf[3] = ((start)&0xff);
    ibuf[4] = ((timeout)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 118;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_Cache_LastUpdates_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_Cache_LastUpdates = function(cb, start, timeout, buf, ende) {
    this.EIB_Cache_LastUpdates_async (cb, start, timeout, buf, ende, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_LoadImage_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 99) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    cb((((this.data[2])<<8)|(this.data[2+1]))); return;

};

EIBConnection.prototype.EIB_LoadImage_async = function(cb, image) {
	console.log('entering EIB_LoadImage_async');
    ibuf = [0] * 2;
    if (image.length < 0) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = image.length;
    ibuf += image;
    ibuf[0] = 0;
    ibuf[1] = 99;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_LoadImage_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_LoadImage = function(cb, image) {
    this.EIB_LoadImage_async (cb, image, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Authorize_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 87) || (this.data.length < 3)) {
      throw new Error('ECONNRESET');
    }
    cb(this.data.slice(2)); return;

};

EIBConnection.prototype.EIB_MC_Authorize_async = function(cb, key) {
	console.log('entering EIB_MC_Authorize_async');
    ibuf = [0] * 6;
    if (key.length !== 4) {
      this.errno = errno.EINVAL;
      cb(-1);
    }
    Array.prototype.splice.apply(ibuf, [2, 2+4].concat(key));
    ibuf[0] = 0;
    ibuf[1] = 87;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Authorize_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Authorize = function(cb, key) {
    this.EIB_MC_Authorize_async (cb, key, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Connect_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 80) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_Connect_async = function(cb, dest) {
	console.log('entering EIB_MC_Connect_async');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 80;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Connect_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Connect = function(cb, dest) {
    this.EIB_MC_Connect_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Individual_Open_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 73) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_Individual_Open_async = function(cb, dest) {
	console.log('entering EIB_MC_Individual_Open_async');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 73;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Individual_Open_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Individual_Open = function(cb, dest) {
    this.EIB_MC_Individual_Open_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_GetMaskVersion_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 89) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    cb((((this.data[2])<<8)|(this.data[2+1]))); return;

};

EIBConnection.prototype.EIB_MC_GetMaskVersion_async = function(cb) {
	console.log('entering EIB_MC_GetMaskVersion_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 89;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_GetMaskVersion_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_GetMaskVersion = function(cb) {
    this.EIB_MC_GetMaskVersion_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_GetPEIType_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 85) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    cb((((this.data[2])<<8)|(this.data[2+1]))); return;

};

EIBConnection.prototype.EIB_MC_GetPEIType_async = function(cb) {
	console.log('entering EIB_MC_GetPEIType_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 85;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_GetPEIType_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_GetPEIType = function(cb) {
    this.EIB_MC_GetPEIType_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Progmode_Off_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 96) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_Progmode_Off_async = function(cb) {
	console.log('entering EIB_MC_Progmode_Off_async');
    ibuf = [0] * 3;
    ibuf[2] = ((0)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 96;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Progmode_Off_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Progmode_Off = function(cb) {
    this.EIB_MC_Progmode_Off_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Progmode_On_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 96) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_Progmode_On_async = function(cb) {
	console.log('entering EIB_MC_Progmode_On_async');
    ibuf = [0] * 3;
    ibuf[2] = ((1)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 96;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Progmode_On_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Progmode_On = function(cb) {
    this.EIB_MC_Progmode_On_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Progmode_Status_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 96) || (this.data.length < 3)) {
      throw new Error('ECONNRESET');
    }
    cb(this.data.slice(2)); return;

};

EIBConnection.prototype.EIB_MC_Progmode_Status_async = function(cb) {
	console.log('entering EIB_MC_Progmode_Status_async');
    ibuf = [0] * 3;
    ibuf[2] = ((3)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 96;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Progmode_Status_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Progmode_Status = function(cb) {
    this.EIB_MC_Progmode_Status_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Progmode_Toggle_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 96) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_Progmode_Toggle_async = function(cb) {
	console.log('entering EIB_MC_Progmode_Toggle_async');
    ibuf = [0] * 3;
    ibuf[2] = ((2)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 96;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Progmode_Toggle_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Progmode_Toggle = function(cb) {
    this.EIB_MC_Progmode_Toggle_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_PropertyDesc_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 97) || (this.data.length < 6)) {
      throw new Error('ECONNRESET');
    }
    if(this.ptr2 !== null) this.ptr2.data = this.data.slice(2);
    if(this.ptr4 !== null) this.ptr4.data = (((this.data[3])<<8)|(this.data[3+1]));
    if(this.ptr3 !== null) this.ptr3.data = this.data.slice(5);
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_PropertyDesc_async = function(cb, obj, propertyno, proptype, max_nr_of_elem, access) {
	console.log('entering EIB_MC_PropertyDesc_async');
    ibuf = [0] * 4;
    this.ptr2 = proptype;
    this.ptr4 = max_nr_of_elem;
    this.ptr3 = access;
    ibuf[2] = ((obj)&0xff);
    ibuf[3] = ((propertyno)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 97;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_PropertyDesc_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_PropertyDesc = function(cb, obj, propertyno, proptype, max_nr_of_elem, access) {
    this.EIB_MC_PropertyDesc_async (cb, obj, propertyno, proptype, max_nr_of_elem, access, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_PropertyRead_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 83) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_MC_PropertyRead_async = function(cb, obj, propertyno, start, nr_of_elem, buf) {
	console.log('entering EIB_MC_PropertyRead_async');
    ibuf = [0] * 7;
    this.buf = buf;
    ibuf[2] = ((obj)&0xff);
    ibuf[3] = ((propertyno)&0xff);
    ibuf[4] = ((start>>8)&0xff);
    ibuf[5] = ((start)&0xff);
    ibuf[6] = ((nr_of_elem)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 83;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_PropertyRead_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_PropertyRead = function(cb, obj, propertyno, start, nr_of_elem, buf) {
    this.EIB_MC_PropertyRead_async (cb, obj, propertyno, start, nr_of_elem, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_PropertyScan_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 98) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_MC_PropertyScan_async = function(cb, buf) {
	console.log('entering EIB_MC_PropertyScan_async');
    ibuf = [0] * 2;
    this.buf = buf;
    ibuf[0] = 0;
    ibuf[1] = 98;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_PropertyScan_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_PropertyScan = function(cb, buf) {
    this.EIB_MC_PropertyScan_async (cb, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_PropertyWrite_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 84) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_MC_PropertyWrite_async = function(cb, obj, propertyno, start, nr_of_elem, buf, res) {
	console.log('entering EIB_MC_PropertyWrite_async');
    ibuf = [0] * 7;
    ibuf[2] = ((obj)&0xff);
    ibuf[3] = ((propertyno)&0xff);
    ibuf[4] = ((start>>8)&0xff);
    ibuf[5] = ((start)&0xff);
    ibuf[6] = ((nr_of_elem)&0xff);
    if (buf.length < 0) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = buf.length;
    ibuf += buf;
    this.buf = res;
    ibuf[0] = 0;
    ibuf[1] = 84;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_PropertyWrite_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_PropertyWrite = function(cb, obj, propertyno, start, nr_of_elem, buf, res) {
    this.EIB_MC_PropertyWrite_async (cb, obj, propertyno, start, nr_of_elem, buf, res, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_ReadADC_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 86) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    if(this.ptr1 !== null) this.ptr1.data = (((this.data[2])<<8)|(this.data[2+1]));
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_ReadADC_async = function(cb, channel, count, val) {
	console.log('entering EIB_MC_ReadADC_async');
    ibuf = [0] * 4;
    this.ptr1 = val;
    ibuf[2] = ((channel)&0xff);
    ibuf[3] = ((count)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 86;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_ReadADC_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_ReadADC = function(cb, channel, count, val) {
    this.EIB_MC_ReadADC_async (cb, channel, count, val, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Read_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 81) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_MC_Read_async = function(cb, addr, buf_len, buf) {
	console.log('entering EIB_MC_Read_async');
    ibuf = [0] * 6;
    this.buf = buf;
    ibuf[2] = ((addr>>8)&0xff);
    ibuf[3] = ((addr)&0xff);
    ibuf[4] = ((buf_len>>8)&0xff);
    ibuf[5] = ((buf_len)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 81;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Read_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Read = function(cb, addr, buf_len, buf) {
    this.EIB_MC_Read_async (cb, addr, buf_len, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Restart_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 90) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_Restart_async = function(cb) {
	console.log('entering EIB_MC_Restart_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 90;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Restart_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Restart = function(cb) {
    this.EIB_MC_Restart_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_SetKey_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 2) {
      throw new Error('EPERM');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 88) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_MC_SetKey_async = function(cb, key, level) {
	console.log('entering EIB_MC_SetKey_async');
    ibuf = [0] * 7;
    if (key.length !== 4) {
      this.errno = errno.EINVAL;
      cb(-1);
    }
    Array.prototype.splice.apply(ibuf, [2, 2+4].concat(key));
    ibuf[6] = ((level)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 88;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_SetKey_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_SetKey = function(cb, key, level) {
    this.EIB_MC_SetKey_async (cb, key, level, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Write_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 68) {
      throw new Error('EIO');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 82) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(this.sendlen); return;

};

EIBConnection.prototype.EIB_MC_Write_async = function(cb, addr, buf) {
	console.log('entering EIB_MC_Write_async');
    ibuf = [0] * 6;
    ibuf[2] = ((addr>>8)&0xff);
    ibuf[3] = ((addr)&0xff);
    ibuf[4] = (((len(buf))>>8)&0xff);
    ibuf[5] = (((len(buf)))&0xff);
    if (buf.length < 0) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = buf.length;
    ibuf += buf;
    ibuf[0] = 0;
    ibuf[1] = 82;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Write_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Write = function(cb, addr, buf) {
    this.EIB_MC_Write_async (cb, addr, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_MC_Write_Plain_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 91) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(this.sendlen); return;

};

EIBConnection.prototype.EIB_MC_Write_Plain_async = function(cb, addr, buf) {
	console.log('entering EIB_MC_Write_Plain_async');
    ibuf = [0] * 6;
    ibuf[2] = ((addr>>8)&0xff);
    ibuf[3] = ((addr)&0xff);
    ibuf[4] = (((len(buf))>>8)&0xff);
    ibuf[5] = (((len(buf)))&0xff);
    if (buf.length < 0) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = buf.length;
    ibuf += buf;
    ibuf[0] = 0;
    ibuf[1] = 91;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_MC_Write_Plain_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_MC_Write_Plain = function(cb, addr, buf) {
    this.EIB_MC_Write_Plain_async (cb, addr, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_GetMaskVersion_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 49) || (this.data.length < 4)) {
      throw new Error('ECONNRESET');
    }
    cb((((this.data[2])<<8)|(this.data[2+1]))); return;

};

EIBConnection.prototype.EIB_M_GetMaskVersion_async = function(cb, dest) {
	console.log('entering EIB_M_GetMaskVersion_async');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 49;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_GetMaskVersion_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_GetMaskVersion = function(cb, dest) {
    this.EIB_M_GetMaskVersion_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_Progmode_Off_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 48) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_M_Progmode_Off_async = function(cb, dest) {
	console.log('entering EIB_M_Progmode_Off_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[4] = ((0)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 48;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_Progmode_Off_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_Progmode_Off = function(cb, dest) {
    this.EIB_M_Progmode_Off_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_Progmode_On_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 48) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_M_Progmode_On_async = function(cb, dest) {
	console.log('entering EIB_M_Progmode_On_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[4] = ((1)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 48;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_Progmode_On_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_Progmode_On = function(cb, dest) {
    this.EIB_M_Progmode_On_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_Progmode_Status_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 48) || (this.data.length < 3)) {
      throw new Error('ECONNRESET');
    }
    cb(this.data.slice(2)); return;

};

EIBConnection.prototype.EIB_M_Progmode_Status_async = function(cb, dest) {
	console.log('entering EIB_M_Progmode_Status_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[4] = ((3)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 48;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_Progmode_Status_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_Progmode_Status = function(cb, dest) {
    this.EIB_M_Progmode_Status_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_Progmode_Toggle_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 48) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_M_Progmode_Toggle_async = function(cb, dest) {
	console.log('entering EIB_M_Progmode_Toggle_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[4] = ((2)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 48;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_Progmode_Toggle_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_Progmode_Toggle = function(cb, dest) {
    this.EIB_M_Progmode_Toggle_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_ReadIndividualAddresses_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 50) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    this.buf.buffer = this.data.slice(2);
    cb(this.buf.buffer.length); return;

};

EIBConnection.prototype.EIB_M_ReadIndividualAddresses_async = function(cb, buf) {
	console.log('entering EIB_M_ReadIndividualAddresses_async');
    ibuf = [0] * 2;
    this.buf = buf;
    ibuf[0] = 0;
    ibuf[1] = 50;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_ReadIndividualAddresses_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_ReadIndividualAddresses = function(cb, buf) {
    this.EIB_M_ReadIndividualAddresses_async (cb, buf, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIB_M_WriteIndividualAddress_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 65) {
      throw new Error('EADDRINUSE');
    }
    if((((this.data[0])<<8)|(this.data[0+1])) !== 67) {
      throw new Error('ETIMEDOUT');
    }
    if((((this.data[0])<<8)|(this.data[0+1])) !== 66) {
      throw new Error('EADDRNOTAVAIL');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 64) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIB_M_WriteIndividualAddress_async = function(cb, dest) {
	console.log('entering EIB_M_WriteIndividualAddress_async');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 64;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIB_M_WriteIndividualAddress_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIB_M_WriteIndividualAddress = function(cb, dest) {
    this.EIB_M_WriteIndividualAddress_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenBusmonitor_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 1) {
      throw new Error('EBUSY');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 16) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenBusmonitor_async = function(cb) {
	console.log('entering EIBOpenBusmonitor_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 16;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenBusmonitor_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenBusmonitor = function(cb) {
    this.EIBOpenBusmonitor_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenBusmonitorText_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 1) {
      throw new Error('EBUSY');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 17) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenBusmonitorText_async = function(cb) {
	console.log('entering EIBOpenBusmonitorText_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 17;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenBusmonitorText_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenBusmonitorText = function(cb) {
    this.EIBOpenBusmonitorText_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpen_GroupSocket_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 38) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpen_GroupSocket_async = function(cb, write_only) {
	console.log('entering EIBOpen_GroupSocket_async');
    ibuf = [0] * 5;
    if(write_only !== 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    }
    ibuf[0] = 0;
    ibuf[1] = 38;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpen_GroupSocket_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpen_GroupSocket = function(cb, write_only) {
    this.EIBOpen_GroupSocket_async (cb, write_only, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenT_Broadcast_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 35) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenT_Broadcast_async = function(cb, write_only) {
	console.log('entering EIBOpenT_Broadcast_async');
    ibuf = [0] * 5;
    if(write_only !== 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    }
    ibuf[0] = 0;
    ibuf[1] = 35;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenT_Broadcast_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenT_Broadcast = function(cb, write_only) {
    this.EIBOpenT_Broadcast_async (cb, write_only, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenT_Connection_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 32) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenT_Connection_async = function(cb, dest) {
	console.log('entering EIBOpenT_Connection_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 32;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenT_Connection_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenT_Connection = function(cb, dest) {
    this.EIBOpenT_Connection_async (cb, dest, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenT_Group_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 34) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenT_Group_async = function(cb, dest, write_only) {
	console.log('entering EIBOpenT_Group_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    if(write_only !== 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    }
    ibuf[0] = 0;
    ibuf[1] = 34;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenT_Group_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenT_Group = function(cb, dest, write_only) {
    this.EIBOpenT_Group_async (cb, dest, write_only, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenT_Individual_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 33) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenT_Individual_async = function(cb, dest, write_only) {
	console.log('entering EIBOpenT_Individual_async');
    ibuf = [0] * 5;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    if(write_only !== 0) {
      ibuf[4] = 0xff;
    } else {
      ibuf[4] = 0x00;
    }
    ibuf[0] = 0;
    ibuf[1] = 33;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenT_Individual_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenT_Individual = function(cb, dest, write_only) {
    this.EIBOpenT_Individual_async (cb, dest, write_only, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenT_TPDU_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 36) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenT_TPDU_async = function(cb, src) {
	console.log('entering EIBOpenT_TPDU_async');
    ibuf = [0] * 5;
    ibuf[2] = ((src>>8)&0xff);
    ibuf[3] = ((src)&0xff);
    ibuf[0] = 0;
    ibuf[1] = 36;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenT_TPDU_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenT_TPDU = function(cb, src) {
    this.EIBOpenT_TPDU_async (cb, src, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenVBusmonitor_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 1) {
      throw new Error('EBUSY');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 18) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenVBusmonitor_async = function(cb) {
	console.log('entering EIBOpenVBusmonitor_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 18;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenVBusmonitor_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenVBusmonitor = function(cb) {
    this.EIBOpenVBusmonitor_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBOpenVBusmonitorText_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if((((this.data[0])<<8)|(this.data[0+1])) !== 1) {
      throw new Error('EBUSY');
    }
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 19) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBOpenVBusmonitorText_async = function(cb) {
	console.log('entering EIBOpenVBusmonitorText_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 19;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBOpenVBusmonitorText_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBOpenVBusmonitorText = function(cb) {
    this.EIBOpenVBusmonitorText_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.__EIBReset_Complete = function(cb) {
    this.__complete = null;
    //try {
		this.__EIB_GetRequest();
//	}  catch(e) {
//		console.log('GetRequest error: '+e);
//	}
    if(((((this.data[0])<<8)|(this.data[0+1])) !== 4) || (this.data.length < 2)) {
      throw new Error('ECONNRESET');
    }
    cb(0); return;

};

EIBConnection.prototype.EIBReset_async = function(cb) {
	console.log('entering EIBReset_async');
    ibuf = [0] * 2;
    ibuf[0] = 0;
    ibuf[1] = 4;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    this.__EIBReset_Complete( function(rc) {
    	this.__complete = rc;
    	cb(0); return;
    });

};

EIBConnection.prototype.EIBReset = function(cb) {
    this.EIBReset_async (cb, function(rc) { 
	if (rc === -1) { cb(-1); return; }
	this.EIBComplete(cb);
  });
};

EIBConnection.prototype.EIBSendAPDU = function(cb, data) {
	console.log('entering EIBSendAPDU');
    ibuf = [0] * 2;
    if (data.length < 2) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = data.length;
    ibuf += data;
    ibuf[0] = 0;
    ibuf[1] = 37;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    cb(this.sendlen); return;

};

EIBConnection.prototype.EIBSendGroup = function(cb, dest, data) {
	console.log('entering EIBSendGroup');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    if (data.length < 2) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = data.length;
    ibuf += data;
    ibuf[0] = 0;
    ibuf[1] = 39;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    cb(this.sendlen); return;

};

EIBConnection.prototype.EIBSendTPDU = function(cb, dest, data) {
	console.log('entering EIBSendTPDU');
    ibuf = [0] * 4;
    ibuf[2] = ((dest>>8)&0xff);
    ibuf[3] = ((dest)&0xff);
    if (data.length < 2) {
      this.errno = 'errno.EINVAL';
      cb(-1); return;
    }
    this.sendlen = data.length;
    ibuf += data;
    ibuf[0] = 0;
    ibuf[1] = 37;
    this.__EIB_SendRequest(function(rc) { if (rc == -1) cb(-1); }, ibuf);
    cb(this.sendlen); return;

};

