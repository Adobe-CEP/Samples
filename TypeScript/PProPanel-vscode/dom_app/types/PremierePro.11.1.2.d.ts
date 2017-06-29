// Type declarations for Premiere Pro API
// Initial declarations by: Eric Robinson <eric@sonicbloom.io>

declare var app: App;

/**
 * 0 = false,
 * 1 = true
 */
type NumericalBool = 0 | 1;
type MediaType = "Video" | "Audio";
type SampleRateOption = 48000 | 96000;
type BitsPerSampleOption = 16 | 24;
type SDKEventType = "warning" | "info" | "error";

/**
 * 0 = AIFF,
 * 1 = WAV
 */
type AudioFileFormat = 0 | 1;

/**
 * 0 = export entire files,
 * 1 = export subsetted files
 */
type TrimFilesOption = 0 | 1;

/**
 * 0 = Integer,
 * 1 = Real,
 * 2 = Text,
 * 3 = Boolean
 */
type MetadataPropertyType = 0 | 1 | 2 | 3;

/**
 * Accepted values for the ProjectItemType input.
 * 
 * 1 = Clip (see: ProjectItemType.CLIP),
 * 2 = Bin (see: ProjectItemType.BIN),
 * 3 = Root (see: ProjectItemType.ROOT),
 * 4 = File (see: ProjectItemType.FILE)
 */
type ProjectItemTypeOptions = 1 | 2 | 3 | 4;

/**
 * 0 = entire sequence (see: Encoder.ENCODE_ENTIRE),
 * 1 = in to out points (see: Encoder.ENCODE_IN_TO_OUT),
 * 2 = work area (see: Encoder.ENCODE_WORKAREA)
 */
type EncoderOptions = 0 | 1 | 2;

declare class PremiereObject extends Object
{
    // These appear to be unique to PremiereObject classes.
    bind(eventName: string, func: any): void;
    setTimeout(eventName: string, func: any, milliseconds: number): void;
    unbind(eventName: string): void;
}

/**
 * @class Time
 * 
 * TODO: Get this API filled out from other API docs. 
 */
declare class Time extends PremiereObject
{
    seconds: number;
    ticks: string;
}

declare class Sequence extends PremiereObject
{
    readonly id: number;
    name: string;
    readonly sequenceID: string;

    readonly projectItem: ProjectItem;
    readonly audioTracks: TrackCollection;
    readonly videoTracks: TrackCollection;
    readonly markers: MarkerCollection;
    
    readonly frameSizeHorizontal: number;
    readonly frameSizeVertical: number;

    readonly end: string;

    /**
     * Expressed in ticks; there are 254016000000 ticks per second.
     */
    readonly timebase: string;
    readonly zeroPoint: string;

    /**
     * Attaches a custom property, and value, to the sequence. This property is visible if/when the sequence is exported to FCP XML.
     */
    attachCustomProperty(propertyID: string, propertyValue: string): void;
    /**
     * Returns a duplicate of the sequence, with " Clone" appended to the new sequence's name.
     */
    clone(): void;
    /**
     * Creates a new .prproj file containing only this sequence and its constituent media items.
     */
    exportAsProject(exportPath: string): void;
    /**
     * Creates a new FCP XML file containing only this sequence and its constituent media items.
     */
    exportAsFinalCutProXML(exportPath: string, suppressUI: NumericalBool): boolean;
    /**
     * Renders the sequence to the specified output path, using the specified path. workAreaType can be ENCODE_WORKAREA, ENCODE_ENTIRE, or ENCODE_IN_TO_OUT.
     */
    exportAsMediaDirect(outputFilePath: string, presetPath: string, workAreaType?: EncoderOptions): string;
    /**
     * Returns time of sequence's in point, in seconds.
     */
    getInPoint(): string;
    /**
     * Returns time of sequence's out point, in seconds.
     */
    getOutPoint(): string;
    /**
     * Sets the in point of the sequence; '6.234'.
     */
    setInPoint(seconds: number): void;
    /**
     * Sets the in point of the sequence; '12.321'.
     */
    setOutPoint(seconds: number): void;
    /**
     * pos is a timecode as a string.
     * Sets the CTI to the specified timecode value; '00;00;11;23'.
     */
    setPlayerPosition(pos: string): void;
    /**
     * Sets the starting timecode of the sequence.
     */
    setZeroPoint(ticks: string): void;
}

