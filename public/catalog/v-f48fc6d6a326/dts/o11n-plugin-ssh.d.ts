// SSH (o11n-plugin-ssh), generated from modernvroapi.in data. Do not edit.

/**
 * Set of functions to manage private/public keys.
 * Plug-in: SSH
 */
interface KeyPairManager {
    /** (Static) Generate a pair of public/private key. Returns the generated key fingerprint. */
    generateKeyPair(type: string, path: Path, passphrase: string, keySize: number, comment: string): string;
    /** (Static) Change the passphrase of a private key. */
    changePassphrase(path: Path, oldPasspharse: string, newPassphrase: string): any;
}
declare var KeyPairManager: KeyPairManager & { new(): KeyPairManager; prototype: KeyPairManager };

/**
 * SSH Command
 * Plug-in: SSH
 */
interface SSHCommand {
    /** The exit code of the last command (execution channel). Values are 0 if successful, -1 for initializing, and positive number for an error. */
    readonly exitCode: number;
    /** Command to execute */
    cmd: string;
    /** Command output if any */
    readonly output: string;
    /** Command error if any */
    readonly error: string;
    /** Execution state */
    readonly state: string;
    /** Execute a single command and return immediately. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. Value of the exitCode property is changed to -1 for initializing, 0 if successful, and positive number if an error occured. */
    execute(): any;
    /** Execute a single command and wait until end. Value of the exitCode property is changed to -1 for initializing, 0 if successful, and positive number if an error occured. */
    executeAndLog(file: string): any;
    /** Execute a single command and wait until completed, return the stdout result if sychronous. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. Value of the exitCode property is changed to -1 for initializing, 0 if successful, and positive number if an error occured. */
    executeCommand(cmd: string, wait: boolean): string;
    /** Sets the encoding that will be used to process the results from executeCommand method. */
    setEncoding(encoding: string): any;
    /** Returns the encoding used by this SSHCommand */
    getEncoding(): any;
    /** Copy a file from a remote host to Automation Orchestrator Server. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. Returns 0 if successful, or -1 if an error has occurred. */
    getFile(remoteFile: string, localFile: string): number;
    /** Copy a file to a remote host from Automation Orchestrator Server. Returns 0 if successful, or -1 if an error has occurred. If a remote file name is provided, the destination file name will use it. If only the destination directory is specified, then the destination file will use the source file name. The destination directory must exist. */
    putFile(localFile: string, remoteFile: string): number;
    /** Recursively search and return matching pattern file and directory. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    findAll(basePath: string, pattern: string): string[];
    /** Recursively search and return matching pattern file ONLY. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    findFile(basePath: string, pattern: string): string[];
    /** Recursively search and return matching pattern directory ONLY. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    findDir(basePath: string, pattern: string): string[];
    /** List files and directories in path. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    listAll(basePath: string): string[];
    /** List files ONLY in path. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    listFile(basePath: string): string[];
    /** List directories ONLY in path. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    listDir(basePath: string): string[];
    /** Disconnects the current session if open. The session parameters are given in the object constructor (host, username, password); a session is opened automatically when any method is called that requires a session (like execute). Once open, the session remains open; any method uses the same session but opens a new channel and the closes it when done. You need to use this disconnect method to close the session. */
    disconnect(): any;
}
declare var SSHCommand: SSHCommand & { new(host: string, username: string, password: string): SSHCommand; new(host: string, username: string, password: string, port: number): SSHCommand; prototype: SSHCommand };

/**
 * File on a remote file system using SSH to access it
 * Plug-in: SSH
 */
interface SSHFile {
    /** File name */
    readonly name: string;
    /** File name */
    readonly fileName: string;
    /** SSH port to access this file or folder */
    readonly port: number;
    /** File full path */
    readonly path: string;
    /** SSH Hostname to access this file or folder */
    readonly hostname: string;
}
declare var SSHFile: SSHFile & { new(): SSHFile; prototype: SSHFile };

/**
 * Folder on a remote file system using SSH to access it
 * Plug-in: SSH
 */
