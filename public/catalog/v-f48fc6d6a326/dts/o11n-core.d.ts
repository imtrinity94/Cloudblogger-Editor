// System (Core Classes) (o11n-core), generated from modernvroapi.in data. Do not edit.

/**
 * Represents an action in the system
 * Plug-in: System (Core Classes)
 */
interface Action {
    /** Returns the name of the Action. */
    readonly name: string;
    /** Returns the description of the Action. */
    readonly description: string;
    /** Returns the version of the Action. */
    readonly version: string;
    /** Returns the return type of the Action. */
    readonly returnType: string;
    /** Returns the script of the Action. */
    readonly script: string;
    /** Returns the versionHistoryItem list of the Action. */
    readonly versionHistoryItems: VersionHistoryItem[];
    /** Returns the parameter list of the Action. */
    readonly parameters: Parameter[];
    /** Returns the parameter list of the Action. */
    readonly module: Module;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
}
declare var Action: Action & { new(): Action; prototype: Action };

/**
 * Object representing a instance of a result of action executed asynchronously
 * Plug-in: System (Core Classes)
 */
interface ActionResult {
    /** Returns the actual result returned by the asynchronous executed action. Blocks until the result is available. */
    getResult(): any;
    /** Attempts to cancel the execution of the asynchronously executed action. */
    cancel(mayInterruptIfRunning: boolean): boolean;
    /** Returns true if the asynchronous action has completed. */
    isDone(): boolean;
}
declare var ActionResult: ActionResult & { new(): ActionResult; prototype: ActionResult };

/**
 * An integer value that can be updated atomically. The integer can vary between -2147483648 to +2147483647, by default it starts from 0
 * Plug-in: System (Core Classes)
 */
interface AtomicInteger {
    /** Gets the current value. */
    get(): number;
    /** Sets to the given value. */
    set(newValue: number): void;
    /** Atomically sets to the given value and returns the old value. */
    getAndSet(newValue: number): number;
    /** Atomically sets the value to the given updated value if the current value is equal to the expected value. */
    compareAndSet(expect: number, update: number): boolean;
    /** Atomically increments by one the current value. */
    getAndIncrement(): number;
    /** Atomically decrements by one the current value. */
    getAndDecrement(): number;
    /** Atomically adds the given value to the current value. */
    getAndAdd(delta: number): number;
    /** Atomically increments by one the current value. */
    incrementAndGet(): number;
    /** Atomically decrements by one the current value. */
    decrementAndGet(): number;
    /** Atomically adds the given value to the current value. */
    addAndGet(delta: number): number;
}
declare var AtomicInteger: AtomicInteger & { new(): AtomicInteger; prototype: AtomicInteger };

/**
 * System for atomic operations, always available in the scripting environment. The Atomic System allows concurrent workflows to access the same atomic objects concurrently. An Atomic object is differentiated by its id.
 * Plug-in: System (Core Classes)
 */
interface AtomicSystem {
    /** Gets an instance of an atomic integer by id. */
    getAtomicInteger(id: string): AtomicInteger;
}
declare var AtomicSystem: AtomicSystem & { new(): AtomicSystem; prototype: AtomicSystem };

/**
 * Describe an attribute
 * Plug-in: System (Core Classes)
 */
interface Attribute {
    /** Returns the name of the Parameter. */
    readonly name: string;
    /** Returns the description of the Parameter. */
    readonly description: string;
    /** Returns the type of the Parameter. */
    readonly type: string;
    readonly value: any;
}
declare var Attribute: Attribute & { new(): Attribute; prototype: Attribute };

/**
 * AuthorizationElement JavaScript object
 * Plug-in: System (Core Classes)
 */
interface AuthorizationElement {
    /** Returns the name of the configuration element. */
    name: string;
    /** Returns the description of the configuration element. */
    readonly description: string;
    /** Returns the ldap element DN for this authorization. */
    readonly ldapElementDn: string;
    /** Returns the ldap element for this authorization. */
    ldapElement: LdapGroup;
    /** Returns "enable" or "disable". */
    readonly status: string;
    /** Returns all Authorization references for this authorization element. */
    readonly references: AuthorizationReference[];
    /** add an authorization reference on any inventory object and return it */
    addReference(object: any, relation: any): AuthorizationReference;
    /** remove all reference in this authorization element */
    removeAllReferences(): void;
    /** remove all reference for a given object and relation. */
    removeReference(jsObject: any, relation: any): void;
}
declare var AuthorizationElement: AuthorizationElement & { new(): AuthorizationElement; prototype: AuthorizationElement };

/**
 * AuthorizationReference JavaScript object
 * Plug-in: System (Core Classes)
 */
interface AuthorizationReference {
    /** Returns the relationName or null if it is the objet itself */
    readonly relationName: string;
    /** Returns the element return type. */
    readonly returnType: string;
    /** Returns the type of the element. */
    readonly type: string;
    /** Returns the reference object */
    readonly value: any;
    /** Returns the authorized objects */
    readonly authorizedObjects: any;
    /** Returns the reference string representation, may be used with Server.fromStringRepresentation() */
    readonly stringRepresentation: string;
}
declare var AuthorizationReference: AuthorizationReference & { new(): AuthorizationReference; prototype: AuthorizationReference };

/**
 * Wrapper around byte array. Used for passing references to binary content.
 * Plug-in: System (Core Classes)
 */
interface ByteBuffer {
    /** Gets the length of the buffer */
    readonly length: number;
}
declare var ByteBuffer: ByteBuffer & { new(arg: any): ByteBuffer; prototype: ByteBuffer };

/**
 * Executes a command in the host operating system. <p>Commands are dependent on the host operating system default shell.</p> <p>Example 1: com = new Command(["ls", "-l"]); com.execute(true); // makes the call blocking output = com.getOutput();</p> <p>Example 2: com = new Command("ls -l"); com.execute(true); // makes the call blocking output = com.getOutput();</p>
 * Plug-in: System (Core Classes)
 */
interface Command {
    /** Returns the standard output from the command. */
    readonly output: string;
    /** Returns the return code from the command. */
    readonly result: number;
    input: string;
    /** Executes the command. <p>Standard output is redirected to the <b>output</b> attribute.</p> */
    execute(wait: any): number;
    /** Executes the command and logs the standard output to a file. */
    executeAndLog(filename: string): number;
}
declare var Command: Command & { new(cmd: any): Command; prototype: Command };

/**
 * ConfigurationElement
 * Plug-in: System (Core Classes)
 */
interface ConfigurationElement {
    /** Returns the name of the configuration element. */
    readonly name: string;
    /** Returns the description of the configuration element. */
    readonly description: string;
    /** Returns the version of the configuration element. */
    readonly version: string;
    /** Returns the versionHistoryItem list of the configuration element. */
    readonly versionHistoryItems: VersionHistoryItem[];
    /** Returns the attribute list of the configuration element. */
    readonly attributes: Attribute[];
    /** Returns the category object of the configuration element */
    readonly configurationElementCategory: any;
    /** Returns the attribute of the configuration element for the specified key. */
    getAttributeWithKey(key: string): Attribute;
    /** Sets the attribute value of the configuration element for the specified key. typeHint is an optional parameter that allows you to specify the desired type of the configuration attribute. </br> <b>Note</b>: The typeHint must be passed to the method as a String otherwise the execution will fail. All Automation Orchestrator objects e.g. 'SecureString' are valid types to be used as the optional parameters. </br> */
    setAttributeWithKey(key: string, value: any, typeHint: any): void;
    /** Saves a change set in the local version repository. */
    saveToVersionRepository(): void;
    /** Reloads the values of the attributes of this configuration element. */
    reload(): void;
    /** Remove the attribute of the configuration element for the specified key. */
    removeAttributeWithKey(key: string): void;
}
declare var ConfigurationElement: ConfigurationElement & { new(): ConfigurationElement; prototype: ConfigurationElement };

/**
 * ConfigurationElementCategory
 * Plug-in: System (Core Classes)
 */
interface ConfigurationElementCategory {
    /** Returns the name of the configuration element category. */
    readonly name: string;
    /** Returns the description of the configuration element category. */
    readonly description: string;
    /** Returns path of the configuration element category. */
    readonly path: string;
    readonly configurationElements: ConfigurationElement[];
    readonly subCategories: ConfigurationElementCategory[];
    readonly parent: ConfigurationElementCategory;
    readonly allConfigurationElements: ConfigurationElement[];
}
declare var ConfigurationElementCategory: ConfigurationElementCategory & { new(): ConfigurationElementCategory; prototype: ConfigurationElementCategory };

/**
 * Credential object (username / password pair)
 * Plug-in: System (Core Classes)
 */
interface Credential {
    readonly username: string;
    /** [Deprecated] Passwords are not available in scripting. */
    readonly password: string;
    checkPassword(otherPassword: string): boolean;
}
declare var Credential: Credential & { new(username: string, password: string): Credential; prototype: Credential };

/**
 * Set of debugging functions.
 * Plug-in: System (Core Classes)
 */
interface Debug {
    /** Dump the current variables */
    dumpVariables(): void;
    /** Watch changes on a given variable. */
    watch(variable: string): void;
    /** Stop watching a given variable. */
    unwatch(variable: string): void;
}
declare var Debug: Debug & { new(): Debug; prototype: Debug };

/**
 * Singleton object that can be used to encrypt
 *       and decrypt messages sent within the Execution context or
 * massages created in the scripting block.
 * Plug-in: System (Core Classes)
 */
interface EncryptionService {
    /** Generate one time key that can be used to encrypt a plain text or to decrypt encrypted text. */
    generateOneTimeKey(): string;
    /** Encrypt a plain text using one time key. */
    encrypt(plaintext: string, oneTimeKey: string): string;
    /** Decrypt an encrypted text using one time key that was used when the message has encrypted. */
    decrypt(encryptedMessage: string, oneTimeKey: string): string;
}
declare var EncryptionService: EncryptionService & { new(): EncryptionService; prototype: EncryptionService };

/** Plug-in: System (Core Classes) */
interface Enumeration {
    readonly next: any;
    readonly hasNext: boolean;
}
declare var Enumeration: Enumeration & { new(value: any): Enumeration; prototype: Enumeration };

/**
 * Event generated by an 'OnInit'/'OnExit' event of a Policy item.
 * Plug-in: System (Core Classes)
 */
interface Event {
    /** Generator of the event. */
    readonly source: any;
    /** when the evant has been generated */
    readonly when: number;
    consume(owner: string): void;
}
declare var Event: Event & { new(): Event; prototype: Event };

/**
 * Event generated by an 'OnGauge.xxx' event of a Policy item.
 * Plug-in: System (Core Classes)
 */
interface EventGauge {
    /** Generator of the event. */
    readonly source: any;
    /** when the evant has been generated */
    readonly when: number;
    /** the gauge type (cpu,mem,...). */
    readonly perfKey: string;
    /** Gauge value , depends of the type. */
    readonly value: number;
    /** Gauge device. */
    readonly device: string;
    consume(owner: string): void;
}
declare var EventGauge: EventGauge & { new(): EventGauge; prototype: EventGauge };

/**
 * Event generated by an 'OnExecute' event of a periodic Policy item.
 * Plug-in: System (Core Classes)
 */
interface EventSchedule {
    /** Generator of the event. */
    readonly source: any;
    /** when the evant has been generated */
    readonly when: number;
    readonly lastExec: number;
    readonly nextExecutionDate: any;
    readonly nextExec: number;
    readonly lastExecutionDate: any;
    consume(owner: string): void;
}
declare var EventSchedule: EventSchedule & { new(): EventSchedule; prototype: EventSchedule };

/**
 * Object containing parameters visible throughout the workflow run and all sub workflow runs triggered
 *       byt it.
 * Plug-in: System (Core Classes)
 */
interface ExecutionContext {
    /** Return a parameter by its name. */
    getParameter(name: string): any;
    /** Check if a parameter with certain name is added to the execution context. */
    contains(name: string): boolean;
    /** Return an array containing the names of all parameters in the execution context. */
    parameterNames(): any[];
    /** Return the one time key that is used to encrypt the encrypted input parameters with in the execution context. */
    getOneTimeKey(): string;
}
declare var ExecutionContext: ExecutionContext & { new(): ExecutionContext; prototype: ExecutionContext };

/**
 * Representation of a file on a managed computer.
 * Plug-in: System (Core Classes)
 */
interface File {
    /** The hostname of the <a cmd="show.type.Host">Host</a> on which the file resides. */
    hostname: string;
    /** The path to the file, not including its name. */
    path: string;
    /** Returns true if the file resides on the same computer as the one running the script. */
    readonly isLocal: boolean;
    /** Return true if the descibed by this object exists. */
    readonly exists: boolean;
    /** Returns the file length. */
    readonly length: number;
    /** Returns the directory in which the file resides. */
    readonly directory: string;
    /** The name of this file, not including the full path. */
    readonly name: string;
    /** Returns the extension of this file. <p>The extention is the set of characters after the last dot in the filename.</p> <p>Examples: Extension of "fail-over.policy" is "policy". Extension of "file.name.with.points.xyz" is "xyz".</p> */
    readonly extension: string;
    /** Returns true if this file ("path") is a directory. */
    readonly isDir: boolean;
    /** Writes the content to the file. If the file does not exist, it is created. */
    write(content: string): void;
    /** Renames the file denoted by this abstract pathname. Many aspects of the behavior of this method are inherently platform-dependent: The rename operation might not be able to move a file from one filesystem to another, it might not be atomic, and it might not succeed if a file with the destination abstract pathname already exists. The return value should always be checked to make sure that the rename operation was successful. */
    renameTo(destPathName: string): boolean;
    /** Creates the file if it does not exist. Also creates its directory if needed. */
    createFile(): void;
    /** Creates the directory structure if it does not exist. */
    createDirectory(): void;
    /** Deletes the file from the file system. */
    deleteFile(): void;
    /** List files / directories that end with the specified extension. */
    list(extension: any): string[];
    /** Can read this file */
    canRead(): boolean;
    /** Can write this file */
    canWrite(): boolean;
}
declare var File: File & { new(file: string): File; prototype: File };

/**
 * FileHelper wrapper
 * Plug-in: System (Core Classes)
 */
interface FileHelper {
}
declare var FileHelper: FileHelper & { new(): FileHelper; prototype: FileHelper };

/**
 * FileReader
 * Plug-in: System (Core Classes)
 */