declare class SequenceCollection extends PremiereObject
{
    readonly numSequences: number;
    [n: number]: Sequence;
}

declare class Track extends PremiereObject
{
    readonly clips: TrackItemCollection;
    readonly id: number;
    readonly mediaType: string;
    readonly transitions: TrackItemCollection;

    /**
     * Inserts the specified clip at the given time, shifting any pre-existing
     * clips further down behind it. If the time is specified in the middle of
     * a pre-existing clip, it will split that clip at the time specified and
     * add the clipToInsert between the two parts. Time is specified in seconds.
     * @param clipToInsert The clip to insert.
     * @param timeInSeconds The time in seconds at which to insert the clip.
     */
    insertClip(clipToInsert: ProjectItem, timeInSeconds: number): void;
    /**
     * Inserts the specified clip at the given time, shifting any pre-existing
     * clips further down behind it. If the time is specified in the middle of
     * a pre-existing clip, it will split that clip at the time specified and
     * add the clipToInsert between the two parts. Time is specified in timecode
     * format, e.g. "00;00;00;00" (hh;mm;ss;ff).
     * @param clipToInsert The clip to insert.
     * @param timeCode The time at which to insert the clip.
     */
    insertClip(clipToInsert: ProjectItem, timeCode: string): void;
    /**
     * Returns 1 if the track is muted, 0 if not.
     */
    isMuted(): boolean;

    /**
     * Adds the specified clip to the Track at the specified time. Pre-existing
     * clips in the Track are not shifted but overwritten by the clip. Time is
     * specified in seconds.
     * @param clipToWrite The clip to insert.
     * @param timeInSeconds The time in seconds at which to add the clip.
     */
    overwriteClip(clipToWrite: ProjectItem, timeInSeconds: number): void;
    // TODO: VERIFY THE FOLLOWING ENTRY!!! ASSUMED BASED ON INSERTCLIP.
    /**
     * Adds the specified clip to the Track at the specified time. Pre-existing
     * clips in the Track are not shifted but overwritten by the clip. Time is
     * specified in timecode format, e.g. "00;00;00;00" (hh;mm;ss;ff).
     * @param clipToWrite The clip to insert.
     * @param timeCode The time at which to add the clip.
     */
    overwriteClip(clipToWrite: ProjectItem, timeCode: string): void
    /**
     * Pass 1 to mute the track, 0 to un-mute.
     */
    setMute(arg1?: NumericalBool): void;
}

/**
 * A collection of tracks, for iteration.
 */
declare class TrackCollection extends PremiereObject
{
    /**
     * The number of tracks (of either audio or video, depending on the collection) available.
     */
    readonly numTracks: number;

    [n: number]: Track;
}

declare class TrackItem extends PremiereObject
{
    readonly components: ComponentCollection;
    /**
     * The projectItem corresponding to the track item.
     */
    readonly projectItem: ProjectItem;
    /**
     * Returns the type of track item.
     */
    readonly type: number;
    /**
     * Either video or audio.
     */
    readonly mediaType: MediaType;
    readonly duration: Time;
    /**
     * The start time of the clip, in sequence time.
     */
    readonly start: Time;
    /**
     * The end time of the clip, in sequence time.
     */
    readonly end: Time;
    readonly inPoint: Time;
    readonly outPoint: Time;

    getLinkedItems(): TrackItemCollection;
    isSelected(): boolean;
    setSelected(isSelected: NumericalBool, updateUI?: NumericalBool): void;
}

declare class TrackItemCollection extends PremiereObject
{
    readonly numItems: number;

    [n: number]: TrackItem;
}

/**
 * Markers are temporal metadata, potentially with duration, and of specifiable type. Some fields are only meaningful for some marker types.
 */
declare class Marker extends PremiereObject
{
    /**
     * The comments (if any) contained within the marker, as a string. Read/Write.
     */
    comments: string;
    /**
     * A Time object representing the start time of the marker. Read/Write.
     */
    start: Time;
    /**
     * A Time object representing the end time of the marker. Read/Write.
     */
    end: Time;
    /**
     * The marker's name, as a string. Read/Write.
     */
    name: string;
    /**
     * The type of the marker, as a string. Read/Write.
     */
    type: string;

