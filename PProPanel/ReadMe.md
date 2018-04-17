# Create panels for Premiere Pro

*Last updated April 2018, current released version = Premiere Pro 12.1, also known as "Premiere Pro CC 2018".

## What's Possible

For the impatient, here are links to working sample code, showing what's
possible for Premiere Pro panels:

- [Browse and import files from the
    OS](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L260)

- [Get and set all XMP
    metadata](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L601)
    (including Premiere Pro's [private project
    metadata](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L765))
    for any projectItem.

- [Import files via drag and
    drop](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/ext.js#L43),
    from a panel into Premiere Pro (Project panel, or directly onto a timeline).

- [Preview any supported media in the Source
    monitor](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L231)
    (without requiring that it be imported into the project).

- Access and modify [clip
    markers](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L727),
    and [sequence
    markers](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L163).

- [Create new
    sequences](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L428)
    either from a preset, or with user interaction.

- [Open different
    projects](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L370)
    (while the panel remains active; this behavior is new as of Premiere Pro
    10.3).

- [Render a
    sequence](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L492)
    to any destination(s), based on any preset(s), including ftp upload, and
    controlling metadata output.

- Export either a [given
    sequence](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L206)
    or the entire project as Final Cut Pro 7 XML.

- [Save as a new
    project](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L581),
    or create a new project containing only a specified sequence and its
    constituent media.

# Premiere Pro 12.1 : API Improvements

We've added many new capabilities for the 12.1 release. All of these are exercised in the PProPanel sample, [available on GitHub](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel).

### Get and set the current Project panel selection

It's now possible for a panel to know which `projectItems` are selected, and to select projectItems as appropriate.

### Consolidate and Transcode API

All functionality available from Premiere Pro's Project Manager dialog, is now available to panels.

### Improved time resolution for trackItems

We now provide (and accept) time values for track items in ticks, eliminating an opportunity for rounding error.

### Import and change Motion Graphics templates (.mogrts)

Panels can now insert .mogrt files into sequences, and change the parameters of those .mogrts as desired.

### Forcibly replace footage

It's now possible to force Premiere Pro to update the path to a given `projectItem`, even if Premiere Pro doesn't think such a change is advisable.

### Identify sequences

All `projectItems` now have an `isSequence()` method; this eliminates the need to compare a list of 'all project items' against a list of 'all sequences', to determine which `projectItems` are and are not sequences.

### Set the frame rate for projectItems

Use the handy new `setOverrideFramerate()`.

### API Documentation

While the sample panel should continue to be your first option for working example code, Premiere Pro's ExtendScript API [is documented here](http://ppro.aenhancers.com), to enable developer participation.


## What was new in 12.0

- We've extended our new, not-in-the-QE-DOM Source monitor object, to close the [front-most](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L1465) or [all open clips](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L1469).

- [Change the Label](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L1473) assigned to projectItems.

- Query PPro for the [current insertion bin](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L1486), the default target for items imported into the project (but not via drag). *Previously, you could set, but not get, the insertion bin.*

- [Import Compositions](https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/PPRO/Premiere.jsx#L1502) by name, from After Effects projects.

- Open PPro's Events panel to see PProPanel's feedback; I've minimized modal alerts.

## 1. Obtain and install these

- [Creative Cloud](http://creative.adobe.com). Use the Creative Cloud
    application to install Premiere Pro CC and other Adobe applications with
    which you'll be developing and testing, as well as ExtendScript Toolkit
    (available under 'previous versions').

- The [CEP Test
    Panel](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_8.x/Samples/CEP_HTML_Test_Extension-8.0)
    shows the full capabilities of CEP panels.

- The [PProPanel](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel)
    sample project is exhaustive in its exercise of Premiere Pro's ExtendScript
    API.

- The
    [ZXPSignCmd](https://github.com/Adobe-CEP/CEP-Resources/tree/master/ZXPSignCMD/4.0.7)
    signing utility creates signed .zxp bundles for Add-Ons or direct
    distribution.

- Use the [ExManCmd](https://www.adobeexchange.com/resources/28) command line
    utility to test .zxp installation.

## 2. Enable loading of unsigned panels

*Note: Premiere Pro 12.0 has integrated CEP8, so even if you had unsigned panels
loading before (using CEP6 or CEP7), you'll need to perform this step again, but for key CSXS.8.*

On Mac, type the following into Terminal, then relaunch Finder (either via
rebooting, or from the Force Quit dialog):

```html
defaults write /Users/<username>/Library/Preferences/com.adobe.CSXS.8.plist PlayerDebugMode 1
```

On Windows, make the following registry entry (a new Key, of type String):

![Registry image](payloads/Registry.png)

## 3. Put panel into extensions directory

Put `/PProPanel` or your own panel's containing directory here, to have Premiere
Pro load it:

```html
Windows:    C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
Mac:        /Library/Application Support/Adobe/CEP/extensions
```

## 4. Write and test your panel's JavaScript using Chrome debugger

To enable debugging of panels using Chrome’s developer tools, put a file named
`.debug` into your extension’s folder (as a peer of the `/CSXS` folder). The
contents of the file should resemble the following (and the Extension ID must
match the one in the panel's manifest):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
    <Extension Id="com.example.PProPanel">
        <HostList>
            <Host Name="PPRO" Port="7777"/>
        </HostList>
    </Extension>
</ExtensionList>
```

When the panel is active, you can debug the panel in your web browser by
browsing to `localhost:7777`, and selecting your panel:

![Localhost screenshot](payloads/localhost.png)

Optional diagnostics: Turn on CEP logging. Find CEP logs (distinct from Premiere
Pro's logs) here. Note that Mac Library path is the system's library, not the
user's. Also, note that logging WILL impact performance.

```html
Windows:    %\AppData\Local\Temp\csxs8-PPRO.log
Mac:        /Library/Logs/CSXS/csxs8-PPRO.log
```

Set logging level in Windows Registry (see above), or MacOS X .plist:

```html
defaults write /Users/<username>/Library/Preferences/com.adobe.CSXS.7.plist LogLevel 6
```

## 5. Create your panel's ExtendScript using ExtendScript Toolkit (ESTK)

Launch ExtendScript Toolkit, select the correct version of Premiere Pro from the
drop-down menu, then then click the chain link to connect.

![ESTK Screenshot](payloads/estk.png)

Once in the session, you can hit breakpoints, and use ExtendScript Toolkit's
Data Browser to view the ExtendScript DOM.

Here's a [screen video](https://www.dropbox.com/s/lwo8jg0klxkq91s/walkthru.mp4)
showing how to debug panels at both the JavaScript and ExtendScript levels.

## 6. Package and deploy your panel

You can either generate a self-signed certificate (ZXPSignCmd will make them for
you), or get one from a commercial security provider. Here's an example:

```bash
	./ZXPSignCmd -selfSignedCert US California Adobe "Bruce Bullis" password certificate.p12
```

To sign directory `/PanelDir` with `certificate.p12`, do the following:

```bash
    ./ZXPSignCmd -sign panelDir/ PanelName.zxp certificate.p12 password -tsa http://timestamp.digicert.com/
```

Submit your panel to the [Adobe Add-Ons
site](https://www.adobeexchange.com/producer) for approval, and distribution.
You can also directly supply the .zxp file enterprise customers, and those who
do not connect their systems to the public internet, for installation using
[ExManCmd](https://www.adobeexchange.com/resources/28), the command line version
of Extension Manager.

If you encounter any issues with the Add-Ons store or ExManCmd, please [contact
the Add-Ons team](mailto:jferman@adobe.com).