interface FileReader {
    /** Returns true if the file exists in the file system. */
    readonly exists: boolean;
    /** Opens the file for reading. <p>Once open an index in the file is maintained. This means you can do succesive <b>readLine</b>.</p> */
    open(): void;
    /** Reads one line from the opened file. <p>To go back to the start of the file, <b>close</b> it and re-<b>open</b> it.</p> */
    readLine(): string;
    /** Reads all lines from the opened file. */
    readAll(): string;
    /** Closes a previously opened file. */
    close(): void;
}
declare var FileReader: FileReader & { new(file: string): FileReader; prototype: FileReader };

/**
 * FileWriter
 * Plug-in: System (Core Classes)
 */
interface FileWriter {
    /** The type of carriage return used in writeLine. Possible values: 0 : Unix (LF) 1 : Windows (CR,LF) 2 : Mac (CR) */
    lineEndType: number;
    readonly exists: boolean;
    /** Opens the file for writing. From this point on the file is locked. Use <b>close</b> to release it. */
    open(): void;
    /** Reinitializes the length to 0 and sets the file-pointer in the very begining of the file. */
    clean(): void;
    /** Writes a line to the file. The file must be opened first using <b>open</b>. */
    writeLine(value: string): void;
    /** Writes a string to the file. The file must be opened first using <b>open</b>. */
    write(value: string): void;
    /** Closes a previously opened file. */
    close(): void;
}
declare var FileWriter: FileWriter & { new(file: string): FileWriter; prototype: FileWriter };

/**
 * LdapGroup object
 * Plug-in: System (Core Classes)
 */
interface LdapGroup {
    readonly displayName: string;
    readonly commonName: string;
    readonly displayInfo: string;
    readonly dn: string;
    readonly parentGroups: LdapGroup[];
    readonly subGroups: LdapGroup[];
    readonly users: LdapUser[];
    readonly emailAddress: string;
}
declare var LdapGroup: LdapGroup & { new(): LdapGroup; prototype: LdapGroup };

/**
 * LdapUser object
 * Plug-in: System (Core Classes)
 */
interface LdapUser {
    readonly commonName: string;
    readonly userPrincipalName: string;
    readonly displayName: string;
    readonly loginName: string;
    readonly dn: string;
    readonly displayInfo: string;
    readonly groups: LdapGroup[];
    readonly emailAddress: string;
    readonly allGroups: LdapGroup[];
    isMemberOfGroup(ldapGroup: any): boolean;
}
declare var LdapUser: LdapUser & { new(): LdapUser; prototype: LdapUser };

/**
 * Locking functions, always available in the scripting environment.
 * Plug-in: System (Core Classes)
 */
interface LockingSystem {
    /** Try to acquire a lock. Returns true if the lock is acquired, false otherwise. */
    lock(lockId: string, owner: string): boolean;
    /** Try to acquire a lock and wait until lock is acquired. */
    lockAndWait(lockId: string, owner: string): void;
    /** Release a lock. */
    unlock(lockId: string, owner: string): void;
    /** Release all locks. */
    unlockAll(): void;
    /** Retrieve all locks. */
    retrieveAll(): string[];
}
declare var LockingSystem: LockingSystem & { new(): LockingSystem; prototype: LockingSystem };

/**
 * Object representing a log event
 * Plug-in: System (Core Classes)
 */
interface LogEvent {
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Returns the severity of the log event. */
    readonly severity: number;
    /** Returns the time stamp of the log event. */
    readonly logTimeStamp: Date;
    /** Returns the short description of the log event. */
    readonly shortDescription: string;
    /** Returns the long description of the log event. */
    readonly longDescription: string;
    /** Returns the originator uri of the log event. */
    readonly originatorUri: string;
    /** Returns the originator user name of the log event. */
    readonly originatorUserName: string;
    /** Returns the originator id of the log event. */
    readonly originatorId: string;
}
declare var LogEvent: LogEvent & { new(): LogEvent; prototype: LogEvent };

/**
 * LogFileWriter
 * Plug-in: System (Core Classes)
 */
interface LogFileWriter {
    /** The type of carriage return used in writeLine. Possible values: 0 : Unix (LF) 1 : Windows (CR,LF) 2 : Mac (CR) */
    lineEndType: number;
    readonly exists: boolean;
    /** Opens the file for writing. From this point on the file is locked. Use <b>close</b> to release it. */
    open(): void;
    /** Reinitializes the length to 0 and sets the file-pointer in the very begining of the file. */
    clean(): void;
    /** Writes a line to the file. The file must be opened first using <b>open</b>. */
    writeLine(value: string): void;
    /** Writes a string to the file. The file must be opened first using <b>open</b>. */
    write(value: string): void;
    /** Closes a previously opened file. */
    close(): void;
}
declare var LogFileWriter: LogFileWriter & { new(file: string): LogFileWriter; prototype: LogFileWriter };

/**
 * Object representing a log query
 * Plug-in: System (Core Classes)
 */
interface LogQuery {
    /** Gets or sets the fetch limit. */
    fetchLimit: number;
    /** Gets or sets the from date. */
    fromDate: Date;
    /** Gets or sets the to date. */
    toDate: Date;
    /** Gets or sets the originator id. */
    originatorId: string;
    /** Gets or sets the target uri. */
    targetUri: string;
    /** Gets or sets the severity threshold. */
    severityThreshold: number;
}
declare var LogQuery: LogQuery & { new(): LogQuery; prototype: LogQuery };

/**
 * Describe a mime attachment.
 * Plug-in: System (Core Classes)
 */
interface MimeAttachment {
    name: string;
    mimeType: string;
    content: string;
    /** Gets the byte content of the mime attachment */
    buffer: ByteBuffer;
    /** Write the content of the mime attachment to file. */
    write(directory: any, filename: any): void;
}
declare var MimeAttachment: MimeAttachment & { new(arg: any): MimeAttachment; prototype: MimeAttachment };

/**
 * Object used to call custom action in the system.
 * Plug-in: System (Core Classes)
 */
interface Module {
    /** Return all action modules. */
    readonly actions: Action[];
    /** Return all action modules. */
    readonly actionDescriptions: Action[];
    /** Return the module name. */
    readonly name: string;
    /** Return the module description. */
    readonly description: string;
}
declare var Module: Module & { new(): Module; prototype: Module };

/**
 * Representation of a not found object (doesn't exist anymore or currently unavailable)
 * Plug-in: System (Core Classes)
 */
interface NotFound {
    /** Returns the original StringRepresentation of this object. */
    readonly originalStringRepresentation: string;
    /** Returns the original type of this object. */
    readonly originalType: string;
}
declare var NotFound: NotFound & { new(): NotFound; prototype: NotFound };

/**
 * Representation of a package
 * Plug-in: System (Core Classes)
 */
interface Package {
    /** Returns the name of the package. */
    readonly name: string;
    /** Returns the description of the package. */
    readonly description: string;
    readonly policyTemplates: PolicyTemplate[];
    readonly actions: Action[];
    readonly workflows: Workflow[];
    readonly resourceElements: ResourceElement[];
    readonly configurationElements: ConfigurationElement[];
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Returns the version of the package. */
    readonly version: string;
    /** Remove the package */
    remove(): void;
}
declare var Package: Package & { new(): Package; prototype: Package };

/**
 * Describe a parameter
 * Plug-in: System (Core Classes)
 */
interface Parameter {
    /** Returns the name of the Parameter. */
    readonly name: string;
    /** Returns the description of the Parameter. */
    readonly description: string;
    /** Returns the type of the Parameter. */
    readonly type: string;
}
declare var Parameter: Parameter & { new(): Parameter; prototype: Parameter };

/** Plug-in: System (Core Classes) */
interface Path {
}
declare var Path: Path & { new(): Path; prototype: Path };

/**
 * Description of a plug-in module
 * Plug-in: System (Core Classes)
 */
interface PluginModuleDescription {
    readonly name: string;
    readonly description: string;
    readonly version: string;
    readonly types: any[];
}
declare var PluginModuleDescription: PluginModuleDescription & { new(): PluginModuleDescription; prototype: PluginModuleDescription };

/**
 * Description of a plug-in type
 * Plug-in: System (Core Classes)
 */
interface PluginTypeDescription {
    readonly name: string;
    readonly kind: string;
    readonly type: string;
    readonly description: string;
}
declare var PluginTypeDescription: PluginTypeDescription & { new(): PluginTypeDescription; prototype: PluginTypeDescription };

/**
 * Representation of a policy
 * Plug-in: System (Core Classes)
 */
interface Policy {
    /** Returns the name of the policy. */
    readonly name: string;
    /** Returns the description of the policy. */
    readonly description: string;
    /** Returns all tagged object in the policy. */
    readonly taggedObjects: any[];
    /** Returns all tags in the policy. */
    readonly tags: string[];
    /** Returns the Owner of the policy. */
    readonly owner: any;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Get the policy status (running,stopped) */
    readonly status: string;
    /** Tell the policy to autostart when Automation Orchestrator server start */
    autostart: boolean;
    readonly currentVersion: string;
    credential: any;
    /** Returns the log events */
    readonly logEvents: LogEvent[];
    /** Returns the object referenced by 'tag' in the policy (Virtual machine or Hosts) */
    getObjectByTag(value: string): any;
    /** Returns the object referenced by 'tag' in the policy (Virtual machine or Hosts) */
    forTag(value: string): any;
    /** Exits the policy immediatlly. */
    exit(reason: string): void;
    /** Returns all tags and their corresponding events. */
    getEventsByTag(): Properties[];
    /** Start the policy */
    start(): void;
    /** Stop the policy */
    stop(reason: string): void;
    /** Remove the policy */
    remove(): void;
}
declare var Policy: Policy & { new(): Policy; prototype: Policy };

/**
 * Representation of a policy template
 * Plug-in: System (Core Classes)
 */
interface PolicyTemplate {
    /** Returns the name of the policy template. */
    readonly name: string;
    /** Returns the description of the policy template. */
    readonly description: string;
    /** Returns the version of the PolicyTemplate. */
    readonly version: string;
    /** Returns the versionHistoryItem list of the PolicyTemplate. */
    readonly versionHistoryItems: VersionHistoryItem[];
    readonly currentVersion: string;
    /** Returns the category object of the policy template */
    readonly policyTemplateCategory: any;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Apply the policy template and create a new policy with it. */
    apply(name: string, properties: any): Policy;
    /** Returns the object referenced by 'tag' in the policy (Virtual machine or Hosts) */
    getObjectByTag(value: string): any;
    /** Returns the object referenced by 'tag' in the policy (Virtual machine or Hosts) */
    forTag(value: string): any;
}
declare var PolicyTemplate: PolicyTemplate & { new(): PolicyTemplate; prototype: PolicyTemplate };

/**
 * Representation of a policy template category
 * Plug-in: System (Core Classes)
 */
interface PolicyTemplateCategory {
    /** Returns the name of the policy template category. */
    readonly name: string;
    /** Returns the description of the policy template category. */
    readonly description: string;
    /** Returns the path of the policy template category. */
    readonly path: string;
    readonly policyTemplates: PolicyTemplate[];
    readonly subCategories: PolicyTemplateCategory[];
    readonly parent: PolicyTemplateCategory;
    readonly allPolicyTemplates: PolicyTemplate[];
}
declare var PolicyTemplateCategory: PolicyTemplateCategory & { new(): PolicyTemplateCategory; prototype: PolicyTemplateCategory };

/**
 * Properies list. A list of key - values.
 * Plug-in: System (Core Classes)
 */
interface Properties {
    /** Returns the list of keys in the property list. */
    readonly keys: string[];
    /** Adds a property to the property list. */
    put(key: string, value: any): void;
    /** Remove a property to the property list. */
    remove(key: string): any;
    /** Returns the property entry for the given key. */
    get(key: string): any;
    /** Loads properties from a File, an URL or a String object */
    load(input: any): void;
}
declare var Properties: Properties & { new(value: any): Properties; prototype: Properties };

/**
 * QueryResult is a result for a plugin query
 * Plug-in: System (Core Classes)
 */
interface QueryResult {
    /** Returns the elements */
    readonly elements: any;
    /** Returns the total number of elements for the query */
    readonly totalCount: number;
    /** Returns true if the number of elements returned is partial. */
    readonly partial: boolean;
}
declare var QueryResult: QueryResult & { new(): QueryResult; prototype: QueryResult };

/**
 * ResourceElement
 * Plug-in: System (Core Classes)
 */
interface ResourceElement {
    /** Returns the name of the resource element. */
    name: string;
    /** Returns the description of the resource element. */
    description: string;
    /** Returns the version of the resource element. */
    readonly version: string;
    /** Returns the mime type of the resource element. */
    mimeType: string;
    /** Returns the content size of the resource element. */
    readonly contentSize: number;
    /** Returns the versionHistoryItem list of the resource element. */
    readonly versionHistoryItems: VersionHistoryItem[];
    /** Writes the content to a file. */
    writeContentToFile(fileName: string): void;
    /** Returns the content converted to a MimeAttachment. */
    getContentAsMimeAttachment(): MimeAttachment;
    /** Returns this element's parent category */
    getResourceElementCategory(): ResourceElementCategory;
    /** Reload resource element */
    reload(): void;
    /** Saves a change set in the local version repository. */
    saveToVersionRepository(): void;
    /** Sets the content of this resource element. */
    setContentFromFile(fileName: string, mimeType: string): void;
    /** Sets the content of this resource element. */
    setContentFromMimeAttachment(mimeAttachment: MimeAttachment): void;
}
declare var ResourceElement: ResourceElement & { new(): ResourceElement; prototype: ResourceElement };

/**
 * ResourceElementCategory
 * Plug-in: System (Core Classes)
 */
interface ResourceElementCategory {
    /** Returns the name of the resource element category. */
    readonly name: string;
    /** Returns the description of the resource element category. */
    readonly description: string;
    /** Returns the path of the resource element category. */
    readonly path: string;
    readonly resourceElements: ResourceElement[];
    readonly subCategories: ResourceElementCategory[];
    readonly parent: ResourceElementCategory;
    readonly allResourceElements: ResourceElement[];
}
declare var ResourceElementCategory: ResourceElementCategory & { new(): ResourceElementCategory; prototype: ResourceElementCategory };

/**
 * Representation of a Custom object result comming from a sdk module.
 * Plug-in: System (Core Classes)
 */
interface SDKObject {
    /** Real type of the SDKObject */
    readonly type: string;
    /** Id of the SDKObject */
    readonly id: string;
}
declare var SDKObject: SDKObject & { new(type: any, id: any): SDKObject; prototype: SDKObject };