    /**
     * Returns the web link frame target (if any) of the marker, as a string.
     */
    getWebLinkFrameTarget(): string;
    /**
     * Returns the web link URL (if any) of the marker, as a string.
     */
    getWebLinkURL(): string;
    /**
     * Sets the type of the marker to Chapter.
     */
    setTypeAsChapter(): void;
    /**
     * Sets the type of the marker to Comment.
     */
    setTypeAsComment(): void;
    /**
     * Sets the type of the marker to Segmentation.
     */
    setTypeAsSegmentation(): void;
    /**
     * Sets the type of the marker to WebLink.
     */
    setTypeAsWebLink(url: string, frameTarget: string): void;
}

/**
 * Marker collections contain the markers associated with a given projectItem, or sequence.
 * For project items corresponding to sequences, the collection will reference sequence
 * markers, and be obtained from the sequence object; for project items corresponding to
 * media, the collection will reference clip markers, and be obtained from a project item.
 */
declare class MarkerCollection extends PremiereObject
{
    /**
     * How many markers are associated with this item.
     */
    readonly numMarkers: number;

    /**
     * Returns a new marker at the start time specified, defaulting to marker type 'Comment', and duration 0.
     */
    createMarker(time: number): Marker;
    /**
     * Returns a new marker at the start time specified, defaulting to marker type 'Comment', and duration 0.
     */
    deleteMarker(marker: Marker): void;
    /**
     * Returns the (temporally) first marker from the marker collection. Use this to begin iteration.
     */
    getFirstMarker(): Marker;
    /**
     * Returns the (temporally) last marker from the marker collection.
     */
    getLastMarker(): Marker;
    /**
     * Returns the marker (temporally) subsequent to the specified marker, from the marker collection.
     */
    getNextMarker(marker: Marker): Marker;
    /**
     * Returns the marker (temporally) prior to the specified marker, from the marker collection.
     */
    getPrevMarker(marker: Marker): Marker;

    [n: number]: Marker;
}

/**
 * A class that contains constants that may be used for ProjectItemType settings.
 */
declare class ProjectItemType extends PremiereObject
{
    /**
     * The item is a clip. The stored value is 1.
     */
    static readonly CLIP: 1;
    /**
     * The item is a bin. The stored value is 2.
     */
    static readonly BIN: 2;
    /**
     * The item is the root. The stored value is 3.
     */
    static readonly ROOT: 3;
    /**
     * The item is a file. The stored value is 4.
     */
    static readonly FILE: 4;
}

/**
 * All items in Premiere Pro's project are represented by projectItem objects.
 */
declare class ProjectItem extends PremiereObject
{
    /**
     * This is a ProjectItemCollection referencing the children (if any) of this item; only valid for bins.
     */
    readonly children: ProjectItemCollection | undefined;
    /**
     * The name of the projectItem, as a string. Read/Write.
     */
    name: string;
    /**
     * The projectItem's position within the project 'tree'; not guaranteed to be unique forever.
     */
    readonly nodeId: string;
    /**
     * The path to the projectItem, within the project.
     */
    readonly treePath: string;
    /**
     * The type of the projectItem; will be 1 = bin, 2 = clip, 3 = file, or 4 = root.
     */
    readonly type: ProjectItemTypeOptions;
    /**
     * This value is only defined for instances with type clip.
     * TODO: Verify.
     */
    readonly videoComponents: ComponentCollection | undefined;
    
