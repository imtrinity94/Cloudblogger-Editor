// PowerShell (o11n-plugin-powershell), generated from modernvroapi.in data. Do not edit.

/**
 * Generates actions for PowerShell Cmdlets and Scripts
 * Plug-in: PowerShell
 */
interface PowerShellActionGenerator {
    /** Generates Automation Orchestrator action for provided PowerShell script. */
    createActionForScript(actionName: string, script: string, moduleName: string, generateWorkflow: boolean, targetFolder: any): void;
}
declare var PowerShellActionGenerator: PowerShellActionGenerator & { new(): PowerShellActionGenerator; prototype: PowerShellActionGenerator };

/**
 * Enumeration for the supported authorization modes. The modes are "Shared Session" and "Session per User".
 * Plug-in: PowerShell
 */
interface PowerShellAuthorizationMode {
    /** (Static) Converts a string to an instance of this class. If String is not possible to be converted an IllegalArgumentException is thrown. */
    fromString(text: string): PowerShellAuthorizationMode;
}
declare var PowerShellAuthorizationMode: PowerShellAuthorizationMode & { new(): PowerShellAuthorizationMode; prototype: PowerShellAuthorizationMode };

/**
 * Deprecated. Use AuthorizationModeinstead.
 * Plug-in: PowerShell
 */
interface PowerShellAutorizationMode {
    /** (Static) Converts a string to an instance of this class. If String is not possible to be converted an IllegalArgumentException is thrown. */
    fromString(text: string): PowerShellAutorizationMode;
    /** (Static) Converts a string to an instance of AuthorizationMode class. If String is not possible to be converted an IllegalArgumentException is thrown. */
    getAuthorizationMode(mode: PowerShellAutorizationMode): PowerShellAuthorizationMode;
}
declare var PowerShellAutorizationMode: PowerShellAutorizationMode & { new(): PowerShellAutorizationMode; prototype: PowerShellAutorizationMode };

/**
 * Wrapper of a PowerShell cmdlet that resides on the remote Windows machine
 * Plug-in: PowerShell
 */
interface PowerShellCmdlet {
    /** The name of the cmdlet */
    readonly name: string;
    /** The definition of the cmdlet */
    readonly definition: string;
    /** The name of snap-in that this cmdlet belongs to */
    readonly psSnapin: string;
    /** The cmdlet command type */
    readonly commandType: string;
}
declare var PowerShellCmdlet: PowerShellCmdlet & { new(): PowerShellCmdlet; prototype: PowerShellCmdlet };

/**
 * Represents a PowerShell command that can be run on the remote PowerShell host.
 * Plug-in: PowerShell
 */
interface PowerShellCommand {
    /** Adds a new parameter to the list of params for this PowerShellCommand instance. */
    addParameter(paramName: string, value: any): PowerShellCommand;
    /** Returns all Parameters as a Map. */
    getParams(): any;
    /** Returns the String that this Command object was initialy created. */
    getCommand(): string;
}
declare var PowerShellCommand: PowerShellCommand & { new(command: string): PowerShellCommand; prototype: PowerShellCommand };

/**
 * Advanced configuration parameters.
 * Plug-in: PowerShell
 */
interface PowerShellConfigurationParameters {
    /** Get Shell Code Page */
    shellCodePage: PowerShellShellCodePage;
    /** Get Idle Timeout */
    idleTimeout: number;
    /** Get Read Timeout */
    readTimeout: number;
}
declare var PowerShellConfigurationParameters: PowerShellConfigurationParameters & { new(): PowerShellConfigurationParameters; prototype: PowerShellConfigurationParameters };

/**
 * Represents a remote host with PowerShell installed on it.
 * Plug-in: PowerShell
 */