/**
 * Similar to string type, except that text is not displayed as the user enters it. See <a cmd="show.type.string">string</a> type.
 * Plug-in: System (Core Classes)
 */
interface SecureString {
}
declare var SecureString: SecureString & { new(): SecureString; prototype: SecureString };

/**
 * Set of functions to interact with the
 * Automation Orchestrator server.
 * Plug-in: System (Core Classes)
 */
interface Server {
    /** Check if the Credential is a valid LDAP Credential. */
    isValidLdapCredential(credential: Credential): boolean;
    /** Log a text in the server with a INFO threshold. The log will be stored in the database. */
    log(text: string, info: string): void;
    /** Log a text in the server with a ERROR threshold. The log will be stored in the database. */
    error(text: string, info: string): void;
    /** Log a text in the server with a WARN threshold. The log will be stored in the database. */
    warn(text: string, info: string): void;
    /** Return all the objects of the given type and matching the query expression. */
    query(type: string, queryExp: string, maxCount: number): any[];
    /** Return all the objects of the given type. */
    findAllForType(type: string, query: string): any[];
    /** Return the object of the given type that has the given id. */
    findForType(type: string, id: string): any;
    /** Convert a Server's Object to an URI. */
    toUri(object: any): string;
    /** Get a Server's Object by it URI. */
    fromUri(uri: string): any;
    /** Convert a Server's Object to a String representation. */
    toStringRepresentation(object: any): StringRepresentation;
    /** Get a Server's Object by it String representation. */
    fromStringRepresentation(rep: StringRepresentation): any;
    /** Get a Workflow with a givent ID. */
    getWorkflowWithId(id: string): Workflow;
    /** Return an ldap element with the given DN. */
    getLdapElement(dn: string): any;
    /** Return all ldap users matching the query's name */
    searchLdapUsers(query: string, limit: number): LdapUser[];
    /** Return all ldap groups matching the query's name */
    searchLdapGroups(query: string, limit: number): LdapGroup[];
    /** Return the ldap user associated with the running script */
    getCurrentLdapUser(): LdapUser;
    /** Return the credential associated with the running script */
    getCredential(): Credential;
    /** Return list of all registered plugin types in the server. */
    getAllPluginTypes(): any[];
    /** Return list of all attribute names for the given type. */
    getAllNamesForType(type: string): string[];
    /** Return list of all attribute display name for the given type. */
    getAllDisplayNamesForType(type: string): string[];
    /** Return list of all attribute description for the given type. */
    getAllDescriptionsForType(type: string): string[];
    /** Return wokflow token state. */
    getWorkflowTokenState(token_id: string): string;
    /** Return all workflow categories. */
    getAllWorkflowCategories(): WorkflowCategory[];
    /** Return a workflow category matching the given path or null if not found. */
    getWorkflowCategoryWithPath(path: string): WorkflowCategory;
    /** Return a configuration element category matching the given path or null if not found. */
    getConfigurationElementCategoryWithPath(path: string): ConfigurationElementCategory;
    /** Return a resource element category matching the given path or null if not found. */
    getResourceElementCategoryWithPath(path: string): ResourceElementCategory;
    /** Return a package given its name or null if not found. */
    getPackageWithName(name: string): Package;
    /** Return a policy template category matching the given path or null if not found. */
    getPolicyTemplateCategoryWithPath(path: string): PolicyTemplateCategory;
    /** Return all policy template categories. */
    getAllPolicyTemplateCategories(): PolicyTemplateCategory[];
    /** Return all Plugin modules information. */
    getAllPluginInfo(): PluginModuleDescription[];
    /** Return a plugin type info for a given type if exists. */
    getPluginTypeInfo(type: string): PluginTypeDescription;
    /** Set a custom property to any plugin object. */
    setCustomProperty(target: any, key: string, value: any): void;
    /** Get a custom property to any plugin object. */
    getCustomProperty(target: any, key: string): any;
    /** Remove a custom property to any plugin object. */
    removeCustomProperty(target: any, key: string): void;
    /** Return all custom property keys available for a plugn object. */
    getCustomPropertyKeys(target: any): string[];
    /** Return all plugin objects with a given key. */
    getObjectsWithCustomPropertyKey(key: string): any[];
    /** Return all plugin objects with a given key. */
    getObjectsURIWithCustomPropertyKey(key: string): string[];
    /** Remove all custom properties for a given object. */
    removeAllCustomPropertiesForObject(target: any): void;
    /** Remove all custom properties for a given object TYPE. */
    removeAllCustomPropertiesForType(type: string): void;
    /** Remove all custom properties for a given object TYPE and KEY. */
    removeAllCustomPropertiesForTypeAndKey(type: string, key: string): void;
    /** Returns the running user display name. */
    getRunningUser(): string;
    /** Returns all configuration element categories. */
    getAllConfigurationElementCategories(): ConfigurationElementCategory[];
    /** Returns all resource element categories. */
    getAllResourceElementCategories(): ResourceElementCategory[];
    /** Returns authorization element with the given name. */
    getAuthorizationElementForName(name: string): AuthorizationElement;
    /** Returns authorization elements for the given ldap element. */
    getAuthorizationElementsForLdapElement(ldapElement: any): AuthorizationElement[];
    /** Create a new Authorization Element. */
    createAuthorizationElement(name: string, ldapElement: any, description: string): AuthorizationElement;
    /** Remove an existing Authorization Element. */
    removeAuthorizationElement(authorizationElement: AuthorizationElement): void;
    /** Create a new resource element. */
    createResourceElement(category: any, name: string, fileNameOrMime: any, mimeType: string): ResourceElement;
    /** Create a new configuration element. Since 7.0. */
    createConfigurationElement(category: any, name: string): ConfigurationElement;
    /** Remove an existing configuration element. */
    removeConfigurationElement(configurationElement: ConfigurationElement): void;
    /** Remove an existing configuration element folder. */
    removeConfigurationElementCategory(configurationElementCategory: ConfigurationElementCategory): void;
    /** Remove an existing resource element. */
    removeResourceElement(resourceElement: ResourceElement): void;
    /** Set the access rights of an element. */
    setAccessRights(owner: any, user: any, rights: string): void;
    /** Remove the access rights of an element. */
    removeAccessRights(owner: any, user: any): void;
    /** Returns the signature owner of an element. */
    getSignatureOwner(element: any): string;
    /** Returns the signature finger print of an element. */
    getSignatureFingerPrint(element: any): string;
    /** Returns the log events matching the query. */
    fetchLogEvents(query: LogQuery): LogEvent[];
    /** Tags an object with a specific tag. The created tag is private and is visible only to the user who created the tag. The tag name must be between 3 and 64 characters. */
    tag(object: any, tag: string, value: string): void;
    /** Tags an object with a specific tag. The created tag is global and is visible to all users. Global tags can be created only by users with administrator privileges. The tag name must be between 3 and 64 characters. */
    tagGlobally(object: any, tag: string, value: string): void;
    /** Removes a private tag from an object. */
    untag(object: any, tags: string[]): void;
    /** Removes a global tag from an object.  Global tags can be removed only by users with administrator privileges. */
    untagGlobally(object: any, tags: string[]): void;
    /** Get the distinct tag names. Including tags names created by other users. */
    findTagsInUse(): string[];
    /** Return objects of the given type that are tagged with provided tags. To search for global tags prefix the tag name with ":". */
    queryByTags(tagQuery: any, type: string): any[];
    /** Returns private tags associated with an object. */
    findTagsForObject(Properties: any): Properties;
    /** Returns global tags associated with an object. */
    findGlobalTagsForObject(Properties: any): Properties;
}
declare var Server: Server & { new(): Server; prototype: Server };

/**
 * Used to convert any 'Seriallizable' object in a String representation that can be stored.
 * Plug-in: System (Core Classes)
 */
interface StringRepresentation {
    /** Returns the type represneted */
    readonly type: string;
    /** Returns the string value for this representation */
    readonly stringValue: string;
    /** Returns the object value for this representation */
    readonly objectValue: any;
    /** Returns the urlParameter for this object representation (used to send object through URL) */
    toParam(): string;
}
declare var StringRepresentation: StringRepresentation & { new(repOrType: any, stringValue: any): StringRepresentation; prototype: StringRepresentation };

/**
 * General set of functions, always available in the scripting environment.
 * Plug-in: System (Core Classes)
 */
interface System {
    /** Log a text in the standard output console. Use this for debug only. */
    stdout(text: string): void;
    /** Log a text in the system with a INFO threshold. */
    log(text: string): void;
    /**
     * Creates an empty file in the temporary directory of
     * Automation Orchestrator (app-server/temp), using the given suffix to generate its name.
     */
    createTempFile(suffix: string): File;
    /** Log a text in the system with a ERROR threshold. */
    error(text: string): void;
    /** Log a text in the system with a WARNING threshold. */
    warn(text: string): void;
    /** Log a text in the system with a DEBUG threshold. */
    debug(text: string): void;
    /** Get current server time. */
    getCurrentTime(): number;
    /** Read only information for currently executed workflow item. */
    currentWorkflowItem(): any;
    /** Pause the current script context execution and wait for a given date to continue. */
    waitUntil(waitDate: Date, milli: number): boolean;
    /** Wait for an external custom event (with an expiration date). */
    waitCustomEventUntil(text: string, text_: string, endDate: Date): any;
    /** Send a custom event to all Policies and Workflows. */
    sendCustomEvent(eventKey: string): void;
    /** Return an string url usable to generate HTTP custom event. */
    customEventUrl(eventName: string, secure: boolean): URL;
    /**
     * Return an string url usable to generate HTTP custom event.
     *         The 'host' and 'port' parameters are useful if you want to be able to post events from outside a firewall.
     * In this case, indicate the host and port values on the firewall and make the firewall transfer the requests to the
     * Automation Orchestrator server, usually on port 8080.
     */
    customEventUrlforServer(eventName: string, host: string, port: string, secure: boolean): URL;
    /** Generate a unique ID. */
    nextUUID(): string;
    /** Sleep for a given time. */
    sleep(ms: number): boolean;
    /** Return an action module with the given name. */
    getModule(name: string): Module;
    /** Get the context object for the current workflow run. */
    getContext(): ExecutionContext;
    /** Return all action modules. */
    getAllModules(): Module[];
    /** Return server running os */
    getOsName(): string;
    /** Convert a hexadecimal string value to a number. */
    hexToDecimal(value: string): number;
    /** Convert a decimal number value to a hexadecimal string. */
    decimalToHex(value: number): string;
    /** Extract the directory part from a file path. */
    extractDirectory(fullPath: any): string;
    /** Extract the file name part from a file path. */
    extractFileName(fullPath: any): string;
    /** Extract the file extension part from a file path. */
    extractFileNameExtension(fullPath: any): string;
    /** Extract the file without extension part from a file path. */
    extractFileNameWithoutExtension(fullPath: any): string;
    /** Append a path fragment to another. (i.e. C:/temp and subpath/myfile.txt -> C:/temp/subpath/myfile.txt) */
    appendToPath(rootPath: any, toAdd: string): string;
    /** Used to populate additional log info to every scripting log. */
    setLogMarker(logMarker: string): void;
    /** Format a given number in a human readable binary size format. (i.e 2048 -> 2K Bytes, 4718592 -> 4.5M Bytes) */
    formatBinaryValue(value: number): string;
    /** Return the default temporary directory on the server */
    getTempDirectory(): string;
    /**
     * Format a given date in a given format.
     * Date and time formats are specified by date and time pattern  strings. Within date and time pattern strings, unquoted letters from 'A' to 'Z' and from 'a' to 'z' are interpreted as pattern letters representing the components of a date or time string. Text can be quoted using single quotes (') to avoid interpretation. "''" represents a single quote. All other characters are not interpreted; they're simply copied into the output string during formatting or matched against the input string during parsing.
     * The following pattern letters are defined (all other characters from 'A' to 'Z' and from 'a' to 'z' are reserved):
     * 
     *     G 	Era designator (AD)
     * y 	Year (1996; 96)
     *     M 	Month in year (July; Jul; 07)
     * w 	Week in year
     *     W 	Week in month
     * D 	Day in year
     *     d 	Day in month
     * F 	Day of week in month
     *     E 	Day in week 	(Tuesday; Tue)
     * a 	Am/pm marker 	(PM)
     *     H 	Hour in day (0-23)
     * k 	Hour in day (1-24)
     *     K 	Hour in am/pm (0-11
     * h 	Hour in am/pm (1-12)
     *     m 	Minute in hour
     * s 	Second in minute
     *     S 	Millisecond
     * z 	Time zone 	General time zone 	(Pacific Standard Time; PST; GMT-08:00)
     *     Z 	Time zone 	RFC 822 time zone 	(-0800)
     * Examples
     * 
     * The following examples show how date and time patterns are interpreted in the U.S. locale. The given date and time are 2001-07-04 12:08:56 local time in the U.S. Pacific Time time zone.
     * Date and Time Pattern 	Result
     *     "yyyy.MM.dd G 'at' HH:mm:ss z" --> "2001.07.04 AD at 12:08:56 PDT"
     * "EEE, MMM d, ''yy" --> "Wed, Jul 4, '01"
     *     "h:mm a" --> "12:08 PM"
     * "hh 'o''clock' a, zzzz" --> "12 o'clock PM, Pacific Daylight Time"
     *     "K:mm a, z" --> "0:08 PM, PDT"
     * "yyyyy.MMMMM.dd GGG hh:mm aaa" --> "02001.July.04 AD 12:08 PM"
     *     "EEE, d MMM yyyy HH:mm:ss Z" --> "Wed, 4 Jul 2001 12:08:56 -0700"
     * "yyMMddHHmmssZ" --> "010704120856-0700"
     */
    formatDate(aDate: any, pattern: string): string;
    /** Format a number */
    formatNumber(aNumber: number, pattern: string): string;
    /** Test whether that address is reachable. Best effort is made by the implementation to try to reach the host, but firewalls and server configuration may block requests resulting in a unreachable status while some specific ports may be accessible. A typical implementation will use ICMP ECHO REQUESTs if the privilege can be obtained, otherwise it will try to establish a TCP connection on port 7 (Echo) of the destination host. */
    isHostReachable(hostOrIp: string, timeout: number): boolean;
    /**
     * Returns the IP address given a host name, using a DNS lookup. DNS must be configured on the
     * Automation Orchestrator server. Failure to lookup the host will return null.
     */
    resolveHostName(hostName: string): string;
    /**
     * Returns the host name given an IP Address (in standard dotted notation, for example "127.0.0.1"), using a DNS lookup. DNS must be configured on the
     * Automation Orchestrator server. Failure to lookup the hostname, or badly formatted IP addresses will throw an exception
     */
    resolveIpAddress(ipAddress: string): string;
    /** compare two version number with format "v1.v2.v3 .. vn" and return the index of the change with positive and negative value depending what version is greater */
    compareVersionNumber(v1: string, v2: string): number;
    /** Return the class name of any scripting object that typeof(obj) returns "object". */
    getObjectClassName(obj: any): string;
    /** Return the plugin name of any scripting object. Base objects return "Server" as plugin */
    getObjectPluginName(obj: any): string;
    /** Return true is object is a "NotFound" object */
    isNotFound(obj: any): boolean;
    /** Filter non authorized objects for the current user. If the parameter is an object the result will be null if the user is not authorized to use it, if it is an array or property, a recursive check is done and the unauthorized objects are removed. */
    filterAuthorized(obj: any): any;
    /** Construct a new date from a natural input and a reference date. */
    getDate(inputString: string, refDate: Date): Date;
    /**
     * Return the
     * Automation Orchestrator 'type' for the given object
     */
    getObjectType(obj: any): string;
    /**
     * Return the
     * Automation Orchestrator 'id' for the given object, some object have no ids
     */
    getObjectId(obj: any): string;
    /** Format a given millisecond number in a human readable format */
    formatDuration(milisecond: number, showMili: boolean, showZero: boolean): string;
    /** Parses the given string to produce a date. */
    getDateFromFormat(date: any, pattern: string): any;
}
declare var System: System & { new(): System; prototype: System };