    /**
     * Attaches the media Premiere Pro finds at mediaPath, as the new proxy path for this projectItem. If isHiRes is 1, mediaPath is assigned as the new full resolution path.
     */
    attachProxy(mediaPath: string, isHiRes: NumericalBool): boolean;
    /**
     * Returns true if the media path for this projectItem can be changed; false if not..
     */
    canChangeMediaPath(): boolean;
    /**
     * Returns true if a proxy can be attached to this projectItem.
     */
    canProxy(): boolean;
    /**
     * Changes the media referenced by the projectItem to the media Premiere Pro finds at mediaPath.
     */
    changeMediaPath(mediaPath: string): boolean;
    /**
     * Returns a new 'child' bin, as named.
     */
    createBin(name: string):ProjectItem;
    /**
     * Returns a new bin, based on the specified query.
     */
    createSmartBin(name: string, query: string):ProjectItem;
    createSubClip(name: string, startTime: Object, endTime: Object, hasHardBoundaries: number, takeVideo?: NumericalBool, takeAudio?: NumericalBool): ProjectItem;
    /**
     * Deletes the bin (the same bin, of which this is a method) from the project.
     */
    deleteBin(): void;
    /**
     * Searches the Project for ProjectItems (of type CLIP and FILE) that have a media path (file system path)
     * that contains the string specified in matchString. E.g. file or folder name, partial folder
     * hierarchy, etc.
     * @param matchString String to search for.
     * @param ignoreSubclips Whether or not to ignore subclips.
     */
    findItemsMatchingMediaPath(matchString: string, ignoreSubclips?: NumericalBool): Array<ProjectItem>;
    /**
     * Returns the MarkerCollection associated with the projectItem; if there are no markers, this will return undefined.
     */
    getMarkers(): MarkerCollection;
    /**
     * The media path is the file system path at which the media (CLIP, etc.) represented by the ProjectItem exists.
     */
    getMediaPath(): string;
    /**
     * Returns Premiere Pro's private project metadata, associated with the 'projectItem', as a string.
     */
    getProjectMetadata(): string;
    getProxyPath(): string;
    /**
     * Returns the XMP metadata associated with the projectItem, as a string.
     */
    getXMPMetadata(): string;
    /**
     * Returns true if a proxy is already attached to this projectItem.
     */
    hasProxy(): boolean;
    /**
     * Moves the projectItem to the new parent bin, within the project.
     */
    moveBin(destination: ProjectItem): void;
    /**
     * Makes Premiere Pro reload the media, from disk.
     */
    refreshMedia(): string;
    /**
     * Changes the name of this bin, as specified.
     */
    renameBin(name: string): boolean;
    select(): void;
    setOverridePixelAspectRatio(numerator: number, denominator: number): boolean;
    /**
     * Adds or updates the specified fields within Premiere Pro's private project metadata, to the new value(s) specified.
     */
    setProjectMetadata(buffer: string): void;
    setScaleToFrameSize(): void;
    /**
     * Unconfirmed: arg1 is likely a @type {Time} instance.
     */
    setStartTime(arg1: Object): void;
    /**
     * Replaces any existing XMP metadata with the new data specified. Note: This includes marker data.
     */
    setXMPMetadata(buffer: string): boolean;
    startTime(): Time;
}

declare class ProjectItemCollection extends PremiereObject
{
    readonly numItems: number;

    [n: number]: ProjectItem;
}

declare class Encoder extends PremiereObject
{
    /**
     * The stored value is 0.
     */
    readonly ENCODE_ENTIRE: 0;
    /**
     * The stored value is 1.
     */
    readonly ENCODE_IN_TO_OUT: 1;
    /**
     * The stored value is 2.
     */
    readonly ENCODE_WORKAREA: 2;

    /**
     * According to the Object Model Viewer, the removeOnCompletion parameter is optional and has a default value of 0. The startTime and endTime parameters, however, have no such notes. Also, are startTime and stopTime @type {Time} instances? 
     */
    encodeFile(inputFilePath: string, outputFilePath: string, presetPath: string, removeOnCompletion: NumericalBool, startTime: Object, stopTime: Object): string;
    /**
     * @param {number} WorkAreaType - Default Value 0.
     * @param {number} removeOnCompletion - Default Value 0.
     */
    encodeProjectItem(projectItem: ProjectItem, outputFilePath: string, presetPath: string, WorkAreaType?: EncoderOptions, removeOnCompletion?: NumericalBool): string;
    /**
     * Renders the specified sequence, using the specified output preset, to the specified
     * output path, with options. Returns the jobID of the encoder job started for the
     * specified sequence. workAreaType values:
     *  0 = entire sequence,
     *  1 = in to out points,
     *  2 = work area.
     * If removeFromQueueWhenComplete is 1, the job will be removed from the Adobe Media
     * Encoder queue upon completion. This can prevent out-of-memory problems when
     * performing many renders.
     */
    encodeSequence(sequence: Sequence, outputFilePath: string, presetPath: string, WorkAreaType?: EncoderOptions, removeOnCompletion?: NumericalBool): string;
    /**
     * Launches Adobe Media Encoder. This can take a while, so if you're going to render using AME, call this early.
     */
    launchEncoder(): boolean;
    /**
     * Pass 0 to disable or 1 to enable the embedding of XMP into output files.
     */
    setEmbeddedXMPEnabled(enable: NumericalBool): void;
    /**
     * Pass 0 to disable or 1 to enable the writing of XMP into 'side car' files. Premiere Pro decides whether to embed metadata or write it into a side car, based on the specified output format. To prevent the writing of ANY metadata, set both of these to 0.
     */
    setSidecarXMPEnabled(enable: NumericalBool): void;
    /**
     * Returns 1 if Premiere Pro successfully started Adobe Media Encoder's batch encoding list, 0 if not.
     */
    startBatch(): boolean;
}