interface SSHFolder {
    /** Folder name */
    readonly name: string;
    /** Folder name */
    readonly folderName: string;
    /** SSH port to access this file or folder */
    readonly port: number;
    /** File full path */
    readonly path: string;
    /** SSH Hostname to access this file or folder */
    readonly hostname: string;
}
declare var SSHFolder: SSHFolder & { new(): SSHFolder; prototype: SSHFolder };

/**
 * SSH Host object
 * Plug-in: SSH
 */
interface SSHHost {
    /** The id of the host */
    readonly id: string;
    /** The display name */
    readonly displayName: string;
    /** The target port */
    readonly port: number;
    /** The hostname */
    readonly hostname: string;
    /** The username */
    readonly username: string;
    /** The Root Folders */
    readonly rootFolders: string[];
    /** The whole SshHostConfiguration */
    readonly sshHostConfiguration: SSHHostConfiguration;
}
declare var SSHHost: SSHHost & { new(): SSHHost; prototype: SSHHost };

/** Plug-in: SSH */
interface SSHHostConfiguration {
    /** The hostname */
    hostname: string;
    /** The target port */
    port: number;
    /** The username */
    username: string;
    /** The password */
    password: string;
    /** The passphrase */
    passphrase: string;
    /** The path to the certificate */
    certificatePath: string;
    /** If set to true it will use password authenticatoin, otherwise a certificate will be used. */
    passwordAuthentication: boolean;
    /** The Root Folders */
    rootFolders: string[];
    /** The id of the configuration. Note: could not be manually set! */
    readonly id: string;
}
declare var SSHHostConfiguration: SSHHostConfiguration & { new(): SSHHostConfiguration; prototype: SSHHostConfiguration };

/**
 * SSHHostManager provides CRUD operations for the SSHHost objects
 * Plug-in: SSH
 */
interface SSHHostManager {
    /** Adds a SSH Host */
    addSshHost(config: SSHHostConfiguration): SSHHost;
    /** Removes a SSH Host */
    removeSshHost(host: SSHHost): void;
    /** Updates a SSH Host */
    updateSshHost(sshHost: SSHHost, sourceConfig: SSHHostConfiguration): SSHHost;
    /** Gets a SSH Host */
    getSshHost(id: string): SSHHost;
    /** Gets all SSH Hosts */
    getSshHosts(): SSHHost[];
    /** Adds a Root Folder to SSH Host */
    addRootFolderToHost(sshHost: SSHHost, rootFolder: string): SSHHost;
    /** Removes a Root Folder from SSH Host */
    removeRootFolderFromHost(sshHost: SSHHost, rootFolder: string): SSHHost;
}
declare var SSHHostManager: SSHHostManager & { new(): SSHHostManager; prototype: SSHHostManager };

/**
 * SSH Session to username@host:port. This object replace the old 'SSHCommand' object.
 * Plug-in: SSH
 */