/**
 * Object representing a tag query.
 * Plug-in: System (Core Classes)
 */
interface TagQuery {
    /** Add new has tag conditions to query. */
    hasTag(tag: string, value: string): void;
    /** Add new has global tag conditions to query. */
    hasGlobalTag(tag: string, value: string): void;
}
declare var TagQuery: TagQuery & { new(): TagQuery; prototype: TagQuery };

/**
 * Task
 * Plug-in: System (Core Classes)
 */
interface Task {
    /** Returns the Task's state. */
    readonly state: string;
    /** Returns the operation. */
    readonly operation: string;
    /** Returns the percent completed. */
    readonly percentCompleted: number;
    /** Returns a description of the error. */
    readonly error: string;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Returns the execution date. */
    executionDate: Date;
    /** Returns the execution parameters. */
    parameters: Properties;
    /** Returns restart in past flag. */
    restartInPast: boolean;
    /** Returns true if the task is a recurrent one. */
    readonly isRecurrent: boolean;
    /** Returns the task name. */
    readonly name: string;
    /** Return the associated workflow */
    readonly workflow: Workflow;
    /** Return the execution. */
    readonly executions: WorkflowToken[];
    /** Cancels the task. */
    cancel(): void;
    /** Suspends the task. */
    suspend(): void;
    /** Resumes the task. */
    resume(): void;
    /** Sets the execution parameters. */
    addParameter(key: string, value: any): void;
}
declare var Task: Task & { new(): Task; prototype: Task };

/**
 * TimeZone represents a time zone offset, and also figures out daylight savings.
 * Plug-in: System (Core Classes)
 */