declare class Project extends PremiereObject
{
    /**
     * The currently active sequence, if there is one.
     */
    activeSequence: Sequence;
    readonly documentID: string;
    readonly name: string;
    readonly path: string;
    /**
     * The root projectItem, for iteration purposes.
     */
    readonly rootItem: ProjectItem;
    /**
     * An array of all sequences available in the entire project.
     */
    readonly sequences: SequenceCollection;
    
    /**
     * Returns 1 if Premiere Pro created the new property. Returns 0 if that property already
     * existed. Supported propertyType values:
     *  0 = integer,
     *  1 = Real,
     *  2 = Text,
     *  3 = Boolean.
     */
    addPropertyToProjectMetadataScheme(name: string, label: string, type: MetadataPropertyType): boolean;
    /**
     * Returns 0 if Premiere Pro successfully closes the current project.
     */
    closeDocument(): boolean;
    /**
     * Returns 0 if Premiere Pro successfully imports a sequence with the specified name and ID.
     */
    createNewSequence(sequenceName: string, placeholderID: string): void;
    deleteAsset(): void;
    /**
     * Returns true if Premiere Pro successfully deleted a sequence with the specified ID.
     */
    deleteSequence(sequence: Sequence): boolean;
    /**
     * Exports the specified sequence to AAF, using specified settings. Returns 0 if Premiere Pro successfully exports the specified sequence to AAF.
     *  - sequenceToExport : sequenceID
     *  - filePath: save .aaf file here
     *  - mixDownVideo: 0 or 1; if 1, render video
     *  - explodeToMono: 0 or 1; if 1, break audio out into mono channels
     *  - sampleRate: 48000 or 96000
     *  - bitsPerSample: 16 or 24
     *  - embedAudio: 0 or 1; if 1, audio is embedded.
     *  - audioFileFormat: 0 = AIFF, 1 = WAV
     *  - trimSources: 0 = export entire files, 1 = export subsetted files
     *  - handleFrames: specify 0 to 1000 extra 'handle' frames
     */
    exportAAF(sequence: Sequence, filePath: string, mixDownVideo: NumericalBool, explodeToMono: NumericalBool, sampleRate: SampleRateOption, bitsPerSample: BitsPerSampleOption, embedAudio: NumericalBool, audioFileFormat: AudioFileFormat, trimSources: TrimFilesOption, handleFrames: number): number;
    /**
     * Returns 0 if Premiere Pro successfully exports the current project to the specified path. If supressUI is true, no warnings will be displayed.
     */
    exportFinalCutProXML(exportPath: string, suppressUI: NumericalBool): boolean;
    /**
     * Exports the specified sequence to OMF, using specified settings. Returns 0 if Premiere Pro successfully exports the specifed sequence to OMF.
     *  - sequenceToExport : sequenceID
     *  - filePath: save .omf file here
     *  - OMFTitle: title to use in .omf file
     *  - sampleRate: 48000 or 96000
     *  - bitsPerSample: 16 or 24
     *  - audioEncapsulated: 0 or 1; if 1, audio is embedded.
     *  - audioFileFormat: 0 = AIFF, 1 = WAV
     *  - trimAudioFiles: 0 = export entire file, 1 = export a subset file
     *  - handleFrames: specify 0 to 1000 extra 'handle' frames of audio
     *  - includePan: 0 or 1; if 1, include pan position information
     */
    exportOMF(sequence: Sequence, filePath: string, OMFTitle: string, sampleRate: SampleRateOption, bitsPerSample: BitsPerSampleOption, audioEncapsulated: NumericalBool, audioFileFormat: AudioFileFormat, trimAudioFiles: TrimFilesOption, handleFrames: number, includePan: NumericalBool): number;
    /**
     * Returns 0 if Premiere Pro successfully renders the current active sequence using an Export Controller plug-in with the specified name.
     */
    exportTimeline(exportControllerName: string): number;
    getInsertionBin(): ProjectItem;
    /**
     * Returns 0 if Premiere Pro successfully imports the array of file paths. If suppressUI is true, no UI will be presented. if importAsNumberedStills is true, Premiere Pro will attempt to import the array as a still image sequence.
     */
    importFiles(arg1: any): boolean;
    importFiles(arrayOfFilePathsToImport: Array<string>, suppressUI?: boolean, importAsNumberedStills?: boolean): boolean;
    /**
     * Returns 0 if Premiere Pro successfully imports the sequences with IDs specified, from that project.
     */
    importSequences(arg1: any): boolean;
    importSequences(pathToProjectFile: string, arrayOfSeqIDsToImport: Array<number>): boolean;
    /**
     * Returns true if Premiere Pro was able to activate the sequence with the specified ID.
     */
    openSequence(sequenceID: string): boolean;
    /**
     * Returns 0 if Premiere Pro successfully pauses, or un-pauses, growing files. 1 = pause, 0 = grow.
     */
    pauseGrowing(pausedOrNot: NumericalBool): boolean;
    /**
     * For Creative Cloud Libraries usage only. Ignore.
     */
    placeAsset(arg1: any): boolean;
    /**
     * Returns 0 if Premiere Pro successfully saves the current project.
     */
    save(): void;
    /**
     * Returns 0 if Premiere Pro successfully saves the current project to saveAsPath.
     */
    saveAs(saveAsPath: string): boolean;
}