interface SSHSession {
    /** The exit code of the last command (execution channel). Values are 0 if successful, -1 for initializing, and positive number for an error. */
    readonly exitCode: number;
    /** Command to execute */
    cmd: string;
    /** RFC4254 6.2. Requesting a Pseudo-Terminal */
    pty: boolean;
    /** Set the terminal type, for example vt100 */
    terminal: string;
    /** Command output if any */
    readonly output: string;
    /** Command error if any */
    readonly error: string;
    /** Execution state */
    readonly state: string;
    /** Socket timeout */
    soTimeout: number;
    /** Connect the session using simple username/password authentification. */
    connectWithPassword(password: string): any;
    /** Deprecated use connectWithIdentity(). Connect the session using Public key Authentication. */
    connectWithIdentidy(privateKeyPath: Path, passphrase: string): any;
    /** Connect the session using Public key Authentication. */
    connectWithIdentity(privateKeyPath: Path, passphrase: string): any;
    /** Connect the session using either password or Public key Authentication. */
    connectWithPasswordOrIdentity(isPassword: boolean, password: string, privateKeyPath: Path): any;
    /** The provided userInfo object is used for callback for the keyboard-interactive authentication and for the other types of messages send from the remote server during authentication. The function signatures should be: * getPassphrase() : String * getPassword() : String * promptKeyboardInteractive(String destination, String name, String instruction, String[] prompt, boolean[] echo) : String[] * promptPassphrase(String message) : boolean * promptPassword(String message) : boolean * promptYesNo(String message) : boolean * showMessage(String message) : void Example: var session = new SSHSession("myhost","myuser"); session.setUserInfo({ promptKeyboardInteractive: function(destination, name, instruction, prompt, echo){ if (typeof prompt != "undefined" && prompt.length == 1 && !echo[0] && prompt[0].match(/password:|passwort:|kennwort:|mot de passe:/i) { return "secretPasswd"; } else { throw "do not know how to handle " + prompt; } }, showMessage : function(msg){ System.log("msg " + msg); } }) ; */
    setUserInfo(userInfo: any): any;
    /** Fills a property list of environment variables that will be set prior to opening a channel. */
    addEnvironment(key: string, value: string): any;
    /** Set connection timeout, in milliseconds */
    setConnectTimeout(timeout: number): void;
    /** Get connection timeout */
    getConnectTimeout(): number;
    /** Set socket timeout, in milliseconds */
    setTimeout(timeout: number): void;
    /** Get socket timeout */
    getTimeout(): number;
    /** Set an interval, in milliseconds, to send keep-alive message. If zero, keep-alive message will not be sent. */
    setKeepAliveInterval(interval: number): void;
    /** Get keep-alive interval */
    getKeepAliveInterval(): number;
    /** Sets the number of keep-alive messages which may be sent without receiving any messages back from the server. If this threshold is reached while keep-alive messages are being sent, the connection will be disconnected. The default value is 1. */
    setKeepAliveCountMax(count: number): void;
    /** Get keep-alive messages count threshold */
    getKeepAliveCountMax(): number;
    /** Sets the encoding that will be used to process the results from executeCommand method */
    setEncoding(encoding: string): any;
    /** Returns the encoding used by this SSHSession */
    getEncoding(): any;
    /** Execute a single command and return immediately. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. Value of the exitCode property is changed to -1 for initializing, 0 if successful, and positive number if an error occured. */
    execute(): any;
    /** Execute a single command and wait until end. Value of the exitCode property is changed to -1 for initializing, 0 if successful, and positive number if an error occured. */
    executeAndLog(file: Path): any;
    /** Execute a single command and wait until completed, return the stdout result if sychronous. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. Value of the exitCode property is changed to -1 for initializing, 0 if successful, and positive number if an error occured. */
    executeCommand(cmd: string, wait: boolean): string;
    /** Copy a file from a remote host to Automation Orchestrator Server. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. Returns 0 if successful, or -1 if an error has occurred. */
    getFile(remoteFile: Path, localFile: Path): number;
    /** Copy a file to a remote host from Automation Orchestrator Server. Returns 0 if successful, or -1 if an error has occurred. If a remote file name is provided, the destination file name will use it. If only the destination directory is specified, then the destination file will use the source file name. The destination directory must exist. */
    putFile(localFile: Path, remoteFile: Path): number;
    /** Recursively search and return matching pattern file and directory. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    findAll(basePath: Path, pattern: string): string[];
    /** Recursively search and return matching pattern file ONLY. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    findFile(basePath: Path, pattern: string): string[];
    /** Recursively search and return matching pattern directory ONLY. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    findDir(basePath: Path, pattern: string): string[];
    /** List files and directories in path. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    listAll(basePath: Path): string[];
    /** List files ONLY in path. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    listFile(basePath: Path): string[];
    /** List directories ONLY in path. This command will connect the session, request an execution channel, execute the command and close the execution channel. The session is open automatically if not opened yet, but will remain open after the command execution. Use disconnect to close the session. */
    listDir(basePath: Path): string[];
    /** Disconnects the current session if open. The session parameters are given in the object constructor (host, username, password); a session is opened automatically when any method is called that requires a session (like execute). Once open, the session remains open; any method uses the same session but opens a new channel and the closes it when done. You need to use this disconnect method to close the session. */
    disconnect(): any;
}
declare var SSHSession: SSHSession & { new(host: string, username: string): SSHSession; new(host: string, username: string, port: number): SSHSession; prototype: SSHSession };