interface TimeZone {
    /** Greenwich Mean Time */
    readonly AFRICA_ABIDJAN: string;
    /** Greenwich Mean Time */
    readonly AFRICA_ACCRA: string;
    /** East Africa Time */
    readonly AFRICA_ADDIS_ABABA: string;
    /** Central European Standard Time */
    readonly AFRICA_ALGIERS: string;
    /** East Africa Time */
    readonly AFRICA_ASMARA: string;
    /** East Africa Time */
    readonly AFRICA_ASMERA: string;
    /** Greenwich Mean Time */
    readonly AFRICA_BAMAKO: string;
    /** West Africa Standard Time */
    readonly AFRICA_BANGUI: string;
    /** Greenwich Mean Time */
    readonly AFRICA_BANJUL: string;
    /** Greenwich Mean Time */
    readonly AFRICA_BISSAU: string;
    /** Central Africa Time */
    readonly AFRICA_BLANTYRE: string;
    /** West Africa Standard Time */
    readonly AFRICA_BRAZZAVILLE: string;
    /** Central Africa Time */
    readonly AFRICA_BUJUMBURA: string;
    /** Eastern European Standard Time */
    readonly AFRICA_CAIRO: string;
    /** Western European Time */
    readonly AFRICA_CASABLANCA: string;
    /** Central European Standard Time */
    readonly AFRICA_CEUTA: string;
    /** Greenwich Mean Time */
    readonly AFRICA_CONAKRY: string;
    /** Greenwich Mean Time */
    readonly AFRICA_DAKAR: string;
    /** East Africa Time */
    readonly AFRICA_DAR_ES_SALAAM: string;
    /** East Africa Time */
    readonly AFRICA_DJIBOUTI: string;
    /** West Africa Standard Time */
    readonly AFRICA_DOUALA: string;
    /** Western European Time */
    readonly AFRICA_EL_AAIUN: string;
    /** Greenwich Mean Time */
    readonly AFRICA_FREETOWN: string;
    /** Central Africa Time */
    readonly AFRICA_GABORONE: string;
    /** Central Africa Time */
    readonly AFRICA_HARARE: string;
    /** South Africa Standard Time */
    readonly AFRICA_JOHANNESBURG: string;
    /** Central Africa Time */
    readonly AFRICA_JUBA: string;
    /** East Africa Time */
    readonly AFRICA_KAMPALA: string;
    /** Central Africa Time */
    readonly AFRICA_KHARTOUM: string;
    /** Central Africa Time */
    readonly AFRICA_KIGALI: string;
    /** West Africa Standard Time */
    readonly AFRICA_KINSHASA: string;
    /** West Africa Standard Time */
    readonly AFRICA_LAGOS: string;
    /** West Africa Standard Time */
    readonly AFRICA_LIBREVILLE: string;
    /** Greenwich Mean Time */
    readonly AFRICA_LOME: string;
    /** West Africa Standard Time */
    readonly AFRICA_LUANDA: string;
    /** Central Africa Time */
    readonly AFRICA_LUBUMBASHI: string;
    /** Central Africa Time */
    readonly AFRICA_LUSAKA: string;
    /** West Africa Standard Time */
    readonly AFRICA_MALABO: string;
    /** Central Africa Time */
    readonly AFRICA_MAPUTO: string;
    /** South Africa Standard Time */
    readonly AFRICA_MASERU: string;
    /** South Africa Standard Time */
    readonly AFRICA_MBABANE: string;
    /** East Africa Time */
    readonly AFRICA_MOGADISHU: string;
    /** Greenwich Mean Time */
    readonly AFRICA_MONROVIA: string;
    /** East Africa Time */
    readonly AFRICA_NAIROBI: string;
    /** West Africa Standard Time */
    readonly AFRICA_NDJAMENA: string;
    /** West Africa Standard Time */
    readonly AFRICA_NIAMEY: string;
    /** Greenwich Mean Time */
    readonly AFRICA_NOUAKCHOTT: string;
    /** Greenwich Mean Time */
    readonly AFRICA_OUAGADOUGOU: string;
    /** West Africa Standard Time */
    readonly AFRICA_PORTO_NOVO: string;
    /** Greenwich Mean Time */
    readonly AFRICA_SAO_TOME: string;
    /** Greenwich Mean Time */
    readonly AFRICA_TIMBUKTU: string;
    /** Eastern European Standard Time */
    readonly AFRICA_TRIPOLI: string;
    /** Central European Standard Time */
    readonly AFRICA_TUNIS: string;
    /** Central Africa Time */
    readonly AFRICA_WINDHOEK: string;
    /** Hawaii-Aleutian Standard Time */
    readonly AMERICA_ADAK: string;
    /** Alaska Standard Time */
    readonly AMERICA_ANCHORAGE: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ANGUILLA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ANTIGUA: string;
    /** Brasilia Standard Time */
    readonly AMERICA_ARAGUAINA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_BUENOS_AIRES: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_CATAMARCA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_COMODRIVADAVIA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_CORDOBA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_JUJUY: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_LA_RIOJA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_MENDOZA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_RIO_GALLEGOS: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_SALTA: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_SAN_JUAN: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_SAN_LUIS: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_TUCUMAN: string;
    /** Argentina Standard Time */
    readonly AMERICA_ARGENTINA_USHUAIA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ARUBA: string;
    /** Paraguay Standard Time */
    readonly AMERICA_ASUNCION: string;
    /** Eastern Standard Time */
    readonly AMERICA_ATIKOKAN: string;
    /** Hawaii-Aleutian Standard Time */
    readonly AMERICA_ATKA: string;
    /** Brasilia Standard Time */
    readonly AMERICA_BAHIA: string;
    /** Central Standard Time */
    readonly AMERICA_BAHIA_BANDERAS: string;
    /** Atlantic Standard Time */
    readonly AMERICA_BARBADOS: string;
    /** Brasilia Standard Time */
    readonly AMERICA_BELEM: string;
    /** Central Standard Time */
    readonly AMERICA_BELIZE: string;
    /** Atlantic Standard Time */
    readonly AMERICA_BLANC_SABLON: string;
    /** Amazon Standard Time */
    readonly AMERICA_BOA_VISTA: string;
    /** Colombia Standard Time */
    readonly AMERICA_BOGOTA: string;
    /** Mountain Standard Time */
    readonly AMERICA_BOISE: string;
    /** Argentina Standard Time */
    readonly AMERICA_BUENOS_AIRES: string;
    /** Mountain Standard Time */
    readonly AMERICA_CAMBRIDGE_BAY: string;
    /** Amazon Standard Time */
    readonly AMERICA_CAMPO_GRANDE: string;
    /** Eastern Standard Time */
    readonly AMERICA_CANCUN: string;
    /** Venezuela Time */
    readonly AMERICA_CARACAS: string;
    /** Argentina Standard Time */
    readonly AMERICA_CATAMARCA: string;
    /** French Guiana Time */
    readonly AMERICA_CAYENNE: string;
    /** Eastern Standard Time */
    readonly AMERICA_CAYMAN: string;
    /** Central Standard Time */
    readonly AMERICA_CHICAGO: string;
    /** Central Standard Time */
    readonly AMERICA_CHIHUAHUA: string;
    /** Mountain Standard Time */
    readonly AMERICA_CIUDAD_JUAREZ: string;
    /** Eastern Standard Time */
    readonly AMERICA_CORAL_HARBOUR: string;
    /** Argentina Standard Time */
    readonly AMERICA_CORDOBA: string;
    /** Central Standard Time */
    readonly AMERICA_COSTA_RICA: string;
    /** Mountain Standard Time */
    readonly AMERICA_CRESTON: string;
    /** Amazon Standard Time */
    readonly AMERICA_CUIABA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_CURACAO: string;
    /** Greenwich Mean Time */
    readonly AMERICA_DANMARKSHAVN: string;
    /** Mountain Standard Time */
    readonly AMERICA_DAWSON: string;
    /** Mountain Standard Time */
    readonly AMERICA_DAWSON_CREEK: string;
    /** Mountain Standard Time */
    readonly AMERICA_DENVER: string;
    /** Eastern Standard Time */
    readonly AMERICA_DETROIT: string;
    /** Atlantic Standard Time */
    readonly AMERICA_DOMINICA: string;
    /** Mountain Standard Time */
    readonly AMERICA_EDMONTON: string;
    /** Acre Standard Time */
    readonly AMERICA_EIRUNEPE: string;
    /** Central Standard Time */
    readonly AMERICA_EL_SALVADOR: string;
    /** Pacific Standard Time */
    readonly AMERICA_ENSENADA: string;
    /** Mountain Standard Time */
    readonly AMERICA_FORT_NELSON: string;
    /** Eastern Standard Time */
    readonly AMERICA_FORT_WAYNE: string;
    /** Brasilia Standard Time */
    readonly AMERICA_FORTALEZA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_GLACE_BAY: string;
    /** West Greenland Standard Time */
    readonly AMERICA_GODTHAB: string;
    /** Atlantic Standard Time */
    readonly AMERICA_GOOSE_BAY: string;
    /** Eastern Standard Time */
    readonly AMERICA_GRAND_TURK: string;
    /** Atlantic Standard Time */
    readonly AMERICA_GRENADA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_GUADELOUPE: string;
    /** Central Standard Time */
    readonly AMERICA_GUATEMALA: string;
    /** Ecuador Time */
    readonly AMERICA_GUAYAQUIL: string;
    /** Guyana Time */
    readonly AMERICA_GUYANA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_HALIFAX: string;
    /** Cuba Standard Time */
    readonly AMERICA_HAVANA: string;
    /** Mexican Pacific Standard Time */
    readonly AMERICA_HERMOSILLO: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANA_INDIANAPOLIS: string;
    /** Central Standard Time */
    readonly AMERICA_INDIANA_KNOX: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANA_MARENGO: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANA_PETERSBURG: string;
    /** Central Standard Time */
    readonly AMERICA_INDIANA_TELL_CITY: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANA_VEVAY: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANA_VINCENNES: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANA_WINAMAC: string;
    /** Eastern Standard Time */
    readonly AMERICA_INDIANAPOLIS: string;
    /** Mountain Standard Time */
    readonly AMERICA_INUVIK: string;
    /** Eastern Standard Time */
    readonly AMERICA_IQALUIT: string;
    /** Eastern Standard Time */
    readonly AMERICA_JAMAICA: string;
    /** Argentina Standard Time */
    readonly AMERICA_JUJUY: string;
    /** Alaska Standard Time */
    readonly AMERICA_JUNEAU: string;
    /** Eastern Standard Time */
    readonly AMERICA_KENTUCKY_LOUISVILLE: string;
    /** Eastern Standard Time */
    readonly AMERICA_KENTUCKY_MONTICELLO: string;
    /** Central Standard Time */
    readonly AMERICA_KNOX_IN: string;
    /** Atlantic Standard Time */
    readonly AMERICA_KRALENDIJK: string;
    /** Bolivia Time */
    readonly AMERICA_LA_PAZ: string;
    /** Peru Standard Time */
    readonly AMERICA_LIMA: string;
    /** Pacific Standard Time */
    readonly AMERICA_LOS_ANGELES: string;
    /** Eastern Standard Time */
    readonly AMERICA_LOUISVILLE: string;
    /** Atlantic Standard Time */
    readonly AMERICA_LOWER_PRINCES: string;
    /** Brasilia Standard Time */
    readonly AMERICA_MACEIO: string;
    /** Central Standard Time */
    readonly AMERICA_MANAGUA: string;
    /** Amazon Standard Time */
    readonly AMERICA_MANAUS: string;
    /** Atlantic Standard Time */
    readonly AMERICA_MARIGOT: string;
    /** Atlantic Standard Time */
    readonly AMERICA_MARTINIQUE: string;
    /** Central Standard Time */
    readonly AMERICA_MATAMOROS: string;
    /** Mexican Pacific Standard Time */
    readonly AMERICA_MAZATLAN: string;
    /** Argentina Standard Time */
    readonly AMERICA_MENDOZA: string;
    /** Central Standard Time */
    readonly AMERICA_MENOMINEE: string;
    /** Central Standard Time */
    readonly AMERICA_MERIDA: string;
    /** Alaska Standard Time */
    readonly AMERICA_METLAKATLA: string;
    /** Central Standard Time */
    readonly AMERICA_MEXICO_CITY: string;
    /** St. Pierre & Miquelon Standard Time */
    readonly AMERICA_MIQUELON: string;
    /** Atlantic Standard Time */
    readonly AMERICA_MONCTON: string;
    /** Central Standard Time */
    readonly AMERICA_MONTERREY: string;
    /** Uruguay Standard Time */
    readonly AMERICA_MONTEVIDEO: string;
    /** Eastern Standard Time */
    readonly AMERICA_MONTREAL: string;
    /** Atlantic Standard Time */
    readonly AMERICA_MONTSERRAT: string;
    /** Eastern Standard Time */
    readonly AMERICA_NASSAU: string;
    /** Eastern Standard Time */
    readonly AMERICA_NEW_YORK: string;
    /** Eastern Standard Time */
    readonly AMERICA_NIPIGON: string;
    /** Alaska Standard Time */
    readonly AMERICA_NOME: string;
    /** Fernando de Noronha Standard Time */
    readonly AMERICA_NORONHA: string;
    /** Central Standard Time */
    readonly AMERICA_NORTH_DAKOTA_BEULAH: string;
    /** Central Standard Time */
    readonly AMERICA_NORTH_DAKOTA_CENTER: string;
    /** Central Standard Time */
    readonly AMERICA_NORTH_DAKOTA_NEW_SALEM: string;
    /** West Greenland Standard Time */
    readonly AMERICA_NUUK: string;
    /** Central Standard Time */
    readonly AMERICA_OJINAGA: string;
    /** Eastern Standard Time */
    readonly AMERICA_PANAMA: string;
    /** Eastern Standard Time */
    readonly AMERICA_PANGNIRTUNG: string;
    /** Suriname Time */
    readonly AMERICA_PARAMARIBO: string;
    /** Mountain Standard Time */
    readonly AMERICA_PHOENIX: string;
    /** Eastern Standard Time */
    readonly AMERICA_PORT_AU_PRINCE: string;
    /** Atlantic Standard Time */
    readonly AMERICA_PORT_OF_SPAIN: string;
    /** Acre Standard Time */
    readonly AMERICA_PORTO_ACRE: string;
    /** Amazon Standard Time */
    readonly AMERICA_PORTO_VELHO: string;
    /** Atlantic Standard Time */
    readonly AMERICA_PUERTO_RICO: string;
    /** Punta Arenas Standard Time */
    readonly AMERICA_PUNTA_ARENAS: string;
    /** Central Standard Time */
    readonly AMERICA_RAINY_RIVER: string;
    /** Central Standard Time */
    readonly AMERICA_RANKIN_INLET: string;
    /** Brasilia Standard Time */
    readonly AMERICA_RECIFE: string;
    /** Central Standard Time */
    readonly AMERICA_REGINA: string;
    /** Central Standard Time */
    readonly AMERICA_RESOLUTE: string;
    /** Acre Standard Time */
    readonly AMERICA_RIO_BRANCO: string;
    /** Argentina Standard Time */
    readonly AMERICA_ROSARIO: string;
    /** Northwest Mexico Standard Time */
    readonly AMERICA_SANTA_ISABEL: string;
    /** Brasilia Standard Time */
    readonly AMERICA_SANTAREM: string;
    /** Chile Standard Time */
    readonly AMERICA_SANTIAGO: string;
    /** Atlantic Standard Time */
    readonly AMERICA_SANTO_DOMINGO: string;
    /** Brasilia Standard Time */
    readonly AMERICA_SAO_PAULO: string;
    /** East Greenland Standard Time */
    readonly AMERICA_SCORESBYSUND: string;
    /** Mountain Standard Time */
    readonly AMERICA_SHIPROCK: string;
    /** Alaska Standard Time */
    readonly AMERICA_SITKA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ST_BARTHELEMY: string;
    /** Newfoundland Standard Time */
    readonly AMERICA_ST_JOHNS: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ST_KITTS: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ST_LUCIA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ST_THOMAS: string;
    /** Atlantic Standard Time */
    readonly AMERICA_ST_VINCENT: string;
    /** Central Standard Time */
    readonly AMERICA_SWIFT_CURRENT: string;
    /** Central Standard Time */
    readonly AMERICA_TEGUCIGALPA: string;
    /** Atlantic Standard Time */
    readonly AMERICA_THULE: string;
    /** Eastern Standard Time */
    readonly AMERICA_THUNDER_BAY: string;
    /** Pacific Standard Time */
    readonly AMERICA_TIJUANA: string;
    /** Eastern Standard Time */
    readonly AMERICA_TORONTO: string;
    /** Atlantic Standard Time */
    readonly AMERICA_TORTOLA: string;
    /** Pacific Standard Time */
    readonly AMERICA_VANCOUVER: string;
    /** Atlantic Standard Time */
    readonly AMERICA_VIRGIN: string;
    /** Mountain Standard Time */
    readonly AMERICA_WHITEHORSE: string;
    /** Central Standard Time */
    readonly AMERICA_WINNIPEG: string;
    /** Alaska Standard Time */
    readonly AMERICA_YAKUTAT: string;
    /** Mountain Standard Time */
    readonly AMERICA_YELLOWKNIFE: string;
    /** Casey Time */
    readonly ANTARCTICA_CASEY: string;
    /** Davis Time */
    readonly ANTARCTICA_DAVIS: string;
    /** Dumont-d’Urville Time */
    readonly ANTARCTICA_DUMONTDURVILLE: string;
    /** Australian Eastern Standard Time */
    readonly ANTARCTICA_MACQUARIE: string;
    /** Mawson Time */
    readonly ANTARCTICA_MAWSON: string;
    /** New Zealand Standard Time */
    readonly ANTARCTICA_MCMURDO: string;
    /** Chile Time */
    readonly ANTARCTICA_PALMER: string;
    /** Rothera Time */
    readonly ANTARCTICA_ROTHERA: string;
    /** New Zealand Standard Time */
    readonly ANTARCTICA_SOUTH_POLE: string;
    /** Syowa Time */
    readonly ANTARCTICA_SYOWA: string;
    /** Greenwich Mean Time */
    readonly ANTARCTICA_TROLL: string;
    /** Vostok Time */
    readonly ANTARCTICA_VOSTOK: string;
    /** Central European Standard Time */
    readonly ARCTIC_LONGYEARBYEN: string;
    /** Arabian Standard Time */
    readonly ASIA_ADEN: string;
    /** East Kazakhstan Time */
    readonly ASIA_ALMATY: string;
    /** Eastern European Standard Time */
    readonly ASIA_AMMAN: string;
    /** Anadyr Standard Time */
    readonly ASIA_ANADYR: string;
    /** West Kazakhstan Time */
    readonly ASIA_AQTAU: string;
    /** West Kazakhstan Time */
    readonly ASIA_AQTOBE: string;
    /** Turkmenistan Standard Time */
    readonly ASIA_ASHGABAT: string;
    /** Turkmenistan Standard Time */
    readonly ASIA_ASHKHABAD: string;
    /** West Kazakhstan Time */
    readonly ASIA_ATYRAU: string;
    /** Arabian Standard Time */
    readonly ASIA_BAGHDAD: string;
    /** Arabian Standard Time */
    readonly ASIA_BAHRAIN: string;
    /** Azerbaijan Standard Time */
    readonly ASIA_BAKU: string;
    /** Indochina Time */
    readonly ASIA_BANGKOK: string;
    /** Barnaul Standard Time */
    readonly ASIA_BARNAUL: string;
    /** Eastern European Standard Time */
    readonly ASIA_BEIRUT: string;
    /** Kyrgyzstan Time */
    readonly ASIA_BISHKEK: string;
    /** Brunei Darussalam Time */
    readonly ASIA_BRUNEI: string;
    /** India Standard Time */
    readonly ASIA_CALCUTTA: string;
    /** Yakutsk Standard Time */
    readonly ASIA_CHITA: string;
    /** Ulaanbaatar Standard Time */
    readonly ASIA_CHOIBALSAN: string;
    /** China Standard Time */
    readonly ASIA_CHONGQING: string;
    /** China Standard Time */
    readonly ASIA_CHUNGKING: string;
    /** India Standard Time */
    readonly ASIA_COLOMBO: string;
    /** Bangladesh Standard Time */
    readonly ASIA_DACCA: string;
    /** Eastern European Standard Time */
    readonly ASIA_DAMASCUS: string;
    /** Bangladesh Standard Time */
    readonly ASIA_DHAKA: string;
    /** East Timor Time */
    readonly ASIA_DILI: string;
    /** Gulf Standard Time */
    readonly ASIA_DUBAI: string;
    /** Tajikistan Time */
    readonly ASIA_DUSHANBE: string;
    /** Eastern European Time */
    readonly ASIA_FAMAGUSTA: string;
    /** Eastern European Standard Time */
    readonly ASIA_GAZA: string;
    /** China Standard Time */
    readonly ASIA_HARBIN: string;
    /** Eastern European Standard Time */
    readonly ASIA_HEBRON: string;
    /** Indochina Time */
    readonly ASIA_HO_CHI_MINH: string;
    /** Hong Kong Standard Time */
    readonly ASIA_HONG_KONG: string;
    /** Hovd Standard Time */
    readonly ASIA_HOVD: string;
    /** Irkutsk Standard Time */
    readonly ASIA_IRKUTSK: string;
    /** Turkey Time */
    readonly ASIA_ISTANBUL: string;
    /** Western Indonesia Time */
    readonly ASIA_JAKARTA: string;
    /** Eastern Indonesia Time */
    readonly ASIA_JAYAPURA: string;
    /** Israel Standard Time */
    readonly ASIA_JERUSALEM: string;
    /** Afghanistan Time */
    readonly ASIA_KABUL: string;
    /** Petropavlovsk-Kamchatski Standard Time */
    readonly ASIA_KAMCHATKA: string;
    /** Pakistan Standard Time */
    readonly ASIA_KARACHI: string;
    /** Xinjiang Standard Time */
    readonly ASIA_KASHGAR: string;
    /** Nepal Time */
    readonly ASIA_KATHMANDU: string;
    /** Nepal Time */
    readonly ASIA_KATMANDU: string;
    /** Yakutsk Standard Time */
    readonly ASIA_KHANDYGA: string;
    /** India Standard Time */
    readonly ASIA_KOLKATA: string;
    /** Krasnoyarsk Standard Time */
    readonly ASIA_KRASNOYARSK: string;
    /** Malaysia Time */
    readonly ASIA_KUALA_LUMPUR: string;
    /** Malaysia Time */
    readonly ASIA_KUCHING: string;
    /** Arabian Standard Time */
    readonly ASIA_KUWAIT: string;
    /** China Standard Time */
    readonly ASIA_MACAO: string;
    /** China Standard Time */
    readonly ASIA_MACAU: string;
    /** Magadan Standard Time */
    readonly ASIA_MAGADAN: string;
    /** Central Indonesia Time */
    readonly ASIA_MAKASSAR: string;
    /** Philippine Standard Time */
    readonly ASIA_MANILA: string;
    /** Gulf Standard Time */
    readonly ASIA_MUSCAT: string;
    /** Eastern European Standard Time */
    readonly ASIA_NICOSIA: string;
    /** Krasnoyarsk Standard Time */
    readonly ASIA_NOVOKUZNETSK: string;
    /** Novosibirsk Standard Time */
    readonly ASIA_NOVOSIBIRSK: string;
    /** Omsk Standard Time */
    readonly ASIA_OMSK: string;
    /** West Kazakhstan Time */
    readonly ASIA_ORAL: string;
    /** Indochina Time */
    readonly ASIA_PHNOM_PENH: string;
    /** Western Indonesia Time */
    readonly ASIA_PONTIANAK: string;
    /** Korean Standard Time */
    readonly ASIA_PYONGYANG: string;
    /** Arabian Standard Time */
    readonly ASIA_QATAR: string;
    /** East Kazakhstan Time */
    readonly ASIA_QOSTANAY: string;
    /** West Kazakhstan Time */
    readonly ASIA_QYZYLORDA: string;
    /** Myanmar Time */
    readonly ASIA_RANGOON: string;
    /** Arabian Standard Time */
    readonly ASIA_RIYADH: string;
    /** Indochina Time */
    readonly ASIA_SAIGON: string;
    /** Sakhalin Standard Time */
    readonly ASIA_SAKHALIN: string;
    /** Uzbekistan Standard Time */
    readonly ASIA_SAMARKAND: string;
    /** Korean Standard Time */
    readonly ASIA_SEOUL: string;
    /** China Standard Time */
    readonly ASIA_SHANGHAI: string;
    /** Singapore Standard Time */
    readonly ASIA_SINGAPORE: string;
    /** Srednekolymsk Time */
    readonly ASIA_SREDNEKOLYMSK: string;
    /** Taipei Standard Time */
    readonly ASIA_TAIPEI: string;
    /** Uzbekistan Standard Time */
    readonly ASIA_TASHKENT: string;
    /** Georgia Standard Time */
    readonly ASIA_TBILISI: string;
    /** Iran Standard Time */
    readonly ASIA_TEHRAN: string;
    /** Israel Standard Time */
    readonly ASIA_TEL_AVIV: string;
    /** Bhutan Time */
    readonly ASIA_THIMBU: string;
    /** Bhutan Time */
    readonly ASIA_THIMPHU: string;
    /** Japan Standard Time */
    readonly ASIA_TOKYO: string;
    /** Tomsk Standard Time */
    readonly ASIA_TOMSK: string;
    /** Central Indonesia Time */
    readonly ASIA_UJUNG_PANDANG: string;
    /** Ulaanbaatar Standard Time */
    readonly ASIA_ULAANBAATAR: string;
    /** Ulaanbaatar Standard Time */
    readonly ASIA_ULAN_BATOR: string;
    /** Xinjiang Standard Time */
    readonly ASIA_URUMQI: string;
    /** Vladivostok Standard Time */
    readonly ASIA_UST_NERA: string;
    /** Indochina Time */
    readonly ASIA_VIENTIANE: string;
    /** Vladivostok Standard Time */
    readonly ASIA_VLADIVOSTOK: string;
    /** Yakutsk Standard Time */
    readonly ASIA_YAKUTSK: string;
    /** Myanmar Time */
    readonly ASIA_YANGON: string;
    /** Yekaterinburg Standard Time */
    readonly ASIA_YEKATERINBURG: string;
    /** Armenia Standard Time */
    readonly ASIA_YEREVAN: string;
    /** Azores Standard Time */
    readonly ATLANTIC_AZORES: string;
    /** Atlantic Standard Time */
    readonly ATLANTIC_BERMUDA: string;
    /** Western European Standard Time */
    readonly ATLANTIC_CANARY: string;
    /** Cape Verde Standard Time */
    readonly ATLANTIC_CAPE_VERDE: string;
    /** Western European Standard Time */
    readonly ATLANTIC_FAEROE: string;
    /** Western European Standard Time */
    readonly ATLANTIC_FAROE: string;
    /** Central European Standard Time */
    readonly ATLANTIC_JAN_MAYEN: string;
    /** Western European Standard Time */
    readonly ATLANTIC_MADEIRA: string;
    /** Greenwich Mean Time */
    readonly ATLANTIC_REYKJAVIK: string;
    /** South Georgia Time */
    readonly ATLANTIC_SOUTH_GEORGIA: string;
    /** Greenwich Mean Time */
    readonly ATLANTIC_ST_HELENA: string;
    /** Falkland Islands Standard Time */
    readonly ATLANTIC_STANLEY: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_ACT: string;
    /** Australian Central Standard Time */
    readonly AUSTRALIA_ADELAIDE: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_BRISBANE: string;
    /** Australian Central Standard Time */
    readonly AUSTRALIA_BROKEN_HILL: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_CANBERRA: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_CURRIE: string;
    /** Australian Central Standard Time */
    readonly AUSTRALIA_DARWIN: string;
    /** Australian Central Western Standard Time */
    readonly AUSTRALIA_EUCLA: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_HOBART: string;
    /** Lord Howe Standard Time */
    readonly AUSTRALIA_LHI: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_LINDEMAN: string;
    /** Lord Howe Standard Time */
    readonly AUSTRALIA_LORD_HOWE: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_MELBOURNE: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_NSW: string;
    /** Australian Central Standard Time */
    readonly AUSTRALIA_NORTH: string;
    /** Australian Western Standard Time */
    readonly AUSTRALIA_PERTH: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_QUEENSLAND: string;
    /** Australian Central Standard Time */
    readonly AUSTRALIA_SOUTH: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_SYDNEY: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_TASMANIA: string;
    /** Australian Eastern Standard Time */
    readonly AUSTRALIA_VICTORIA: string;
    /** Australian Western Standard Time */
    readonly AUSTRALIA_WEST: string;
    /** Australian Central Standard Time */
    readonly AUSTRALIA_YANCOWINNA: string;
    /** Acre Standard Time */
    readonly BRAZIL_ACRE: string;
    /** Fernando de Noronha Standard Time */
    readonly BRAZIL_DENORONHA: string;
    /** Brasilia Standard Time */
    readonly BRAZIL_EAST: string;
    /** Amazon Standard Time */
    readonly BRAZIL_WEST: string;
    /** Central European Time */
    readonly CET: string;
    /** Central Standard Time */
    readonly CST6CDT: string;
    /** Atlantic Standard Time */
    readonly CANADA_ATLANTIC: string;
    /** Central Standard Time */
    readonly CANADA_CENTRAL: string;
    /** Eastern Standard Time */
    readonly CANADA_EASTERN: string;
    /** Mountain Standard Time */
    readonly CANADA_MOUNTAIN: string;
    /** Newfoundland Standard Time */
    readonly CANADA_NEWFOUNDLAND: string;
    /** Pacific Standard Time */
    readonly CANADA_PACIFIC: string;
    /** Central Standard Time */
    readonly CANADA_SASKATCHEWAN: string;
    /** Mountain Standard Time */
    readonly CANADA_YUKON: string;
    /** Chile Standard Time */
    readonly CHILE_CONTINENTAL: string;
    /** Easter Island Standard Time */
    readonly CHILE_EASTERISLAND: string;
    /** Cuba Standard Time */
    readonly CUBA: string;
    /** Eastern European Time */
    readonly EET: string;
    /** Eastern Standard Time */
    readonly EST5EDT: string;
    /** Eastern European Standard Time */
    readonly EGYPT: string;
    /** Greenwich Mean Time */
    readonly EIRE: string;
    /** Greenwich Mean Time */
    readonly ETC_GMT: string;
    /** Greenwich Mean Time */
    readonly ETC_GMT_PLUS_0: string;
    /** GMT-01:00 */
    readonly ETC_GMT_PLUS_1: string;
    /** GMT-10:00 */
    readonly ETC_GMT_PLUS_10: string;
    /** GMT-11:00 */
    readonly ETC_GMT_PLUS_11: string;
    /** GMT-12:00 */
    readonly ETC_GMT_PLUS_12: string;
    /** GMT-02:00 */
    readonly ETC_GMT_PLUS_2: string;
    /** GMT-03:00 */
    readonly ETC_GMT_PLUS_3: string;
    /** GMT-04:00 */
    readonly ETC_GMT_PLUS_4: string;
    /** GMT-05:00 */
    readonly ETC_GMT_PLUS_5: string;
    /** GMT-06:00 */
    readonly ETC_GMT_PLUS_6: string;
    /** GMT-07:00 */
    readonly ETC_GMT_PLUS_7: string;
    /** GMT-08:00 */
    readonly ETC_GMT_PLUS_8: string;
    /** GMT-09:00 */
    readonly ETC_GMT_PLUS_9: string;
    /** Greenwich Mean Time */
    readonly ETC_GMT_MINUS_0: string;
    /** GMT+01:00 */
    readonly ETC_GMT_MINUS_1: string;
    /** GMT+10:00 */
    readonly ETC_GMT_MINUS_10: string;
    /** GMT+11:00 */
    readonly ETC_GMT_MINUS_11: string;
    /** GMT+12:00 */
    readonly ETC_GMT_MINUS_12: string;
    /** GMT+13:00 */
    readonly ETC_GMT_MINUS_13: string;
    /** GMT+14:00 */
    readonly ETC_GMT_MINUS_14: string;
    /** GMT+02:00 */
    readonly ETC_GMT_MINUS_2: string;
    /** GMT+03:00 */
    readonly ETC_GMT_MINUS_3: string;
    /** GMT+04:00 */
    readonly ETC_GMT_MINUS_4: string;
    /** GMT+05:00 */
    readonly ETC_GMT_MINUS_5: string;
    /** GMT+06:00 */
    readonly ETC_GMT_MINUS_6: string;
    /** GMT+07:00 */
    readonly ETC_GMT_MINUS_7: string;
    /** GMT+08:00 */
    readonly ETC_GMT_MINUS_8: string;
    /** GMT+09:00 */
    readonly ETC_GMT_MINUS_9: string;
    /** Greenwich Mean Time */
    readonly ETC_GMT0: string;
    /** Greenwich Mean Time */
    readonly ETC_GREENWICH: string;
    /** Coordinated Universal Time */
    readonly ETC_UCT: string;
    /** Coordinated Universal Time */
    readonly ETC_UTC: string;
    /** Coordinated Universal Time */
    readonly ETC_UNIVERSAL: string;
    /** Coordinated Universal Time */
    readonly ETC_ZULU: string;
    /** Central European Standard Time */
    readonly EUROPE_AMSTERDAM: string;
    /** Central European Standard Time */
    readonly EUROPE_ANDORRA: string;
    /** Astrakhan Standard Time */
    readonly EUROPE_ASTRAKHAN: string;
    /** Eastern European Standard Time */
    readonly EUROPE_ATHENS: string;
    /** Greenwich Mean Time */
    readonly EUROPE_BELFAST: string;
    /** Central European Standard Time */
    readonly EUROPE_BELGRADE: string;
    /** Central European Standard Time */
    readonly EUROPE_BERLIN: string;
    /** Central European Standard Time */
    readonly EUROPE_BRATISLAVA: string;
    /** Central European Standard Time */
    readonly EUROPE_BRUSSELS: string;
    /** Eastern European Standard Time */
    readonly EUROPE_BUCHAREST: string;
    /** Central European Standard Time */
    readonly EUROPE_BUDAPEST: string;
    /** Central European Standard Time */
    readonly EUROPE_BUSINGEN: string;
    /** Eastern European Standard Time */
    readonly EUROPE_CHISINAU: string;
    /** Central European Standard Time */
    readonly EUROPE_COPENHAGEN: string;
    /** Greenwich Mean Time */
    readonly EUROPE_DUBLIN: string;
    /** Central European Standard Time */
    readonly EUROPE_GIBRALTAR: string;
    /** Greenwich Mean Time */
    readonly EUROPE_GUERNSEY: string;
    /** Eastern European Standard Time */
    readonly EUROPE_HELSINKI: string;
    /** Greenwich Mean Time */
    readonly EUROPE_ISLE_OF_MAN: string;
    /** Turkey Time */
    readonly EUROPE_ISTANBUL: string;
    /** Greenwich Mean Time */
    readonly EUROPE_JERSEY: string;
    /** Eastern European Standard Time */
    readonly EUROPE_KALININGRAD: string;
    /** Eastern European Standard Time */
    readonly EUROPE_KIEV: string;
    /** Moscow Standard Time */
    readonly EUROPE_KIROV: string;
    /** Eastern European Standard Time */
    readonly EUROPE_KYIV: string;
    /** Western European Standard Time */
    readonly EUROPE_LISBON: string;
    /** Central European Standard Time */
    readonly EUROPE_LJUBLJANA: string;
    /** Greenwich Mean Time */
    readonly EUROPE_LONDON: string;
    /** Central European Standard Time */
    readonly EUROPE_LUXEMBOURG: string;
    /** Central European Standard Time */
    readonly EUROPE_MADRID: string;
    /** Central European Standard Time */
    readonly EUROPE_MALTA: string;
    /** Eastern European Standard Time */
    readonly EUROPE_MARIEHAMN: string;
    /** Moscow Standard Time */
    readonly EUROPE_MINSK: string;
    /** Central European Standard Time */
    readonly EUROPE_MONACO: string;
    /** Moscow Standard Time */
    readonly EUROPE_MOSCOW: string;
    /** Eastern European Standard Time */
    readonly EUROPE_NICOSIA: string;
    /** Central European Standard Time */
    readonly EUROPE_OSLO: string;
    /** Central European Standard Time */
    readonly EUROPE_PARIS: string;
    /** Central European Standard Time */
    readonly EUROPE_PODGORICA: string;
    /** Central European Standard Time */
    readonly EUROPE_PRAGUE: string;
    /** Eastern European Standard Time */
    readonly EUROPE_RIGA: string;
    /** Central European Standard Time */
    readonly EUROPE_ROME: string;
    /** Samara Standard Time */
    readonly EUROPE_SAMARA: string;
    /** Central European Standard Time */
    readonly EUROPE_SAN_MARINO: string;
    /** Central European Standard Time */
    readonly EUROPE_SARAJEVO: string;
    /** Saratov Standard Time */
    readonly EUROPE_SARATOV: string;
    /** Moscow Standard Time */
    readonly EUROPE_SIMFEROPOL: string;
    /** Central European Standard Time */
    readonly EUROPE_SKOPJE: string;
    /** Eastern European Standard Time */
    readonly EUROPE_SOFIA: string;
    /** Central European Standard Time */
    readonly EUROPE_STOCKHOLM: string;
    /** Eastern European Standard Time */
    readonly EUROPE_TALLINN: string;
    /** Central European Standard Time */
    readonly EUROPE_TIRANE: string;
    /** Eastern European Standard Time */
    readonly EUROPE_TIRASPOL: string;
    /** Ulyanovsk Standard Time */
    readonly EUROPE_ULYANOVSK: string;
    /** Eastern European Standard Time */
    readonly EUROPE_UZHGOROD: string;
    /** Central European Standard Time */
    readonly EUROPE_VADUZ: string;
    /** Central European Standard Time */
    readonly EUROPE_VATICAN: string;
    /** Central European Standard Time */
    readonly EUROPE_VIENNA: string;
    /** Eastern European Standard Time */
    readonly EUROPE_VILNIUS: string;
    /** Volgograd Standard Time */
    readonly EUROPE_VOLGOGRAD: string;
    /** Central European Standard Time */
    readonly EUROPE_WARSAW: string;
    /** Central European Standard Time */
    readonly EUROPE_ZAGREB: string;
    /** Eastern European Standard Time */
    readonly EUROPE_ZAPOROZHYE: string;
    /** Central European Standard Time */
    readonly EUROPE_ZURICH: string;
    /** Greenwich Mean Time */
    readonly GB: string;
    /** Greenwich Mean Time */
    readonly GB_EIRE: string;
    /** Greenwich Mean Time */
    readonly GMT: string;
    /** Greenwich Mean Time */
    readonly GMT0: string;
    /** Greenwich Mean Time */
    readonly GREENWICH: string;
    /** Hong Kong Standard Time */
    readonly HONGKONG: string;
    /** Greenwich Mean Time */
    readonly ICELAND: string;
    /** East Africa Time */
    readonly INDIAN_ANTANANARIVO: string;
    /** Indian Ocean Time */
    readonly INDIAN_CHAGOS: string;
    /** Christmas Island Time */
    readonly INDIAN_CHRISTMAS: string;
    /** Cocos Islands Time */
    readonly INDIAN_COCOS: string;
    /** East Africa Time */
    readonly INDIAN_COMORO: string;
    /** French Southern & Antarctic Time */
    readonly INDIAN_KERGUELEN: string;
    /** Seychelles Time */
    readonly INDIAN_MAHE: string;
    /** Maldives Time */
    readonly INDIAN_MALDIVES: string;
    /** Mauritius Standard Time */
    readonly INDIAN_MAURITIUS: string;
    /** East Africa Time */
    readonly INDIAN_MAYOTTE: string;
    /** Réunion Time */
    readonly INDIAN_REUNION: string;
    /** Iran Standard Time */
    readonly IRAN: string;
    /** Israel Standard Time */
    readonly ISRAEL: string;
    /** Eastern Standard Time */
    readonly JAMAICA: string;
    /** Japan Standard Time */
    readonly JAPAN: string;
    /** Marshall Islands Time */
    readonly KWAJALEIN: string;
    /** Eastern European Standard Time */
    readonly LIBYA: string;
    /** Middle Europe Time */
    readonly MET: string;
    /** Mountain Standard Time */
    readonly MST7MDT: string;
    /** Pacific Standard Time */
    readonly MEXICO_BAJANORTE: string;
    /** Mexican Pacific Standard Time */
    readonly MEXICO_BAJASUR: string;
    /** Central Standard Time */
    readonly MEXICO_GENERAL: string;
    /** New Zealand Standard Time */
    readonly NZ: string;
    /** Chatham Standard Time */
    readonly NZ_CHAT: string;
    /** Mountain Standard Time */
    readonly NAVAJO: string;
    /** China Standard Time */
    readonly PRC: string;
    /** Pacific Standard Time */
    readonly PST8PDT: string;
    /** Apia Standard Time */
    readonly PACIFIC_APIA: string;
    /** New Zealand Standard Time */
    readonly PACIFIC_AUCKLAND: string;
    /** Bougainville Standard Time */
    readonly PACIFIC_BOUGAINVILLE: string;
    /** Chatham Standard Time */
    readonly PACIFIC_CHATHAM: string;
    /** Chuuk Time */
    readonly PACIFIC_CHUUK: string;
    /** Easter Island Standard Time */
    readonly PACIFIC_EASTER: string;
    /** Vanuatu Standard Time */
    readonly PACIFIC_EFATE: string;
    /** Phoenix Islands Time */
    readonly PACIFIC_ENDERBURY: string;
    /** Tokelau Time */
    readonly PACIFIC_FAKAOFO: string;
    /** Fiji Standard Time */
    readonly PACIFIC_FIJI: string;
    /** Tuvalu Time */
    readonly PACIFIC_FUNAFUTI: string;
    /** Galapagos Time */
    readonly PACIFIC_GALAPAGOS: string;
    /** Gambier Time */
    readonly PACIFIC_GAMBIER: string;
    /** Solomon Islands Time */
    readonly PACIFIC_GUADALCANAL: string;
    /** Chamorro Standard Time */
    readonly PACIFIC_GUAM: string;
    /** Hawaii-Aleutian Standard Time */
    readonly PACIFIC_HONOLULU: string;
    /** Hawaii-Aleutian Standard Time */
    readonly PACIFIC_JOHNSTON: string;
    /** Kanton Standard Time */
    readonly PACIFIC_KANTON: string;
    /** Line Islands Time */
    readonly PACIFIC_KIRITIMATI: string;
    /** Kosrae Time */
    readonly PACIFIC_KOSRAE: string;
    /** Marshall Islands Time */
    readonly PACIFIC_KWAJALEIN: string;
    /** Marshall Islands Time */
    readonly PACIFIC_MAJURO: string;
    /** Marquesas Time */
    readonly PACIFIC_MARQUESAS: string;
    /** Samoa Standard Time */
    readonly PACIFIC_MIDWAY: string;
    /** Nauru Time */
    readonly PACIFIC_NAURU: string;
    /** Niue Time */
    readonly PACIFIC_NIUE: string;
    /** Norfolk Island Standard Time */
    readonly PACIFIC_NORFOLK: string;
    /** New Caledonia Standard Time */
    readonly PACIFIC_NOUMEA: string;
    /** Samoa Standard Time */
    readonly PACIFIC_PAGO_PAGO: string;
    /** Palau Time */
    readonly PACIFIC_PALAU: string;
    /** Pitcairn Time */
    readonly PACIFIC_PITCAIRN: string;
    /** Ponape Time */
    readonly PACIFIC_POHNPEI: string;
    /** Ponape Time */
    readonly PACIFIC_PONAPE: string;
    /** Papua New Guinea Time */
    readonly PACIFIC_PORT_MORESBY: string;
    /** Cook Islands Standard Time */
    readonly PACIFIC_RAROTONGA: string;
    /** Chamorro Standard Time */
    readonly PACIFIC_SAIPAN: string;
    /** Samoa Standard Time */
    readonly PACIFIC_SAMOA: string;
    /** Tahiti Time */
    readonly PACIFIC_TAHITI: string;
    /** Gilbert Islands Time */
    readonly PACIFIC_TARAWA: string;
    /** Tonga Standard Time */
    readonly PACIFIC_TONGATAPU: string;
    /** Chuuk Time */
    readonly PACIFIC_TRUK: string;
    /** Wake Island Time */
    readonly PACIFIC_WAKE: string;
    /** Wallis & Futuna Time */
    readonly PACIFIC_WALLIS: string;
    /** Chuuk Time */
    readonly PACIFIC_YAP: string;
    /** Central European Standard Time */
    readonly POLAND: string;
    /** Western European Standard Time */
    readonly PORTUGAL: string;
    /** Korean Standard Time */
    readonly ROK: string;
    /** Singapore Standard Time */
    readonly SINGAPORE: string;
    /** Atlantic Standard Time */
    readonly SYSTEMV_AST4: string;
    /** Atlantic Standard Time */
    readonly SYSTEMV_AST4ADT: string;
    /** Central Standard Time */
    readonly SYSTEMV_CST6: string;
    /** Central Standard Time */
    readonly SYSTEMV_CST6CDT: string;
    /** Eastern Standard Time */
    readonly SYSTEMV_EST5: string;
    /** Eastern Standard Time */
    readonly SYSTEMV_EST5EDT: string;
    /** Hawaii-Aleutian Standard Time */
    readonly SYSTEMV_HST10: string;
    /** Mountain Standard Time */
    readonly SYSTEMV_MST7: string;
    /** Mountain Standard Time */
    readonly SYSTEMV_MST7MDT: string;
    /** Pitcairn Time */
    readonly SYSTEMV_PST8: string;
    /** Pacific Standard Time */
    readonly SYSTEMV_PST8PDT: string;
    /** Gambier Time */
    readonly SYSTEMV_YST9: string;
    /** Alaska Standard Time */
    readonly SYSTEMV_YST9YDT: string;
    /** Turkey Time */
    readonly TURKEY: string;
    /** Coordinated Universal Time */
    readonly UCT: string;
    /** Alaska Standard Time */
    readonly US_ALASKA: string;
    /** Hawaii-Aleutian Standard Time */
    readonly US_ALEUTIAN: string;
    /** Mountain Standard Time */
    readonly US_ARIZONA: string;
    /** Central Standard Time */
    readonly US_CENTRAL: string;
    /** Eastern Standard Time */
    readonly US_EAST_INDIANA: string;
    /** Eastern Standard Time */
    readonly US_EASTERN: string;
    /** Hawaii-Aleutian Standard Time */
    readonly US_HAWAII: string;
    /** Central Standard Time */
    readonly US_INDIANA_STARKE: string;
    /** Eastern Standard Time */
    readonly US_MICHIGAN: string;
    /** Mountain Standard Time */
    readonly US_MOUNTAIN: string;
    /** Pacific Standard Time */
    readonly US_PACIFIC: string;
    /** Samoa Standard Time */
    readonly US_SAMOA: string;
    /** Coordinated Universal Time */
    readonly UTC: string;
    /** Coordinated Universal Time */
    readonly UNIVERSAL: string;
    /** Moscow Standard Time */
    readonly W_SU: string;
    /** Western European Time */
    readonly WET: string;
    /** Coordinated Universal Time */
    readonly ZULU: string;
    /** Eastern Standard Time */
    readonly EST: string;
    /** Hawaii Standard Time */
    readonly HST: string;
    /** Mountain Standard Time */
    readonly MST: string;
    /** Australian Central Standard Time */
    readonly ACT: string;
    /** Australian Eastern Standard Time */
    readonly AET: string;
    /** Argentine Time */
    readonly AGT: string;
    /** Eastern European Standard Time */
    readonly ART: string;
    /** Alaska Standard Time */
    readonly AST: string;
    /** Brasilia Standard Time */
    readonly BET: string;
    /** Bangladesh Standard Time */
    readonly BST: string;
    /** Central Africa Time */
    readonly CAT: string;
    /** Newfoundland Standard Time */
    readonly CNT: string;
    /** Central Standard Time */
    readonly CST: string;
    /** China Standard Time */
    readonly CTT: string;
    /** East Africa Time */
    readonly EAT: string;
    /** Central European Standard Time */
    readonly ECT: string;
    /** Eastern Standard Time */
    readonly IET: string;
    /** India Standard Time */
    readonly IST: string;
    /** Japan Standard Time */
    readonly JST: string;
    /** Apia Standard Time */
    readonly MIT: string;
    /** Armenia Standard Time */
    readonly NET: string;
    /** New Zealand Standard Time */
    readonly NST: string;
    /** Pakistan Standard Time */
    readonly PLT: string;
    /** Mountain Standard Time */
    readonly PNT: string;
    /** Atlantic Standard Time */
    readonly PRT: string;
    /** Pacific Standard Time */
    readonly PST: string;
    /** Solomon Islands Time */
    readonly SST: string;
    /** Indochina Time */
    readonly VST: string;
    /** Gets the default TimeZone for this host. */
    getDefault(): string;
}
declare var TimeZone: TimeZone & { new(): TimeZone; prototype: TimeZone };

