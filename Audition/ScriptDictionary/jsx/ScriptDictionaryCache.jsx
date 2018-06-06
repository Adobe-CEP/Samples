/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/


//@include "./utils.jsx"
//@include "./ScriptDictionary2html.jsx"

function ScriptDictionaryCache()
{
    this.getDictionaryHtml = function(includeTOC, force)
    {
        var html = null;
        
        if (!force)
        {
            html = getCacheData(includeTOC);
        }
    
        if (html == null)
        {
            html = generateData(includeTOC);
        }
    
        return html;
    }

	// private ----------------------------------------------------------------
	
    function generateData(includeTOC)
    {
        var d = new ScriptDictionary2html();
        var html = d.convert2Html(includeTOC);
        
        cacheData(html, includeTOC);
        
        return html;
    }

    function cacheData(data, flag)
    {
        var file = getCacheFile();
        
        var success = true;
        if (!file.parent.exists)
        {
            success = file.parent.create();
        }
        
        if (success && file.open('w'))
        {
            try
            {
                var sig = createSignature(flag);
                file.writeln(sig);
                file.writeln(data);
            }
            finally
            {
                file.close();
            }
        }
    }

    function getCacheFile()
    {
        return new File(Folder.userData.absoluteURI + '/Adobe/ScriptDict/' + BridgeTalk.appSpecifier + 'ESDict.html');
    }

    function getCacheData(flag)
    {
        var ret = null;
        var file = getCacheFile();
        
        if (file.exists && file.open('r'))
        {
            try
            {
                var sig = createSignature(flag);
                var cacheSig = file.readln();
                
                if (sig == cacheSig)
                {
                    ret = '';
                    
                    while(!file.eof)
                    {
                        ret += file.readln();
                    }
                
                    if (ret.length == 0)
                    {
                        ret = null;
                    }
                }
            }
            finally
            {
                file.close();
            }
        }
    
        return ret;
    }

    function createSignature(flag)
    {
        var buildNo = 0;
        
        if (__isValid__(app.buildName))
        {
            buildNo = app.buildName;
        }
        else if (__isValid__(app.buildNumber))
        {
            buildNo = app.buildNumber;
        }
        else if (__isValid__(app.build))
        {
            buildNo = app.build;
        }
        else
        {
            buildNo = BridgeTalk.appVersion;
        }
    
        return '<!-- ' + (flag ? 'TOCO' : '') + BridgeTalk.appName + app.version + buildNo + ' -->';
    }
}