interface PowerShellHost {
    /** Logical name given to the remote PowerShell host */
    readonly name: string;
    /** The unique ID of this object */
    readonly id: string;
    /** The type of the communication protocol i.e. WinRM or SSH */
    readonly type: string;
    /** The port on which to connect in case of WinRM type of communication. */
    readonly port: string;
    /** The username of the user that logs to the remote PowerShell Machine */
    readonly username: string;
    /** The transport protocol in case of WinRM type of communication. Can be either HTTPS or HTTP */
    readonly transportProtocol: string;
    /** The IP/Hostname of the remote host */
    readonly connectionURL: string;
    /** Starts a pipeline in the context of the session identified by sessionId */
    startPipeline(sessionId: string): void;
    /** Returns Session for the given sessionId. Exception is thrown if session does not exist or has been closed. */
    getSession(sessionId: string): PowerShellSession;
    /** Returns the PowerShellHostConfig instance for this PowerShellHost */
    getHostConfig(): PowerShellHostConfig;
    /** Opens a new PowerShellSession, which can be used to run PowerShell scrits and cmdlets */
    openSession(idleTimeout: number): PowerShellSession;
    /** Closes the session with the given sessionId */
    closeSession(sessionId: string): void;
    /** Invokes powershell script without adding it to pipeline. */
    invokeScript(script: string): PowerShellInvocationResult;
    /** Returns the inPipeline flag of the session identified by sessionId */
    inPipeline(sessionId: string): boolean;
    /** Executes the pipeline associated with the session with id==sessionId and clears the pipeline, removing all commands from it. */
    endPipeline(sessionId: string): void;
    /** Opens a new PowerShellSession with provided credentials, which can be used to run PowerShell scrits and cmdlets */
    openSessionAs(name: string, password: string, idleTimeout: number): PowerShellSession;
}
declare var PowerShellHost: PowerShellHost & { new(): PowerShellHost; prototype: PowerShellHost };

/**
 * Encapsulates the configuration for a remote PowerShell host
 * Plug-in: PowerShell
 */
interface PowerShellHostConfig {
    /** Logical name given to the remote PowerShell Machine */
    name: string;
    /** The type of the communication protocol i.e. WinRM or SSH */
    type: string;
    /** The port on which to connect in case of WinRM type of communication. */
    port: string;
    /** Specifies authentication mechanism used when communicating with PowerShell host. WinRM protocol supported Basic and Kerberos. */
    authentication: string;
    /** The username of the user that logs to the remote PowerShell Machine */
    username: string;
    /** The password to use to log into the remote PowerShell Machine */
    password: any;
    /** get Configuration parameres */
    configurationParameters: PowerShellConfigurationParameters;
    /** The authorization mode for this configuration */
    authorizationMode: PowerShellAuthorizationMode;
    /** The transport protocol in case of WinRM type of communication. Can be either HTTPS or HTTP */
    transportProtocol: string;
    /** The authorization mode for this configuration */
    autorizationMode: PowerShellAutorizationMode;
    /** The IP/Hostname of the remote machine */
    connectionURL: string;
}
declare var PowerShellHostConfig: PowerShellHostConfig & { new(): PowerShellHostConfig; prototype: PowerShellHostConfig };

/**
 * Manager for configuring the PowerShell hosts
 * Plug-in: PowerShell
 */
interface PowerShellHostManager {
    /** Removes the PowerShellHostConfig with the passed in as argument id from the configuration of the plugin. */
    remove(id: string): void;
    /** Creates a PowerShellHost for the passed in as argument PowerShellHostConfig if it doesn't already exist. In case it already exists the PowerShellHost is updated. */
    update(hostConfig: PowerShellHostConfig): PowerShellHost;
    /** Checks if the provided hostConfig parameter contains settings that the plugin can use to successfully connect to a remote PowerShell machine. In case the configurations are not valid the method throws appropriate exception. */
    validatePowerShellHost(hostConfig: PowerShellHostConfig): void;
}
declare var PowerShellHostManager: PowerShellHostManager & { new(): PowerShellHostManager; prototype: PowerShellHostManager };

/**
 * Represents the result from an execution fo PowerShell script
 * Plug-in: PowerShell
 */
interface PowerShellInvocationResult {
    /** Returns list of errors reported by powershell engine during script invocation. */
    getErrors(): string[];
    /** Returns list of objects returned by PowerShell engine after successfull invocation. */
    getResults(): PowerShellRemotePSObject;
    /** Status of execution of the script. Possible values are (Completed, Failed). */
    getInvocationState(): any;
    /** Returns output of script execution as it appears on the powershell console. */
    getHostOutput(): string;
}
declare var PowerShellInvocationResult: PowerShellInvocationResult & { new(): PowerShellInvocationResult; prototype: PowerShellInvocationResult };