/** Plug-in: System (Core Classes) */
interface Trigger {
    moduleName: string;
    timeout: any;
}
declare var Trigger: Trigger & { new(any: any, any_: any): Trigger; prototype: Trigger };

/**
 * Usable object to put/get Http requests
 * Plug-in: System (Core Classes)
 */
interface URL {
    readonly host: string;
    readonly port: number;
    /** Returns the URL in the form of a String */
    readonly url: string;
    /** Gets or sets the datas (content). */
    datas: string;
    /** Gets or sets the request type (GET, PUT, POST or DELETE). */
    requestType: string;
    /** Gets or sets the datas (content). */
    contentType: string;
    /** Returns the result. */
    readonly result: string;
    /** Adds a parameter at the end of the URL. */
    addParameter(key: any, value: any): void;
    /** Adds a path to the URL. */
    addPath(value: any): void;
    /** Returns the content of the URL. */
    getContent(): string;
    /** Posts the content to the URL. */
    postContent(content: any): string;
    /** Posts the content defined in the datas property to the URL. */
    post(): string;
    /** Return the regex pattern string that matches any valid host name or IP address. */
    getHostnameOrIPPatternStr(): string;
    /** Return the regex pattern string that matches any valid host name. */
    tnamePatternStr(): string;
    getIPAddressPatternStr(): string;
    /** Return the regex pattern string that matches any valid IPv4 address. */
    getIPv4AddressPatternStr(): string;
    /** Return the regex pattern string that matches any valid IPv6 address. */
    getIPv6AddressPatternStr(): string;
    /** Checks if the parameter is valid host name. Example use: <code><pre> new URL().isValidHostname(hostname) </pre></code> */
    isValidHostname(hostname: string): boolean;
    /** Checks if the parameter is valid host name or IP address (both IPv4 and IPv6). Example use: <code><pre> new URL().isHostnameOrIPAddress(hostOrIP) </pre></code> */
    isValidHostnameOrIPAddress(hostOrIP: string): boolean;
    /** Checks if the parameter is valid IP address (both IPv4 and IPv6). Example use: <code><pre> new URL().isValidIPAddress(address) </pre></code> */
    isValidIPAddress(ipAddress: string): boolean;
    /** Checks if the parameter is valid IPv4 address. Example use: <code><pre> new URL().isValidIPv4Address(address) </pre></code> */
    isValidIPv4Address(ipAddress: string): boolean;
    /** Checks if the parameter is valid IPv6 address. Example use: <code><pre> new URL().isValidIPv6Address(address) </pre></code> */
    isValidIPv6Address(ipAddress: string): boolean;
    /** Escapes the host if this is needed. Usually you need to escape IPv6 numeric addresses using brackets. If this host does not need to be escaped then the original is returned. */
    escapeHost(ipAddress: string): string;
    /** Un-escapes the host if this is IPv6 address in brackets. Usually you need to escape IPv6 numeric addresses using brackets but some times you need the plain IPv6 address. If this is not escaped IPv6 address the original is returned. */
    unescapeHost(ipAddress: string): string;
}
declare var URL: URL & { new(url: any): URL; prototype: URL };

