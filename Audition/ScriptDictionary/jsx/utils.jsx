/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe Inc.
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe. 
**************************************************************************/


///////////////////////////////////////////////////////////////////////////////
//
// Check whether the parameter 'prop' is valid in terms of
// prop exists, is defined and not null.
//
// Returns true if the parameter is valid.
//
function __isValid__(prop)
{
    if (typeof(prop) == "undefined")
        return false;
    if (prop == null)
        return false;
    return true;
}
