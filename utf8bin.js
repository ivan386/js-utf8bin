function utf8b_to_uri(str)
{
	return escape(str).replace(/%u[0-9A-F]{4}(?:%uD[C-F][0-9A-F]{2})?/g, function(ecode)
	{
		return encodeURIComponent(unescape(ecode))
	})
}

function utf8b_to_base64(str)
{
	return btoa(unescape(utf8b_to_uri(str)))
}

function utf8b_to_bin(str)
{
	var decoded = unescape(utf8b_to_uri(str))
	var buffer = new ArrayBuffer(decoded.length);
	var bytes = new UInt8Array(buffer);
	for (i = 0; i < decoded.length; i++)
		bytes[i] = decoded.charCodeAt(i);
	
	return buffer;
}

function bin_to_utf8b(buffer)
{
	var bytes = new UInt8Array(buffer);
	return compress(String.fromCharCode.apply(null, bytes));
}

function compress(str)
{
	return ascii_str.replace(/[\xC4-\xF4][\x80-\xBF]+/g, function(astr)
	{
		var head = astr.charCodeAt(0);
		var len = 0;
		for ( i = 0x80; (head & i) > 0; i >>= 1 )
			len++;
		
		if ( len > 4 || len > astr.length )
			return astr;
		
		if (len == 3 && astr.charCodeAt(1) >= 0xA0)
			return astr;
			
		return decodeURIComponent(escape(astr.substr(0,len))) + astr.substr(len);
	})
}