/** Plug-in: System (Core Classes) */
interface VersionHistoryItem {
    /** Returns the comment of the VersionHistoryItem. */
    comment: string;
    /** Returns the date of the VersionHistoryItem. */
    date: any;
    /** Returns the user that entered this VersionHistoryItem. */
    user: string;
    /** Returns the version of the VersionHistoryItem. */
    version: string;
}
declare var VersionHistoryItem: VersionHistoryItem & { new(): VersionHistoryItem; prototype: VersionHistoryItem };

/**
 * Workflow
 * Plug-in: System (Core Classes)
 */
interface Workflow {
    /** Returns the name of the workflow. */
    readonly name: string;
    /** Returns the description of the workflow. */
    readonly description: string;
    /** Returns the category object of the workflow */
    readonly workflowCategory: WorkflowCategory;
    /** Returns the version of the workflow. */
    readonly version: string;
    /** Returns the first item of the workflow. */
    readonly firstItem: WorkflowItem;
    /** Returns the number of items in the workflow. */
    readonly numberOfItem: number;
    /** Returns the item list of the workflow. */
    readonly items: WorkflowItem[];
    /** Returns the input parameter list of the workflow. */
    readonly inParameters: Parameter[];
    /** Returns the output parameter list of the workflow. */
    readonly outParameters: Parameter[];
    /** Returns the attribute list of the workflow. */
    readonly attributes: Attribute[];
    /** Returns the versionHistoryItem list of the workflow. */
    readonly versionHistoryItems: VersionHistoryItem[];
    /** Returns a properties object with as keys the parameters names and values the type of the parameter. */
    readonly parameterInfos: Properties;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Get all execution of a given workflow */
    readonly executions: WorkflowToken[];
    /** Returns the log events */
    readonly logEvents: LogEvent[];
    /** Save the picture of the workflow in .png format. */
    saveSchemaImageToFile(file: string): void;
    /** Executes the workflow. */
    execute(properties: Properties, uname: string, pwd: string): WorkflowToken;
    /** Schedules recurrently the workflow. */
    scheduleRecurrently(properties: Properties, recurrencePattern: string, recurrenceCycle: string, startDate: Date, endDate: Date, uname: string, pwd: string, timeZone: string): Task;
    /** Schedules the workflow. */
    schedule(properties: Properties, startDate: Date, uname: string, pwd: string): Task;
    /** Generates a URL usable for interacting with workflows in VS-O or its web front end version 3.0.x. */
    getExecutionUrl(secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
    /** Generates a URL usable for interacting with workflows in Automation Orchestrator or its web front end. */
    getWebviewExecutionUrl(inWebviewUrlFolder: any, inPage: any, secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
    /** Creates a URL usable to access Web-Operator "Schedule Workflow operation" page (version 3.0.x). */
    getScheduleUrl(secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
    /** Creates a URL usable to access Web-Operator "Schedule Workflow operation" page. */
    getWebviewScheduleUrl(inWebviewUrlFolder: any, inPage: any, secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
}
declare var Workflow: Workflow & { new(): Workflow; prototype: Workflow };

/**
 * WorkflowCategory Wrapper
 * Plug-in: System (Core Classes)
 */
interface WorkflowCategory {
    /** Returns the name of the workflowCategory. */
    readonly name: string;
    /** Returns the description of the workflowCategory. */
    readonly description: string;
    /** Returns the path of the workflowCategory. */
    readonly path: string;
    readonly workflows: Workflow[];
    readonly allWorkflows: Workflow[];
    readonly subCategories: WorkflowCategory[];
    readonly parent: WorkflowCategory;
}
declare var WorkflowCategory: WorkflowCategory & { new(): WorkflowCategory; prototype: WorkflowCategory };

/**
 * Workflow item for conditions (Custom)
 * Plug-in: System (Core Classes)
 */
interface WorkflowCustomConditionItem {
    /** Returns the name of the ConditionItem. */
    readonly name: string;
    /** Returns the description of the ConditionItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
    /** Returns the next item if condition is true , or null if it is the end. */
    readonly nextItemTrue: WorkflowItem;
    /** Returns the next item if condition is false, or null if it is the end. */
    readonly nextItemFalse: WorkflowItem;
    /** Returns the script of the ConditionItem. */
    readonly script: string;
}
declare var WorkflowCustomConditionItem: WorkflowCustomConditionItem & { new(): WorkflowCustomConditionItem; prototype: WorkflowCustomConditionItem };

/**
 * Workflow item for decisions made by an action or workflow (Decision activity). Not listed in the API Explorer. Verified on VCF Operations Orchestrator 9.1.1.0 (build 25643527).
 * Plug-in: System (Core Classes)
 */
interface WorkflowDecisionActivityItem {
    /** Returns the name of the DecisionActivityItem. */
    readonly name: string;
    /** Returns the description of the DecisionActivityItem, or null if none is set. */
    readonly description: string;
    /** Returns the next item. In lab tests this was always the same item as nextItemTrue. */
    readonly nextItem: WorkflowItem;
    /** Returns the next item if condition is true. */
    readonly nextItemTrue: WorkflowItem;
    /** Returns the next item if condition is false. */
    readonly nextItemFalse: WorkflowItem;
    /** Returns the script of the DecisionActivityItem. */
    readonly script: string;
    /** Returns the referenced workflow. In lab tests this was null whenever the decision references an action. */
    readonly referencedWorkflow: Workflow;
    /** Returns the referenced action. */
    readonly referencedAction: Action;
}
declare var WorkflowDecisionActivityItem: WorkflowDecisionActivityItem & { new(): WorkflowDecisionActivityItem; prototype: WorkflowDecisionActivityItem };

/**
 * Workflow item iterating a workflow over an array (Foreach element). Not listed in the API Explorer. Verified on VCF Operations Orchestrator 9.1.1.0 (build 25643527).
 * Plug-in: System (Core Classes)
 */
interface WorkflowForeachItem {
    /** Returns the name of the ForeachItem. */
    readonly name: string;
    /** Returns the description of the ForeachItem, or null if none is set. */
    readonly description: string;
    /** Returns the next item. */
    readonly nextItem: WorkflowItem;
    /** Returns the script of the iteration error handler, or null if no handler is set. */
    readonly loopInnerCatchBlock: string;
    /** Returns the workflow to be iterated. */
    readonly iterationElement: Workflow;
}
declare var WorkflowForeachItem: WorkflowForeachItem & { new(): WorkflowForeachItem; prototype: WorkflowForeachItem };

/**
 * Workflow item for conditions (Generic)
 * Plug-in: System (Core Classes)
 */
interface WorkflowGenericConditionItem {
    /** Returns the name of the ConditionItem. */
    readonly name: string;
    /** Returns the description of the ConditionItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
    /** Returns the next item if condition is true , or null if it is the end. */
    readonly nextItemTrue: WorkflowItem;
    /** Returns the next item if condition is false, or null if it is the end. */
    readonly nextItemFalse: WorkflowItem;
    /** Returns the script of the ConditionItem. */
    readonly script: string;
}
declare var WorkflowGenericConditionItem: WorkflowGenericConditionItem & { new(): WorkflowGenericConditionItem; prototype: WorkflowGenericConditionItem };

/**
 * Object representing a instance of a WorkflowInput
 * Plug-in: System (Core Classes)
 */
interface WorkflowInput {
    /** Returns the name of the workflow input. */
    readonly name: string;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Return the workflow input state ('waiting' or 'completed'). */
    readonly state: string;
    /** Get the workflow input start date as formated string. */
    readonly startDateAsString: string;
    /** Get the workflow input start date. */
    readonly startDate: Date;
    /** Returns true is the workflow input is still valid, false if it has been deleted. */
    readonly isStillValid: boolean;
    /** Generates a URL usable for answering input in running workflows in VS-O web front end version 3.0.x. */
    getAnswerUrl(secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
    /** Generates a URL usable for interacting with running workflows in VS-O web front end version 3.0.x. */
    getInteractionUrl(secure: any, inHost: any, inPort: any): URL;
    /** Generates a URL usable for answering input in running workflows in Automation Orchestrator web front end. */
    getWebviewAnswerUrl(inWebviewUrlFolder: any, inPage: any, secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
}
declare var WorkflowInput: WorkflowInput & { new(): WorkflowInput; prototype: WorkflowInput };

/**
 * Workflow item for user interaction
 * Plug-in: System (Core Classes)
 */
interface WorkflowInputItem {
    /** Returns the name of the InputItem. */
    readonly name: string;
    /** Returns the description of the InputItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
}
declare var WorkflowInputItem: WorkflowInputItem & { new(): WorkflowInputItem; prototype: WorkflowInputItem };

/**
 * WorkflowItem abstract class
 * Plug-in: System (Core Classes)
 */
interface WorkflowItem {
    /** Returns the name of the item. */
    readonly name: string;
    /** Returns the description of the item. */
    readonly description: string;
    /** Returns the next item. */
    readonly nextItem: WorkflowItem;
}
declare var WorkflowItem: WorkflowItem & { new(): WorkflowItem; prototype: WorkflowItem };

/**
 * Workflow item end
 * Plug-in: System (Core Classes)
 */
interface WorkflowItemEnd {
    /** Returns the name of the ConditionItem. */
    readonly name: string;
    /** Returns the description of the ConditionItem. */
    readonly description: string;
}
declare var WorkflowItemEnd: WorkflowItemEnd & { new(): WorkflowItemEnd; prototype: WorkflowItemEnd };

/**
 * Workflow item waiting on an event
 * Plug-in: System (Core Classes)
 */
interface WorkflowItemWaitingEvent {
    /** Returns the name of the WaitingEventItem. */
    readonly name: string;
    /** Returns the description of the WaitingEventItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
}
declare var WorkflowItemWaitingEvent: WorkflowItemWaitingEvent & { new(): WorkflowItemWaitingEvent; prototype: WorkflowItemWaitingEvent };

/**
 * Workflow item waiting on a timer
 * Plug-in: System (Core Classes)
 */
interface WorkflowItemWaitingTimer {
    /** Returns the name of the WaitingTimerItem. */
    readonly name: string;
    /** Returns the description of the WaitingTimerItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
}
declare var WorkflowItemWaitingTimer: WorkflowItemWaitingTimer & { new(): WorkflowItemWaitingTimer; prototype: WorkflowItemWaitingTimer };

/**
 * Workflow item starting a sub-workflow
 * Plug-in: System (Core Classes)
 */
interface WorkflowLinkItem {
    /** Returns the name of the LinkItem. */
    readonly name: string;
    /** Returns the description of the LinkItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
    /** Returns the linked workflow */
    readonly linkedWorkflow: Workflow;
}
declare var WorkflowLinkItem: WorkflowLinkItem & { new(): WorkflowLinkItem; prototype: WorkflowLinkItem };

/**
 * Workflow item starting multiples workflows
 * Plug-in: System (Core Classes)
 */
interface WorkflowMultipleCallItem {
    /** Returns the name of the SubElementItem. */
    readonly name: string;
    /** Returns the description of the SubElementItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
    /** Returns the linked workflows */
    readonly linkedWorkflows: Workflow[];
}
declare var WorkflowMultipleCallItem: WorkflowMultipleCallItem & { new(): WorkflowMultipleCallItem; prototype: WorkflowMultipleCallItem };

/**
 * Workflow item for switch cases (Switch). Not listed in the API Explorer. Verified on VCF Operations Orchestrator 9.1.1.0 (build 25643527). outItems and conditions are index-aligned Java arrays: read them with .length and [i]; passing or returning the array itself throws InternalError: Invalid JavaScript value.
 * Plug-in: System (Core Classes)
 */
interface WorkflowSwitchItem {
    /** Returns the name of the SwitchItem. */
    readonly name: string;
    /** Returns the description of the SwitchItem, or null if none is set. */
    readonly description: string;
    /** Always null in lab tests. Use outItems for the targets. */
    readonly nextItem: WorkflowItem;
    /** Returns the go-to targets of the switch cases, in the same order as conditions. Read with outItems.length and outItems[i] only. */
    readonly outItems: WorkflowItem[];
    /** Returns the conditions of the switch cases, e.g. (status == "done"). The last entry is (true), the default case. Read with conditions.length and conditions[i], or copy with Array.prototype.slice.call(item.conditions). */
    readonly conditions: string[];
}
declare var WorkflowSwitchItem: WorkflowSwitchItem & { new(): WorkflowSwitchItem; prototype: WorkflowSwitchItem };

/**
 * Workflow item with an associated script
 * Plug-in: System (Core Classes)
 */
interface WorkflowTaskItem {
    /** Returns the name of the TaskItem. */
    readonly name: string;
    /** Returns the description of the TaskItem. */
    readonly description: string;
    /** Returns the next item , or null if it is the end. */
    readonly nextItem: WorkflowItem;
    /** Returns the script of the TaskItem. */
    readonly script: string;
    /** Return true if the box is a wrapped Action call */
    readonly isActionCall: boolean;
    /** Return true if the box start an asynchronous workflow */
    readonly isStartWorkflowCall: boolean;
    /** Returns the linked workflow started asynchronously */
    readonly linkedWorkflow: Workflow;
    /** Returns all used action in this item */
    readonly usedActions: any;
}
declare var WorkflowTaskItem: WorkflowTaskItem & { new(): WorkflowTaskItem; prototype: WorkflowTaskItem };

/**
 * Object representing a instance of a  Workflow (running or finished)
 * Plug-in: System (Core Classes)
 */
interface WorkflowToken {
    /** Returns the name of the workflow token. */
    readonly name: string;
    /** Returns the unique identifier (ID) for this object. */
    readonly id: string;
    /** Returns the running user name. */
    readonly runningUserName: string;
    /** Returns the root workflow. */
    readonly rootWorkflow: any;
    /** Returns the current workflow. */
    readonly currentWorkflow: any;
    /** Return the state of this workflow. */
    readonly state: string;
    /** Return the error code of this workflow, if state is failed */
    readonly exception: string;
    /** Get the workflow business state */
    readonly businessState: string;
    /** Returns the current workflow input ID. Returns null if the current workflow item is not a workflow input. */
    readonly workflowInputId: string;
    /** Get the workflow execution start date */
    readonly startDate: string;
    /** Get the workflow execution end date */
    readonly endDate: string;
    /** Get the workflow execution start date as date object */
    readonly startDateAsDate: any;
    /** Get the workflow execution end date as date object */
    readonly endDateAsDate: any;
    /** Returns the log events */
    readonly logEvents: LogEvent[];
    /** Returns true is the workflow token is still valid, false if it has been deleted. */
    readonly isStillValid: boolean;
    /** Returns the attributes' stack of the workflow token. The stack is ordered : the last item in the stack is the current one. */
    readonly attributesStack: Attribute[];
    /** Save the picture of the workflowToken in .png format. */
    saveSchemaImageToFile(file: string): void;
    /** Cancels the execution of this workflow. */
    cancel(): void;
    /** Generates a URL usable for answering input in running workflows in VS-O web front end version 3.0.x. */
    getAnswerUrl(secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
    /** Generates a URL usable for interacting with running workflows in VS-O web front end version 3.0.x. */
    getInteractionUrl(secure: any, inHost: any, inPort: any): URL;
    /** Generates a URL usable for answering input in running workflows in Automation Orchestrator web front end. */
    getWebviewAnswerUrl(inWebviewUrlFolder: any, inPage: any, secure: any, inAutologon: any, inHost: any, inPort: any, inUrl: any): URL;
    /** Gets the input parameters of the workflow token (if any). */
    getInputParameters(): Properties;
    /** Gets the output parameters of the workflow token (if any). */
    getOutputParameters(): Properties;
    /** Gets the attributes of the workflow token (if any). */
    getAttributes(): Properties;
    /** Change the running credential for this workflow execution. The credential will be effective in the next workflow's exectution box. */
    changeCredential(credential: any): void;
}
declare var WorkflowToken: WorkflowToken & { new(): WorkflowToken; prototype: WorkflowToken };

/**
 * ZipWriter
 * Plug-in: System (Core Classes)
 */
interface ZipWriter {
    /** Add a string element to the specified zip file */
    addContent(entryName: string, content: string, encoding: string): void;
    /** Write the element to the Zip File */
    writeZip(): void;
    /** Add mime attachement to the specified zip file */
    addMimeAttachment(mimeAttachment: MimeAttachment): void;
    /** Reinitializes the length to 0 and sets the file-pointer in the very begining of the file. */
    clean(): void;
}
declare var ZipWriter: ZipWriter & { new(file: string): ZipWriter; prototype: ZipWriter };