declare class App extends PremiereObject
{
    /**
     * Anywhere object; only valid when connected to an Anywhere server.
     */
    readonly anywhere: Anywhere;
    readonly build: string;
    readonly csxs: Csxs;
    /**
     * Encoder object, used to drive Adobe Media Encoder for background rendering (on the same system).
     */
    readonly encoder: Encoder;
    readonly getAppPrefPath: string;
    readonly getAppSystemPrefPath: string;
    /**
     * Returns the path containing the preferences currently in use.
     */
    readonly getPProPrefPath: string;
    /**
     * Returns the user's Creative Cloud profile directory, where PPremiere ProPro keeps other settings and configuration files.
     */
    readonly getPProSystemPrefPath: string;
    readonly metadata: Metadata;
    /**
     * Project object.
     */
    readonly project: Project;
    /**
     * The Creative Cloud User's GUID.
     */
    readonly userGuid: string;
    /**
     * The version of Premiere Pro currently running.
     */
    readonly version: string;
    
    broadcastPrefsChanged(preferencesThatChanged: string): boolean;
    /**
     * Enables the QE DOM. See: https://forums.adobe.com/message/8070757#8070757.
     */
    enableQE(): boolean;
    getEnableProxies(): NumericalBool;
    /**
     * Returns true if Premiere Pro can open the file to test.
     */
    isDocument(filePath: string): boolean;
    /**
     * Returns true if Premiere Pro currently has a project open.
     */
    isDocumentOpen(): boolean;
    openDocument(): boolean;
    /**
     * Returns true if Premiere Pro can open the file as a new project.
     */
    openFCPXML(): boolean;
    openFCPXML(fileToOpen: string): boolean;
    /**
     * Quits Premiere Pro.
     */
    quit(): void;
    setEnableProxies(enable: NumericalBool): boolean;
    setExtensionPersistent(extensionID: string, state?: number): void;
    /**
     * Returns true if Premiere Pro successfully added the message to the Events panel. Potential values for eventType are warning, info and error.
     */
    setSDKEventMessage(value: string, eventType: SDKEventType): boolean;
    /**
     * Returns true if Premiere Pro was able to change the specified scratch disk path to the new value. Potential values for type:
     *  - ScratchDiskType.FirstAudioCaptureFolder
     *  - ScratchDiskType.FirstAudioPreviewFolder
     *  - ScratchDiskType.FirstAutoSaveFolder
     *  - ScratchDiskType.FirstCCLibrariesFolder
     *  - ScratchDiskType.FirstVideoCaptureFolder
     *  - ScratchDiskType.FirstVideoPreviewFolder
     */
    setScratchDisk(value: string, type: string): boolean;
    trace(message: string): void;
}

