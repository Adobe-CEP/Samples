/**************************************************************************************************
*
* ADOBE SYSTEMS INCORPORATED
* Copyright 2013 Adobe Systems Incorporated
* All Rights Reserved.
*
* NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
* terms of the Adobe license agreement accompanying it.  If you have received this file from a
* source other than Adobe, then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
*
**************************************************************************************************/

/** IMSInterface - v4.2.0 */

/**
 * @class AAMStatus
 * Stores status information for the Adobe Application Manager.
 * All values must use UTF-8 encoded chars.
 *
 * @param status   The authorization status.
 * @param callerId The caller ID, a unique ID for your application created by PlugPlug.
 * @param payload  For future use.
 *
 * @return An \c AAMStatus object.
 **/
function AAMStatus(status, callerId, payload)
{
    this.status = status;
    this.callerId = callerId;
    this.payload = payload;
};

/**
 * @class IMSInterface
 * This is the entry point to the Adobe Identity Management Service (IMS) toolkit library.
 * Instantiate this class, and use the object to:
 * <ul>
 * <li>Retrieve a subscription access token for a particular service.</li>
 * <li>Retrieve a list of users who are registered on this device.</li>
 * <li>Invoke Adobe Application Manager (AAM) to interact with user if needed.</li>
 * </ul>
 * Most requests include a session reference, which is returned from a connection request,
 * and an IMS client ID, which uniquely identifies your service and service context. When
 * developing a CS Extension, you must register with the IMS team to receive your client ID.
 *
 * @return The \c IMSInterface object for an IMS session.
 */
function IMSInterface()
{
};

/**
 * Registers a  handler for a CS event. The handler is a callback function that is
 * passed a single parameter, the \c #CSEvent object containing detailed information
 * about the event.
 *
 * You must register callback functions to handle the results of asynchronous calls
 * to the \c IMSInterface methods.
 *
 * @param type      The event-type  constant.
 * @param listener  The JavaScript handler function for the event.
 */
IMSInterface.prototype.addEventListener = function(type, listener)
{
    window.__adobe_cep__.addEventListener(type, listener);
};

/**
 * Removes the handler associated with a CS event.
 *
 * @param type      The event-type  constant.
 * @param listener  The JavaScript handler function that was registered for the event.
 */
IMSInterface.prototype.removeEventListener = function(type, listener)
{
    window.__adobe_cep__.removeEventListener(type, listener);
};

/**
 * Establishes an IMS session. Must be called before any IMS access methods.
 * This method is not thread safe.
 *
 * @return An IMS reference string, as returned from IMSLib, which you
 *  can then use to make further IMS calls to this object's methods.
 */
IMSInterface.prototype.imsConnect = function()
{
    var imsRef = window.__adobe_cep__.imsConnect();
    return imsRef;
};

/**
* Disconnects the extension from IMS and disposes of the IMS reference.
*
* @param imsRef     An IMS reference returned from the \c IMSConnect() call.
*/
IMSInterface.prototype.imsDisconnect = function(imsRef)
{
    window.__adobe_cep__.imsDisconnect(imsRef);
};

/**
 * Retrieves user account information from IMS/Renga.
 *
 * @param imsRef    An IMS reference returned from the \c IMSConnect() call.
 * @param clientID  The IMS client ID for your extension, assigned by the IMS team on registration.
 *
 * @return Account information in XML string format. This is an example of the returned XML string:\n
 * <listing>\n
 *   &lt;UserAccounts&gt;\n
 *     &lt;UserData default="true"&gt;\n
 *       &lt;UserID&gt;12345&#64;AdobeID&lt;/UserID&gt;\n
 *       &lt;Name&gt;Joe Bloggs&lt;/Name&gt;\n
 *       &lt;FirstName&gt;Joe&lt;/FirstName&gt;\n
 *       &lt;LastName&gt;Bloggs&lt;/LastName&gt;\n
 *       &lt;Email&gt;Joe_Bloggs&#64;testemail.com&lt;/Email&gt;\n
 *       &lt;SAOList&gt;\n
 *         &lt;SAOData id="123456789"&gt;\n
 *           &lt;ServiceCode&gt;my_service&lt;/ServiceCode&gt;\n
 *           &lt;ServiceStatus&gt;ACTIVE&lt;/ServiceStatus&gt;\n
 *           &lt;ServiceLevel&gt;CS_LVL_1&lt;/ServiceLevel&gt;\n
 *         &lt;/SAOData&gt;\n
 *       &lt;/SAOList&gt;\n
 *     &lt;/UserData&gt;\n
 *   &lt;/UserAccounts&gt;\n
 * </listing>\n
 */
IMSInterface.prototype.imsFetchAccounts = function(imsRef, clientId)
{
    var accounts = window.__adobe_cep__.imsFetchAccounts(imsRef, clientId);
    return accounts;
};

