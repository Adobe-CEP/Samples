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
