// Nasty hack.

var CURRENT_INCLUDE_DIRS = [];
var CURRENT_DIR = dirname($(location).attr('pathname'));
function include(url)
{
	var absolutepath = join(CURRENT_DIR, url);
	if(CURRENT_INCLUDE_DIRS.indexOf(absolutepath) == -1)
	{
		CURRENT_INCLUDE_DIRS.push(absolutepath);
		var temp = CURRENT_DIR;
		CURRENT_DIR = dirname(absolutepath);
		$.ajax({async: false, url: absolutepath, dataType: "script"});
		CURRENT_DIR = temp;
	}
}