/**
* Requests an access token from IMS for a given user and service.
*
* This function is asynchronous. To handle the result, register a callback for the event
* "com.adobe.csxs.events.internal.ims.FetchAccessToken".
* @see addEventListener()
*
* @param imsRef         An IMS reference returned from the \c IMSConnect() call.
* @param clientID       The IMS client ID for your extension, assigned by the IMS team on registration.
*               This is the service-code value in the Renga Service Account Object for your client.
* @param clientSecret       The client secret associated with the provided client ID
* @param userAccountGuid    The unique person GUID for the Renga account, as returned by
                the <code>fetchAccounts()</code> method. The token is generated for this user.
* @param serviceAccountGuid (optional, not currently used) A unique identifier for a Service Account Object (SAO).
* @param scope          (optional) A comma delimited list of services for which the refresh and access tokens are requested.
                By default, this is 'openid,AdobeID'. Scope strings are case sensitive.
                If the cached version of the refresh token does not match the
                requested service scopes, a new refresh token is fetched.
                To request your service's own SAO, add your service to the list;
                for example,  'openid,AdobeID,browserlab'.
*/
IMSInterface.prototype.imsFetchAccessToken = function(imsRef, clientId, clientSecret, userAccountGuid, serviceAccountGuid, scope)
{
    window.__adobe_cep__.imsFetchAccessToken(imsRef, clientId, clientSecret, userAccountGuid, serviceAccountGuid, scope);
};

/**
 * Requests that IMS revoke a user's device token.
 * On success, this removes the user account from the current device.
 * The device token allows access to all services managed by the Adobe Application Manager (AAM),
 * so its removal affects all IMS-related services running on the device.
 *
 * This function is asynchronous. To handle the result, register a callback for the event
 * "com.adobe.csxs.events.internal.ims.FetchAccessToken".
 * @see addEventListener()
 *
 * @param imsRef        An IMS reference returned from the \c IMSConnect() call.
 * @param clientID      The IMS client ID for your extension, assigned by the IMS team on registration.
 *              This is the service-code value in the Renga Service Account Object for your client.
 * @param clientSecret      The client secret associated with the provided client ID
 * @param userAccountGuid   The unique person GUID for the Renga account, as returned by
                the <code>fetchAccounts()</code> method. The token is generated for this user.
* @param serviceAccountGuid (optional, not currently used) A unique identifier for a Service Account Object (SAO).
 */
IMSInterface.prototype.imsRevokeDeviceToken = function(imsRef, clientId, clientSecret, userAccountGuid, serviceAccountGuid)
{
    window.__adobe_cep__.imsFetchAccessToken(imsRef, clientId, clientSecret, userAccountGuid, serviceAccountGuid, "REVOKE");
};

/**
* Persists proxy credentials for an Adobe ID in the local store.
*
* @param proxyUsername The username for the Adobe ID credential. Must not be an empty string.
* @param proxyPassword The password for the Adobe ID credential. Must not be an empty string.
*/
IMSInterface.prototype.imsSetProxyCredentials = function(proxyUsername, proxyPassword)
{
    window.__adobe_cep__.imsSetProxyCredentials(proxyUsername, proxyPassword);
};

/**
* Launches the Adobe Application Manager (AAM) AIR application.
* If an error occurs when fetching an access token, this allows the user to
* log in with their Adobe ID credentials, or accept new terms of use.
*
* This function is asynchronous. To handle the result, register a callback for the event
* "com.adobe.csxs.events.internal.aam.AAMIMSStatus". The returned event contains
* an \c #AAMStatus object.
* @see addEventListener()
*
* @param clientID       The IMS client ID for your extension, assigned by the IMS team.
*               Matches the <code>serviceCode</code> value in the Service Account Object (SAO).
* @param clientSecret       The client secret associated with the provided client ID.
* @param redirectUri        The redirect URI registered with IMS
* @param userAccountGuid    The unique person GUID for the Renga account, as returned in the response
                to the <code>fetchAccounts()</code> method.
* @param serviceAccountGuid (optional, not currently used) A unique identifier for a Service Account Object (SAO).
* @param scope          (optional) A comma delimited list of services for which the refresh token was requested.
*/
IMSInterface.prototype.showAAM = function(clientId, clientSecret, redirectUri, userAccountGuid, serviceAccountGuid, scope)
{
    window.__adobe_cep__.showAAM(clientId, clientSecret, redirectUri, userAccountGuid, serviceAccountGuid, scope);
};

/**
* Retrieves the IMS user id that is currently logged in.
*
* Since 4.1.0
*
* @return The IMS user id for the currently logged in user.
*/
IMSInterface.prototype.imsGetCurrentUserId = function()
{
    var userId = window.__adobe_cep__.getCurrentImsUserId();
    return userId;
};


