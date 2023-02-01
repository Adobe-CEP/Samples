# Premiere Pro panels

*Last updated February 2023, to coincide with the  Premiere Pro 23.2 release, also known as "Premiere Pro 2023".*

## Create panels for Premiere Pro

### 1. Obtain and install these

- [Creative Cloud](http://creative.adobe.com). Use the Creative Cloud
    application to install Premiere Pro CC and other Adobe applications with
    which you'll be developing and testing, as well as ExtendScript Toolkit
    (available under 'previous versions').

- The [CEP Test
    Panel](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_11.x/Samples/CEP_HTML_Test_Extension-10.0)
    shows the full capabilities of CEP panels.

- The [PProPanel](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel)
    sample project is exhaustive in its exercise of Premiere Pro's ExtendScript
    API. If you're reading this, you likely already _have_ the PProPanel sample.
    
- [Microsoft Visual Studio Code](https://visualstudio.microsoft.com/vs/), and the [ExtendScript debugging extension](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug). This extension running in VSCode is Adobe's recommended ExtendScript development environment. Sorry, ExtendScript Toolkit; you had a good long run.

*Note: Creative Cloud Desktop handles >95% of all extension installation cases, and the Adobe Exchange Store can take your extension's directory as an input, and generate a .zxp file for you. However, it is often desirable to be able to test deployment on a local system, so we're still including links to the following stand-alone tools.*

- Use the [UPIA](https://helpx.adobe.com/creative-cloud/help/working-from-the-command-line.html) command line
    utility to test .zxp installation.

- The
    [ZXPSignCmd](https://github.com/Adobe-CEP/CEP-Resources/tree/master/ZXPSignCMD)
    signing utility creates signed .zxp bundles for Add-Ons or direct
    distribution.

### 2. Enable loading of unsigned panels

Further [relevant information](https://medium.com/adobetech/how-to-create-your-first-adobe-panel-in-6-easy-steps-f8bd4ed5778) is available from the Extensibility team.

*Note: Premiere Pro 23.x integrates CEP11, so even if you had unsigned panels
loading before (up to CEP10), you'll need to perform this step again, but for key CSXS.11.*

On MacOS, type the following into Terminal, then relaunch Finder (either via
rebooting, or from the Force Quit dialog):

```html
defaults write /Users/<username>/Library/Preferences/com.adobe.CSXS.11.plist PlayerDebugMode 1
```

On Windows, make the following registry entry (a new Key, of type String):

![Registry image](payloads/Registry.png)

### 3. Put panel into extensions directory

Put `/PProPanel` or your own panel's containing directory here, to have Premiere
Pro load it:

```html
Windows:    C:\Program Files (x86)\Common Files\Adobe\CEP\extensions

Mac:        /Library/Application Support/Adobe/CEP/extensions
```

*Note: That's the root /Library, not a specific user's ~/Library...*
### 4. Write and test your panel's JavaScript using a JavaScript debugger

Use Microsoft Visual Studio Code to debug your panel's JavaScript.

Optional diagnostics: Turn on CEP logging. Find CEP logs (distinct from Premiere
Pro's logs) here. Note that Mac Library path is the system's library, not the
user's. Also, note that logging WILL impact performance.

```html
Windows:    %\AppData\Local\Temp\csxs11-PPRO.log
Mac:        /Library/Logs/CSXS/csxs11-PPRO.log
```

Set logging level in Windows Registry (see above), or MacOS X .plist:

```html
defaults write /Users/<username>/Library/Preferences/com.adobe.CSXS.11.plist LogLevel 6
```

## 5. Create your panel's ExtendScript using Microsoft Visual Studio Code

Once you've installed the ExtendScript debugging extension, you can set breakpoints in your ExtendScript code within VSCode. 


Here's a [screen video](https://shared-assets.adobe.com/link/8c35be84-22fb-40fa-7715-b3fd94f474a6)
showing how to debug panels at both the JavaScript and ExtendScript levels.

## 6. Package and deploy your panel

Further [relevant information](https://github.com/Adobe-CEP/Getting-Started-guides/tree/master/Package%20Distribute%20Install) is available from the Extensibility team.

### Scenario 1 : The common case

For extensions deployed exclusively via Creative Cloud Desktop, submitting your extension to the Adobe Exchange Store is all you need to do; the Store will generate a cross-platform .zxp file with which your extension can be installed, and Creative Cloud Desktop will take care of extension configuration management, across your Creative Cloud systems.

### Scenario 2 : Enabling other installation methods

You can either generate a self-signed certificate (ZXPSignCmd will make them for you), or get one from a commercial security provider. Here's an example:

```bash
./ZXPSignCmd -selfSignedCert US California Adobe "Bruce Bullis" TotallySecurePassword certificate.p12
```

To sign directory `/PanelDir` with `certificate.p12`, do the following:

```bash
./ZXPSignCmd -sign panelDir/ PanelName.zxp certificate.p12 password -tsa http://timestamp.digicert.com/
```

Submit your panel to the [Adobe Add-Ons
site](https://www.adobeexchange.com/producer) for approval, and distribution.
You can also directly supply the .zxp file enterprise customers, and those who
do not connect their systems to the public internet, for installation using
[UPIA](https://helpx.adobe.com/creative-cloud/help/working-from-the-command-line.html), the command line version
of Extension Manager.

If you encounter any issues with the Add-Ons store or ExManCmd, please [contact
the Add-Ons team](mailto:avetting@adobe.com).

## Previous Updates

*Note: As we work toward providing UXP-based extensibility, we've stopped additional work on the ExtendScript API.*
