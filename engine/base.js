var Base = function()
{
	this.core = null;
};
Base.prototype = Object.create(Object.prototype);
Base.prototype.constructor = Base;
Base.prototype.isChildOfClass = function(cls)
{
	return this instanceof cls;
};
// A nasty hack :)
Base.prototype.CreateObject = function()
{
	var args = Array.prototype.slice.call(arguments);
	var object = args.shift();
	var instance = new object(args);
	instance.core = this.core;
	return instance;
};

function hsl2rgb(h, s, l)
{
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r, g, b];
}