declare class Anywhere extends PremiereObject
{
    /**
     * Returns token as string, if available.
     */
    getAuthenticationToken(): string;
    /**
     * Returns url of active sequence, if available.
     */
    getCurrentEditingSessionActiveSequenceURL(): string;
    /**
     * Returns url as string, if available.
     */
    getCurrentEditingSessionSelectionURL(): string;
    /**
     * Returns url as string, if available.
     */
    getCurrentEditingSessionURL(): string;
    /**
     * Returns true if there is currently a production open.
     */
    isProductionOpen(): boolean;
    /**
     * Returns an array of urls to productions, if available.
     */
    listProductions(): RemoteProductionCollection;
    /**
     * Returns 1 if Premiere Pro successfully opens the production's url.
     */
    openProduction(inProductionURL: string): boolean;
    /**
     * Returns 1 if Premiere Pro successfully logs the specifed user into the server, using the token.
     */
    setAuthenticationToken(inEAServer: string, inEAUsername: string, inEAAuthToken: string): boolean;
}

declare class RemoteProduction extends PremiereObject
{
    readonly description: string;
    readonly name: string;
    readonly url: string;
}

declare class RemoteProductionCollection extends PremiereObject
{
    readonly numProductions: number;

    [n: number]: RemoteProduction;
}

declare class ScratchDiskType extends PremiereObject
{
    readonly FirstAudioCaptureFolder: string;
    readonly FirstAudioPreviewFolder: string;
    readonly FirstAutoSaveFolder: string;
    readonly FirstCClibrariesFolder: string;
    readonly FirstVideoCaptureFolder: string;
    readonly FirstVideoPreviewFolder: string;
}

/**
 * Avoid; use project object instead.
 */
declare class Document extends PremiereObject
{
    getFilePath(): string;
    importFiles(arg1: any): boolean;
}

declare class Metadata extends PremiereObject
{
    readonly getMetadata: string;

    addMarker(): void;
    deleteMarker(): void;
    setMarkerData(): void;
    setMetadataValue(): void;
    updateMarker(): void;
}

declare class Csxs extends PremiereObject
{
    readonly resourceCentral: CsxsResourceCentral;
}

declare class CsxsResourceCentral extends PremiereObject
{
    getBrightness(): string;
    openURL(urlString: string): void;
    validateClient(token: string): boolean;
}

// WARNING! These classes do not exist in the Object Model Viewer.
//  APIs were taken from looking at the reflection info during a
//  debugging session.

declare class ComponentCollection extends PremiereObject
{
    readonly numItems: number;

    // WARNING! This functionality is only assumed to exist!
    [n: number]: Component;
}

declare class Component extends PremiereObject
{
    readonly displayName: string;
    readonly matchName: string;
    readonly properties: ComponentParamCollection;
}

declare class ComponentParamCollection extends PremiereObject
{
    readonly numItems: number;

    // WARNING! This functionality is only assumed to exist!
    [n: number]: ComponentParam;
}

declare class ComponentParam extends PremiereObject
{
    readonly displayName: string;

    addKey(): void;
    areKeyframesSupported(): boolean;
    findNearestKey(): void;
    findNextKey(): void;
    findPreviousKey(): void;
    getKeys(): Array<Time>;
    getValue(): number;
    getValueAtKey(): void;
    isEmpty(): boolean;
    isTimeVarying(): boolean;
    keyExistsAtTime(): boolean;
    removeKey(): void;
    removeKeyRange(startTimeSeconds:number, endTimeSeconds: number, shouldUpdateUI: boolean): void;
    setInterpolationTypeAtKey(): void;
    setTimeVarying(varying: boolean): void;
    setValue(): void;
    setValueAtKey(): void;
}
