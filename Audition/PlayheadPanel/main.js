/*************************************************************************
* 
* ADOBE INC.
*  Copyright 2016 Adobe Inc.
*  All Rights Reserved.
* 
* NOTICE:  Adobe permits you to use, modify, and distribute this file in 
* accordance with the terms of the Adobe license agreement accompanying it.  
* If you have received this file from a source other than Adobe, then your 
* use, modification, or distribution of it requires the prior written 
* permission of Adobe.
* 
**************************************************************************/

var sUpdate = true;

///////////////////////////////////////////////////////////////////////////////
//
// called on startup
//
function onLoaded()
{
	initAppearance();

	// start timer
	onTick();
}

///////////////////////////////////////////////////////////////////////////////
//
// Create timecode string for given number of seconds
//
function getTimecode(timeSec)
{
    function formatNumber(number)
    {
        var ret = number.toString();

        if (number < 10)
        {
            ret = '0' + ret;
        }
    
        return ret;
    }

	var timeMS = Number(timeSec) * 1000;
	var date = new Date(timeMS);
    
	var ret = formatNumber(date.getHours() - 1) + ':' + 
			  formatNumber(date.getMinutes()) + ':' + 
			  formatNumber(date.getSeconds()) + ':' + 
			  formatNumber(date.getMilliseconds());

	return ret;
}

///////////////////////////////////////////////////////////////////////////////
//
// Timer handler function
// Called every 200 ms and update the panel with the current document information
//
function onTick()
{
	update();	
	setTimeout(onTick, 200);
}

///////////////////////////////////////////////////////////////////////////////
//
// Update display
//
function update()
{
	var csInterface = new CSInterface();
	csInterface.evalScript('getDocumentInfo();', function(result)
	{
		try
		{		
			var resultObj = eval(result);
			
			if (resultObj.document)
			{
				if (sUpdate)
				{
					// blocked during change events
					document.getElementById('range').value = Number(resultObj.current / resultObj.end).toString();
				}
				document.getElementById('range').removeAttribute('disabled');
				document.getElementById('starttime').innerHTML = getTimecode(resultObj.start);
				document.getElementById('endtime').innerHTML = getTimecode(resultObj.end);
				document.getElementById('currenttime').innerHTML = getTimecode(resultObj.current);
			}
			else
			{
				document.getElementById('range').setAttribute('disabled', 'true');
				document.getElementById('starttime').innerHTML = '';
				document.getElementById('endtime').innerHTML = '';
				document.getElementById('currenttime').innerHTML = '';
			}
		}
		catch(ex)
		{
			// something went wrong
		}
	});
}

///////////////////////////////////////////////////////////////////////////////
//
// Set new playhead position
//
function showSliderPosition(value, isInput)
{
	var pos = parseFloat(value);
	
	if (!isNaN(pos))
	{
		var csInterface = new CSInterface();
		
		if (isInput)
		{
			csInterface.evalScript('setCTI(' + pos + ');', function(result)
			{
				sUpdate = true;
			});
		}
		else	
		{
			csInterface.evalScript('setCTI(' + pos + ');');
			sUpdate = false;
		}
	}
}