/**
 * Represents an object on the remote PowerShell machine
 * Plug-in: PowerShell
 */
interface PowerShellPSObject {
    /** Returns value of specific object property. Tha returned value itself can be of primitive type, ArrayList, Hashtable or another PowerShellPSObject */
    getProperty(propName: string): any;
    /** Checks if this instance is of specific type */
    instanceOf(type: string): boolean;
    /** Returns an array containing Types representing all the public classes and interfaces that object implements */
    getTypes(): string[];
    /** Returns the object converted to String. */
    getToString(): string;
    /** Returns calue of the provided property converting it to string. */
    getPropertyAsString(propName: string): string;
    /** Returns the value of propName property. */
    getPropertyAsPSObject(propName: string): PowerShellPSObject;
    /** Returns the value of propName property as a list of PowerShellPSObject */
    getPropertyAsPSObjectList(propName: string): any[];
}
declare var PowerShellPSObject: PowerShellPSObject & { new(): PowerShellPSObject; prototype: PowerShellPSObject };

/**
 * Wrapper for the result from an execution fo PowerShell script
 * Plug-in: PowerShell
 */
interface PowerShellRemotePSObject {
    /** Returns the object as String that is XML formated */
    getXml(): string;
    /** Returns result of PowerShell script invocation converted in corresponding Automation Orchestrator type. The result can be simple type, ArrayList, Properties or PowerShellPSObject */
    getRootObject(): any;
    /** Returns the object as String that is JSON formated */
    getAsJson(): string;
}
declare var PowerShellRemotePSObject: PowerShellRemotePSObject & { new(): PowerShellRemotePSObject; prototype: PowerShellRemotePSObject };

/**
 * Represents a session to the remote PowerShell machine, that can be used to run scripts and Cmdlets. Also users can benefit from the pipeline concept by demarcating pipeline boundaries with startPipeline() and endPipeline()
 * Plug-in: PowerShell
 */
interface PowerShellSession {
    /** Invokes powershell script without adding it to pipeline. */
    invokeScript(script: string): PowerShellInvocationResult;
    /** Invokes commands currently in pipeline, and remove them from the pipeline. */
    invokePipeline(): PowerShellInvocationResult;
    /** Adds command to pipeline */
    addCommand(command: PowerShellCommand): void;
    /** Creates command from provided string and adds it to pipeline. */
    addCommandFromString(command: string): PowerShellCommand;
    /** Returns the session id */
    getSessionId(): string;
}
declare var PowerShellSession: PowerShellSession & { new(): PowerShellSession; prototype: PowerShellSession };

/**
 * Enumeration for the supported shell code encodings.
 * Plug-in: PowerShell
 */
interface PowerShellShellCodePage {
    /** (Static) Converts a string to an instance of this class. If String is not possible to be converted an IllegalArgumentException is thrown. */
    fromString(text: string): PowerShellShellCodePage;
}
declare var PowerShellShellCodePage: PowerShellShellCodePage & { new(): PowerShellShellCodePage; prototype: PowerShellShellCodePage };

/**
 * PowerShell SnapIn wrapper object
 * Plug-in: PowerShell
 */
interface PowerShellSnapIn {
    /** The name of the SnapIn */
    readonly name: string;
    /** The module name that this SnapIn belongs to */
    readonly moduleName: string;
    /** The version of the SnapIn */
    readonly version: string;
    /** The description of the SnapIn */
    readonly description: string;
}
declare var PowerShellSnapIn: PowerShellSnapIn & { new(): PowerShellSnapIn; prototype: PowerShellSnapIn };

/**
 * The root of the SnapIns
 * Plug-in: PowerShell
 */
interface PowerShellSnapInRoot {
    readonly name: string;
}
declare var PowerShellSnapInRoot: PowerShellSnapInRoot & { new(): PowerShellSnapInRoot; prototype: PowerShellSnapInRoot };
