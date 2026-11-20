// Active Directory (o11n-plugin-activedirectory), generated from modernvroapi.in data. Do not edit.

/**
 * Represents the Active Directory base.
 * Plug-in: Active Directory
 */
interface ActiveDirectory {
    /** Search the active directory for a certain type of object */
    search(type: string, query: string, adServer: AD_Host): any[];
    /** Search the active directory for a certain type of object. Object will be returned only if the there is exact match. */
    searchExactMatch(type: string, objectName: string, limit: number, adServer: AD_Host): any[];
    /** Returns a computer when his exact name is given. If no computer found, returns null */
    getComputerAD(computerName: string, adServer: AD_Host): AD_Computer;
    /** Return the AD_Computer representing the Domain Conroller */
    getDC(adServer: AD_Host): AD_Computer;
    /** Retrieves the entry with the specified DN. */
    getEntry(baseDN: string, attributes: string[], host: AD_Host): any;
    /** Allows a client to change the leftmost (least significant) component of the name of an entry in the directory, or to move a subtree of entries to a new location in the directory. For example, to rename "cn=SomeUser, ou=People, dc=demo, dc=org" to "cn=AnotherUser, ou=People, dc=demo, dc=org" you must provide from as "cn=SomeUser, ou=People, dc=demo, dc=org" and to as "cn=AnotherUser". To move the entry under different tree node new_parent "cn=NewName, ou=NewParent, dc=demo, dc=org" must be provided. */
    rename(from: string, to: string, new_parent: string, param3: AD_Host): void;
    /** Processes a search operation with the provided information. It is expected that at most one entry will be returned from the search, and that no additional content from the successful search result (e.g., diagnostic message or response controls) are needed. */
    searchForEntry(baseDN: string, searchScope: LdapSearchScope, timeLimit: number, filter: string, attributes: string[], host: AD_Host): any;
    /** Search recursively the whole domain tree of Active Directory for a certain type of objects. */
    searchRecursively(type: string, query: string, adServer: AD_Host): any[];
    /** Gets computers recursively for the whole domain tree */
    getComputerADRecursively(computerName: string, adServer: AD_Host): any[];
    /** Retrieves all AD_Computer instances for the domain and all sub-domain Domain Controllers. */
    getAllDomainControllerComputers(param0: AD_Host): any[];
}
declare var ActiveDirectory: ActiveDirectory & { new(): ActiveDirectory; prototype: ActiveDirectory };

/**
 * Computer on the AD
 * Plug-in: Active Directory
 */
interface AD_Computer {
    /** The unique Id of the element */
    readonly id: string;
    /** The node name */
    readonly name: string;
    /** The remote host name */
    readonly hostname: string;
    /** Activate or deactivate a computer */
    enabled: boolean;
    /** Return the DN of the item */
    readonly distinguishedName: string;
    /** Returns all attributes */
    readonly allAttributes: any[];
    /** Return object GUID formatted as dashed string */
    readonly gUID: string;
    /** Removes an attribute as specified by the attribName parameter */
    removeAttribute(attribName: string): void;
    /** Destroy this element from the AD. Take care, this action PERMANENTLY DESTROY the element */
    destroy(param0: boolean): void;
    /** Allows a client to change the leftmost (least significant) component of the name of an entry in the directory. Ð¢o rename the entry you must provide it with the attribute as prefix - e.g. "cn=newName". */
    rename(name: string): void;
    /** Change the value of an existing attribute */
    setAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute */
    getAttribute(attibName: string): string;
    /** Adds an attribute */
    addAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute for an array of values */
    getArrayAttribute(attibName: string): string[];
    /** Get an AD attribute value as byte array. */
    getAttributeValueBytes(attibName: string): any[];
}
declare var AD_Computer: AD_Computer & { new(): AD_Computer; prototype: AD_Computer };

/**
 * Group
 * Plug-in: Active Directory
 */
interface AD_Group {
    /** the unique Id of the element */
    readonly id: string;
    /** List of all users (read-only) */
    readonly users: any[];
    /** List of all computers (read-only) */
    readonly computers: any[];
    /** List of all user groups (read-only) */
    readonly userGroups: any[];
    /** List of all Group (read-only) */
    readonly containers: any[];
    /** List of all OU (read-only) */
    readonly organizationalUnits: any[];
    /** Return the DN of the item */
    readonly distinguishedName: string;
    /** Returns all attributes */
    readonly allAttributes: any[];
    /** Return object GUID formatted as dashed string */
    readonly gUID: string;
    /** Creates a new user and adds it to this container */
    createUser(accountName: string, domainName: string, displayName: string): void;
    /** Creates a new user, sets its password and adds it to this container */
    createUserWithPassword(accountName: string, password: string, domainName: string, displayName: string): void;
    /** Creates a new user, sets its password and adds it to this container */
    createUserWithDetails(accountName: string, password: string, domainName: string, displayName: string, firstName: string, lastName: string): void;
    /** Creates a new user group and adds it to this container */
    createUserGroup(groupName: string): void;
    /** Creates a new organizational unit and adds it to this container */
    createOrganizationalUnit(ouName: string): void;
    /** Create a new computer and add it to this container */
    createComputer(computerName: string, domainName: string, computerNamePreWin2K: string): void;
    /** Create a new computer with password and add it to this container */
    createComputerWithPassword(computerName: string, domainName: string, password: string, computerNamePreWin2K: string): void;
    /** Removes an attribute as specified by the attribName parameter */
    removeAttribute(attribName: string): void;
    /** Change the value of an existing attribute */
    setAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute */
    getAttribute(attibName: string): string;
    /** Adds an attribute */
    addAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute for an array of values */
    getArrayAttribute(attibName: string): string[];
    /** Get an AD attribute value as byte array. */
    getAttributeValueBytes(attibName: string): any[];
}
declare var AD_Group: AD_Group & { new(): AD_Group; prototype: AD_Group };

/**
 * Represents Active directory server connection.
 * Plug-in: Active Directory
 */
interface AD_Host {
    /** Active directory configuration name */
    readonly name: string;
    /** Active Directory host connection URL. Actual URL used for connection with Active Directory server. It might differ from configured values when current object represents sub-domain entity. */
    readonly Url: string;
    /** Active Directory host configuration settings for current AD_Host connection. */
    readonly hostConfiguration: AD_ServerConfiguration;
    /** Retrieve LdapClient based on current host configuration settings. */
    getLdapClient(): LdapClient;
}
declare var AD_Host: AD_Host & { new(): AD_Host; prototype: AD_Host };

/**
 * Manage Active Directory hosts
 * Plug-in: Active Directory
 */
interface AD_HostManager {
    /** Return Active Directory hosts by it's configuration id. */
    findHost(param0: string): AD_Host;
    /** Return all Active Directory hosts. */
    findAllHosts(): any[];
}
declare var AD_HostManager: AD_HostManager & { new(): AD_HostManager; prototype: AD_HostManager };

/**
 * Represents an Organizational Unit
 * Plug-in: Active Directory
 */
interface AD_OrganizationalUnit {
    /** the unique Id of the element */
    readonly id: string;
    /** List of all users (read-only) */
    readonly users: any[];
    /** List of all computers (read-only) */
    readonly computers: any[];
    /** List of all user groups (read-only) */
    readonly userGroups: any[];
    /** List of all Group (read-only) */
    readonly containers: any[];
    /** List of all OU (read-only) */
    readonly organizationalUnits: any[];
    /** Return the DN of the item */
    readonly distinguishedName: string;
    /** Returns all attributes */
    readonly allAttributes: any[];
    /** Return object GUID formatted as dashed string */
    readonly gUID: string;
    /** Get a computer by name */
    searchComputer(computerName: string): AD_Computer;
    /** Creates a new user and adds it to this container */
    createUser(accountName: string, domainName: string, displayName: string): void;
    /** Creates a new user, sets its password and adds it to this container */
    createUserWithPassword(accountName: string, password: string, domainName: string, displayName: string): void;
    /** Creates a new user, sets its password and adds it to this container */
    createUserWithDetails(accountName: string, password: string, domainName: string, displayName: string, firstName: string, lastName: string): void;
    /** Creates a new user group and adds it to this container */
    createUserGroup(groupName: string): void;
    /** Creates a new organizational unit and adds it to this container */
    createOrganizationalUnit(ouName: string): void;
    /** Create a new computer and add it to this container */
    createComputer(computerName: string, domainName: string, computerNamePreWin2K: string): void;
    /** Create a new computer with password and add it to this container */
    createComputerWithPassword(computerName: string, domainName: string, password: string, computerNamePreWin2K: string): void;
    /** Removes an attribute as specified by the attribName parameter */
    removeAttribute(attribName: string): void;
    /** Destroy this element from the AD. Take care, this action PERMANENTLY DESTROY the element */
    destroy(param0: boolean): void;
    /** Change the value of an existing attribute */
    setAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute */
    getAttribute(attibName: string): string;
    /** Adds an attribute */
    addAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute for an array of values */
    getArrayAttribute(attibName: string): string[];
    /** Get an AD attribute value as byte array. */
    getAttributeValueBytes(attibName: string): any[];
}
declare var AD_OrganizationalUnit: AD_OrganizationalUnit & { new(): AD_OrganizationalUnit; prototype: AD_OrganizationalUnit };

/**
 * Active Directory Plug-in options
 * Plug-in: Active Directory
 */
interface AD_PluginOptions {
    /** Default Active Directory end point id. */
    readonly defaultAdServerId: string;
    /** Maximum number of items that will be returned by a search. */
    readonly searchSizeLimit: number;
    /** Maximum number of items that will be returned by a search from single Active Directory server. */
    readonly searchSizeLimitPerServer: number;
}
declare var AD_PluginOptions: AD_PluginOptions & { new(): AD_PluginOptions; prototype: AD_PluginOptions };

/**
 * Represents single Active Directory service end point configuration.
 * Plug-in: Active Directory
 */
interface AD_ServerConfiguration {
    /** Id */
    id: string;
    /** Name */
    name: string;
    /** Active Directory host */
    host: string;
    /** Active Directory port */
    port: number;
    /** Root */
    ldapBase: string;
    /** Use SSL */
    useSSL: boolean;
    /** Default domain */
    defaultDomain: string;
    /** Use a shared session (deprecated) */
    useSharedSession: boolean;
    /** User name for shared session */
    sharedUserName: string;
    /** Password for shared session */
    sharedUserPassword: string;
    /** Follow refferals */
    followReferrals: boolean;
    /** Alternative host adresses */
    alternativeHosts: string[];
    /** Strategy for load balancing between configured alternative hosts. */
    loadBalancingMode: LdapLoadBalancingMode;
    /** Bind Type. Supported bind types are 'Simple' and 'Digest'. */
    bindType: LdapBindType;
}
declare var AD_ServerConfiguration: AD_ServerConfiguration & { new(): AD_ServerConfiguration; prototype: AD_ServerConfiguration };

/**
 * Unknown type of object
 * Plug-in: Active Directory
 */
interface AD_Unknown {
    /** the unique Id of the element */
    readonly id: string;
    /** Return the DN of the item */
    readonly distinguishedName: string;
    /** Returns all attributes */
    readonly allAttributes: any[];
    /** Return object GUID formatted as dashed string */
    readonly gUID: string;
    /** Removes an attribute as specified by the attribName parameter */
    removeAttribute(attribName: string): void;
    /** Destroy this element from the AD. Take care, this action PERMANENTLY DESTROY the element */
    destroy(param0: boolean): void;
    /** Allows a client to change the leftmost (least significant) component of the name of an entry in the directory. Ð¢o rename the entry you must provide it with the attribute as prefix - e.g. "cn=newName". */
    rename(name: string): void;
    /** Change the value of an existing attribute */
    setAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute */
    getAttribute(attibName: string): string;
    /** Adds an attribute */
    addAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute for an array of values */
    getArrayAttribute(attibName: string): string[];
    /** Get an AD attribute value as byte array. */
    getAttributeValueBytes(attibName: string): any[];
}
declare var AD_Unknown: AD_Unknown & { new(): AD_Unknown; prototype: AD_Unknown };

/**
 * User
 * Plug-in: Active Directory
 */
interface AD_User {
    /** the unique Id of the element */
    readonly id: string;
    /** Activate or deactivate a user */
    enabled: boolean;
    /** The user principal name */
    userPrincipalName: string;
    /** The SID represented as a character string with following format 'S-1-IdentifierAuthority-SubAuthority1-SubAuthority2-...-SubAuthorityn' */
    readonly sID: string;
    /** Return the SAM Account Name */
    readonly accountName: string;
    /** Return groups that contains the user */
    readonly memberOf: AD_UserGroup[];
    /** Return the DN of the item */
    readonly distinguishedName: string;
    /** Returns all attributes */
    readonly allAttributes: any[];
    /** Return object GUID formatted as dashed string */
    readonly gUID: string;
    /** Sets the passed in String value as a password of this user. */
    setPassword(newpasswordtoset_string: any): void;
    /** Sets the user account to change or not change the password at next logon. */
    setChangePasswordAtNextLogon(thisvaluetotrueifyouwanttoenforcetheusertochangehispasswordatnextlogon_boolean: any): void;
    /** Removes an attribute as specified by the attribName parameter */
    removeAttribute(attribName: string): void;
    /** Destroy this element from the AD. Take care, this action PERMANENTLY DESTROY the element */
    destroy(param0: boolean): void;
    /** Allows a client to change the leftmost (least significant) component of the name of an entry in the directory. Ð¢o rename the entry you must provide it with the attribute as prefix - e.g. "cn=newName". */
    rename(name: string): void;
    /** Change the value of an existing attribute */
    setAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute */
    getAttribute(attibName: string): string;
    /** Adds an attribute */
    addAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute for an array of values */
    getArrayAttribute(attibName: string): string[];
    /** Get an AD attribute value as byte array. */
    getAttributeValueBytes(attibName: string): any[];
}
declare var AD_User: AD_User & { new(): AD_User; prototype: AD_User };

/**
 * UserGroup
 * Plug-in: Active Directory
 */
interface AD_UserGroup {
    /** the unique Id of the element */
    readonly id: string;
    /** The SID represented as a character string with following format 'S-1-IdentifierAuthority-SubAuthority1-SubAuthority2-...-SubAuthorityn' */
    readonly sID: string;
    /** Gets the computers that are members of the current group */
    readonly computerMembers: AD_Computer[];
    /** Get the group of which current group is member */
    readonly memberOf: AD_UserGroup[];
    /** Gets the users that are members of the current group */
    readonly userMembers: AD_User[];
    /** Gets the groups that are members of the current group */
    readonly groupMembers: AD_UserGroup[];
    /** Return the DN of the item */
    readonly distinguishedName: string;
    /** Returns all attributes */
    readonly allAttributes: any[];
    /** Return object GUID formatted as dashed string */
    readonly gUID: string;
    /** Adds elements to the group */
    addElements(elements: any[]): void;
    /** Removes elements from the group */
    removeElements(elements: any[]): void;
    /** Removes an attribute as specified by the attribName parameter */
    removeAttribute(attribName: string): void;
    /** Destroy this element from the AD. Take care, this action PERMANENTLY DESTROY the element */
    destroy(param0: boolean): void;
    /** Allows a client to change the leftmost (least significant) component of the name of an entry in the directory. Ð¢o rename the entry you must provide it with the attribute as prefix - e.g. "cn=newName". */
    rename(name: string): void;
    /** Change the value of an existing attribute */
    setAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute */
    getAttribute(attibName: string): string;
    /** Adds an attribute */
    addAttribute(attribName: string, newValue: any): void;
    /** Get an AD attribute for an array of values */
    getArrayAttribute(attibName: string): string[];
    /** Get an AD attribute value as byte array. */
    getAttributeValueBytes(attibName: string): any[];
}
declare var AD_UserGroup: AD_UserGroup & { new(): AD_UserGroup; prototype: AD_UserGroup };

/**
 * Manage Active Directory plug-in configuration
 * Plug-in: Active Directory
 */
interface ConfigurationManager {
    /** Delete Active Directory server configuration. Since version 2.0.0 of the plug-in multiple Active Directory servers can be configured. This method will delete default Active Directory server configuration. */
    reset(): void;
    /** Return available Active Directory server configurations. */
    findAll(): any[];
    /** Configure Active Directory server. Since version 2.0.0 of Active Directory plug-in multiple Active Directory servers can be configured.This method will update default Active Directory configuration if exists otherwise new configuration will be created.Deprecated use saveConfiguration(ServerConfiguration). */
    updateConfiguration(param0: AD_ServerConfiguration): void;
    /** Delete Active Directory server configuration with specified id. */
    deleteConfiguration(param0: string): void;
    /** Validate Active Directory configuration. */
    validateConfiguration(param0: AD_ServerConfiguration): void;
    /** Save Active Directory server configuration. If provided configuration id is not set new configuration will be created otherwise existing configuration will be updated. */
    saveConfiguration(param0: AD_ServerConfiguration): string;
    /** Save ActiveDirectory plugin options. */
    savePluginOptions(param0: any): void;
    /** Get global ActiveDirectory plugin options. */
    getPluginOptions(): AD_PluginOptions;
    /** Return Active Directory server configuration with specified id. If id is not provided default Active Directory server will be returned. */
    getConfigurationById(param0: string): AD_ServerConfiguration;
}
declare var ConfigurationManager: ConfigurationManager & { new(): ConfigurationManager; prototype: ConfigurationManager };

/**
 * This class provides a data structure for holding information about an LDAP attribute, which includes an attribute name (which may include a set of attribute options) and zero or more values.
 * Plug-in: Active Directory
 */
interface LdapAttribute {
    /** Retrieves the name for this attribute (i.e., the attribute description), which may include zero or more attribute options. */
    getName(): string;
    /** Retrieves the value for this attribute as a string. */
    getValue(): string;
    /** Retrieves the number of values for this attribute. */
    size(): number;
    /** Indicates whether this attribute contains the specified value. */
    hasValue(param0: string): boolean;
    /** Retrieves the base name for this attribute, which is the name or OID of the attribute type, without any attribute options. */
    getBaseName(): string;
    /** Retrieves the value for this attribute as a long. */
    getValueAsLong(): number;
    /** Retrieves the set of values for this attribute as strings. */
    getValues(): string[];
    /** Retrieves the value for this attribute as a byte array. */
    getValueByteArray(): any[];
    /** Retrieves the value for this attribute as a Date. */
    getValueAsDate(): any;
    /** Retrieves the set of values for this attribute as byte arrays. */
    getValueByteArrays(): any[];
    /** Indicates whether this attribute contains the specified value. */
    hasValueAsByte(param0: any[]): boolean;
    /** Retrieves the set of options for this attribute. */
    getOptions(): any[];
}
declare var LdapAttribute: LdapAttribute & { new(name: string): LdapAttribute; new(name: string, values: string[]): LdapAttribute; prototype: LdapAttribute };

/** Plug-in: Active Directory */
interface LdapBindType {
    /** Use Simple bind */
    readonly Simple: LdapBindType;
    /** Use Digest. */
    readonly Digest: LdapBindType;
    /** Returns Bind Type as string. */
    getValue(): string;
    /** (Static) Returns supported bind types . */
    getValuesAsString(): any;
    /** (Static) Create BindType object from it's string representation. */
    fromString(value: string): LdapBindType;
}
declare var LdapBindType: LdapBindType & { new(): LdapBindType; prototype: LdapBindType };

/**
 * Connection to ldap server.
 * Plug-in: Active Directory
 */
interface LdapClient {
    /** Indicates whether this connection is currently established. */
    isConnected(): boolean;
    /** Deletes the entry with the specified DN. */
    delete(dn: string): LdapResult;
    /** Establishes an unauthenticated connection to the directory server using the provided information. */
    connect(host: string, port: number, timeout: number): void;
    /** If this method is invoked while any operations are in progress on this connection, then the directory server may or may not abort processing for those operations, depending on the type of operation and how far along the server has already gotten while processing that operation. It is recommended that all active operations be abandoned, canceled, or allowed to complete before attempting to close an active connection. */
    close(): void;
    /** Processes an add operation with the provided information. */
    addEntry(entry: LdapEntry): LdapResult;
    /** Processes a search operation with the provided information. The search result entries and references will be collected internally and included in the SearchResult object that is returned. */
    search(baseDN: string, searchScope: LdapSearchScope, derefPolicy: LdapDereferencePolicy, sizeLimit: number, timeLimit: number, filter: string, attributes: string[]): LdapSearchResult;
    /** The LDAP protocol specification forbids clients from attempting to perform a bind on a connection in which one or more other operations are already in progress. If a bind is attempted while any operations are in progress, then the directory server may or may not abort processing for those operations. */
    bind(bindDN: string, password: string): LdapResult;
    /** Retrieves the entry with the specified DN. The requested entry, or null if the target entry does not exist or no entry was returned (e.g., if the authenticated user does not have permission to read the target entry). */
    getEntry(dn: string, attributes: string[]): LdapEntry;
    /** Processes an add operation with the provided information. */
    addAttribute(dn: string, attributes: any[]): LdapResult;
    /** Specifies the user-friendly name that should be used for this connection. This name may be used in debugging to help identify the purpose of this connection. */
    setConnectionName(connectionName: string): void;
    /** Applies the provided modification to the specified entry. */
    modify(dn: string, modificaitons: any[]): any;
    /** Attempts to re-establish a connection to the server and re-authenticate if appropriate. */
    reconnect(): void;
    /** Retrieves the user-friendly name that has been assigned to this connection. */
    getConnectionName(): string;
    /** Retrieves the disconnect message for this connection, which may provide additional information about the reason for the disconnect, if available. */
    getDisconnectMessage(): string;
    /** Retrieves the time that this connection was last used to send or receive an LDAP message. The value will represent the number of milliseconds since January 1, 1970 UTC (the same format used by System.currentTimeMillis. */
    getLastCommunicationTime(): number;
    /** Deletes the entry with the specified DN. */
    deleteByDeleteRequest(param0: LdapDeleteRequest): LdapResult;
    /** Processes a search operation with the provided information. The search result entries and references will be collected internally and included in the SearchResult object that is returned. */
    searchBySearchRequest(searchRequest: LdapSearchRequest): LdapSearchResult;
    /** Applies the provided modification to the specified entry. */
    modifyDN(dn: string, newRDN: string, deleteOldRDN: boolean, newSuperiorDN: string): LdapResult;
    /** Retrieves the time that this connection was established in the number of milliseconds since January 1, 1970 UTC (the same format used by System.currentTimeMillis. */
    getConnectTime(): number;
    /** Processes a search operation with the provided information. It is expected that at most one entry will be returned from the search, and that no additional content from the successful search result (e.g., diagnostic message or response controls) are needed. */
    searchForEntry(dn: string, searchScope: LdapSearchScope, timeLimit: number, filter: string, attributes: string[]): LdapEntry;
}
declare var LdapClient: LdapClient & { new(param0: any, param1: string, param2: number, param3: string, param4: string): LdapClient; prototype: LdapClient };

/**
 * Create new non persisted ldap connections.
 * Plug-in: Active Directory
 */
interface LdapClientFactory {
    /** Creates a new LDAP connection that is established to the specified server and is authenticated as the specified user (via LDAP simple authentication). */
    newLdapClient(host: string, port: number, bindDN: string, password: string, useSSL: boolean): LdapClient;
}
declare var LdapClientFactory: LdapClientFactory & { new(): LdapClientFactory; prototype: LdapClientFactory };

/**
 * This class implements the processing necessary to perform an LDAPv3 search operation, which can be used to retrieve entries that match a given set of criteria.
 * Plug-in: Active Directory
 */
interface LdapDeleteRequest {
    /** Creates a new instance of this LDAP request that may be modified without impacting this request. The provided controls will be used for the new request instead of duplicating the controls from this request. */
    duplicate(controls: any[]): LdapDeleteRequest;
    /** (Static) Factory method for creating new LdapDeleteRequest instances from provided info. */
    createRequest(param0: string, param1: any[]): LdapDeleteRequest;
    /** Retrieves the DN of the entry to delete. */
    getDN(): string;
    /** Specifies the DN of the entry to delete. */
    setDN(dn: string): void;
    /** Retrieves the control with the specified OID from this request. If this request has multiple controls with the specified OID, then the first will be returned. */
    getControl(oid: string): void;
    /** Retrieves the type of operation that is represented by this request. */
    getOperationType(): any;
    /** Retrieves the set of controls for this request. The caller must not alter this set of controls. */
    getControls(): any[];
    /** Indicates whether this request contains at least one control. */
    hasControl(): boolean;
    /** Retrieves the maximum length of time in milliseconds that processing on this operation should be allowed to block while waiting for a response from the server. */
    getResponseTimeoutMillis(client: LdapClient): number;
    /** Specifies the maximum length of time in milliseconds that processing on this operation should be allowed to block while waiting for a response from the server. A value of zero indicates that no timeout should be enforced. A value that is less than zero indicates that the default response timeout for the underlying connection should be used. */
    setResponseTimeoutMillis(responseTimeout: number): void;
    /** Retrieves the message ID for the last LDAP message sent using this request. */
    getLastMessageID(): number;
    /** Specifies whether to automatically follow any referrals encountered while processing this request. This may be used to override the default behavior defined in the connection options for the connection used to process the request. */
    setFollowReferrals(followReferrals: boolean): void;
    /** Indicates whether to automatically follow any referrals encountered while processing this request. If a value has been set for this request, then it will be returned. Otherwise, the default from the connection options for the provided connection will be used. */
    followReferrals(client: LdapClient): boolean;
    /** Replaces the control with the same OID as the provided control with the provided control. If no control with the same OID exists in the request, then the control will be added to the request. If the request has multiple controls with the same OID as the new control, then only the first will be replaced. */
    replaceControl(control: any): any;
    /** Removes all controls from this request. */
    clearControls(): void;
    /** Adds the provided control to the set of controls for this request. */
    addControl(control: any): void;
    /** Replaces the control with the specified OID with the provided control. If no control with the given OID exists in the request, then a new control will be added. If this request has multiple controls with the specified OID, then only the first will be replaced. */
    replaceControlByOid(oid: string, control: any): void;
    /** Indicates whether this request contains at least one control with the specified OID. */
    hasControlByOid(oid: string): boolean;
    /** Removes the control with the specified OID from the set of controls for this request. If this request has multiple controls with the same OID, then only the first will be removed. */
    removeControlByOid(oid: string): any;
}
declare var LdapDeleteRequest: LdapDeleteRequest & { new(): LdapDeleteRequest; prototype: LdapDeleteRequest };

/**
 * This class defines a data type for dereference policy values. Clients should generally use one of the {@code NEVER}, {@code SEARCHING}, {@code FINDING}, {@code ALWAYS} values.
 * Plug-in: Active Directory
 */
interface LdapDereferencePolicy {
    /** A predefined dereference policy value which indicates that the server should not dereference any aliases that it encounters. */
    readonly NEVER: LdapDereferencePolicy;
    /** A predefined dereference policy value which indicates that the server should dereference any aliases that it may encounter while examining candidate entries, but it should not dereference the base entry if it happens to be an alias entry. */
    readonly SEARCHING: LdapDereferencePolicy;
    /** A predefined dereference policy value which indicates that the server should dereference the base entry if it happens to be an alias entry, but it should not dereference any alias entries that may be encountered while examining candidate entries. */
    readonly FINDING: LdapDereferencePolicy;
    /** A predefined dereference policy value which indicates that the server should dereference the base entry if it happens to be an alias entry, and should also dereference any entries that may be encountered while examining candidates. */
    readonly ALWAYS: LdapDereferencePolicy;
}
declare var LdapDereferencePolicy: LdapDereferencePolicy & { new(): LdapDereferencePolicy; prototype: LdapDereferencePolicy };

/**
 * This class provides a data structure for holding information about an LDAP distinguished name (DN). A DN consists of a comma-delimited list of zero or more RDN components.
 * Plug-in: Active Directory
 */
interface LdapDN {
    /** (Static) Creates a new DN from the provided string representation. */
    fromString(dnString: string): LdapRDN;
    /** (Static) Creates a new DN with the provided set of RDNs. */
    fromRdns(rdns: LdapRDN[]): LdapRDN;
    /** (Static) Creates a new DN below the provided parent DN with the given RDN. */
    fromParentDn(rdn: LdapRDN, parentDN: LdapDN): LdapRDN;
    /** Retrieves the leftmost (i.e., furthest from the naming context) RDN component for this DN. */
    getRDN(): LdapRDN;
    /** Retrieves the string representation of the leftmost (i.e., furthest from the naming context) RDN component for this DN. */
    getRDNString(): string;
    /** Retrieves the set of RDNs that comprise this DN. */
    getRDNs(): LdapRDN[];
    /** Retrieves the set of string representations of the RDNs that comprise this DN. */
    getRDNStrings(): any[];
    /** Indicates whether this DN represents the null DN, which does not have any RDN components. */
    isNullDN(): boolean;
    /** Retrieves the DN that is the parent for this DN. Note that neither the null DN nor DNs consisting of a single RDN component will be considered to have parent DNs. */
    getParent(): LdapDN;
    /** Retrieves the string representation of the DN that is the parent for this DN. Note that neither the null DN nor DNs consisting of a single RDN component will be considered to have parent DNs. */
    getParentString(): string;
    /** Indicates whether this DN is an ancestor of the provided DN. It will be considered an ancestor of the provided DN if the array of RDN components for the provided DN ends with the elements that comprise the array of RDN components for this DN (i.e., if the provided DN is subordinate to, or optionally equal to, this DN). The null DN will be considered an ancestor for all other DNs (with the exception of the null DN if allowEquals is false). */
    isAncestorOf(param0: LdapDN, param1: boolean): boolean;
    /** Indicates whether the provided object is equal to this DN. In order for the provided object to be considered equal, it must be a non-null DN with the same set of RDN components. */
    equals(dn: LdapDN): boolean;
    /** Retrieves a string representation of this DN. */
    toString(): string;
    /** Retrieves a normalized string representation of this DN. */
    toNormalizedString(): string;
}
declare var LdapDN: LdapDN & { new(): LdapDN; prototype: LdapDN };

/**
 * This class provides a data structure for holding information about an LDAP entry. An entry contains a distinguished name (DN) and a set of attributes. An entry can be created from these components, and it can also be created from its LDIF representation as described in RFC 2849.
 * Plug-in: Active Directory
 */
interface LdapEntry {
    /** Removes the specified attribute from this entry. */
    removeAttribute(param0: string): boolean;
    /** Indicates whether this entry contains the specified attribute. */
    hasAttribute(param0: LdapAttribute): boolean;
    /** Retrieves the set of attributes contained in this entry */
    getAttributes(): any[];
    /** Retrieves the attribute with the specified name. */
    getAttribute(param0: string): LdapAttribute;
    /** Adds the specified attribute to this entry, if it is not already present. */
    addAttribute(param0: LdapAttribute): boolean;
    /** Retrieves the value for the specified attribute, if available. If the attribute has more than one value, then the first value will be returned. */
    getAttributeValue(param0: string): string;
    /** Removes the specified attribute value from this entry if it is present. If it is the last value for the attribute, then the entire attribute will be removed. If the specified value is not present, then no change will be made. */
    removeAttributeValue(param0: string, param1: string): boolean;
    /** Retrieves the set of values for the specified attribute, if available */
    getAttributeValues(param0: string): string[];
    /** Retrieves the DN for this entry. */
    getDN(): string;
    /** Indicates whether this entry contains the specified attribute. */
    hasAttributeWithName(param0: string): boolean;
    /** Indicates whether this entry contains an attribute with the given name and value. */
    hasAttributeValueBytes(param0: string, param1: any[]): boolean;
    /** Retrieves the value for the specified attribute, if available. If the attribute has more than one value, then the first value will be returned. */
    getAttributeValueAsBytes(param0: string): any[];
    /** Adds the specified attribute value to this entry, if it is not already present. */
    addAttributeValue(param0: string, param1: string): boolean;
    /** Adds the specified attribute value to this entry, if it is not already present. */
    addAttributeValueAsByte(param0: string, param1: any[]): boolean;
    /** Adds the provided attribute to this entry. If this entry already contains an attribute with the same name, then their values will be merged. */
    addAttributeValues(param0: string, param1: any[]): boolean;
    /** Removes the specified attribute value from this entry if it is present. If it is the last value for the attribute, then the entire attribute will be removed. If the specified value is not present, then no change will be made. */
    removeAttributeValueAsBytes(param0: string, param1: any[]): boolean;
    /** Adds the provided attribute to this entry, replacing any existing set of values for the associated attribute. */
    setAttributeValue(param0: string, param1: string): void;
    /** Adds the provided attribute to this entry, replacing any existing set of values for the associated attribute. */
    setAttributeValueAsBytes(param0: string, param1: any[]): void;
    /** Adds the provided attribute to this entry, replacing any existing set of values for the associated attribute. */
    setAttributeValues(param0: string, param1: any[]): void;
    /** Specifies the DN for this entry. */
    setDN(param0: string): void;
    /** Retrieves the parsed DN for this entry. */
    getParsedDN(): LdapDN;
    /** Retrieves the parent DN for this entry as a string. */
    getParentDNString(): string;
    /** Indicates whether this entry contains an attribute with the given name and value. */
    hasAttributeValue(param0: string, param1: string): boolean;
    /** Indicates whether this entry contains the specified object class. */
    hasObjectClass(param0: string): boolean;
    /** Retrieves the value for the specified attribute, if available. If the attribute has more than one value, then the first value will be returned. */
    getAttributeValueAsBoolean(param0: string): boolean;
    /** Retrieves the value for the specified attribute, if available. If the attribute has more than one value, then the first value will be returned. */
    getAttributeValueAsDate(param0: string): any;
    /** Retrieves the value for the specified attribute, if available. If the attribute has more than one value, then the first value will be returned. */
    getAttributeValueAsInteger(param0: string): number;
    /** Retrieves the value for the specified attribute, if available. If the attribute has more than one value, then the first value will be returned. */
    getAttributeValueAsLong(param0: string): number;
    /** Retrieves the set of values for the specified attribute, if available */
    getAttributeValueByteArrays(param0: string): any[];
    /** Retrieves the values of the "objectClass" attribute from the entry, if available. */
    getObjectClassValues(): string[];
    /** Retrieves an LDIF representation of this entry, with each attribute value on a separate line. Long lines will not be wrapped. */
    toLDIF(): string[];
    /** Retrieves an LDIF-formatted string representation of this entry. No wrapping will be performed, and no extra blank lines will be added. */
    toLDIFString(param0: number): string;
}
declare var LdapEntry: LdapEntry & { new(dn: string, values: LdapAttribute[]): LdapEntry; new(entryLines: string[]): LdapEntry; prototype: LdapEntry };

/**
 * This class provides a data structure that represents an LDAP search filter. It provides methods for as parsing a filter from a string. See RFC 4515 for more information about representing search filters as strings.
 * Plug-in: Active Directory
 */
interface LdapFilter {
    /** (Static) Creates a new search filter from the provided string representation. */
    create(filterString: string): LdapFilter;
    /** (Static) Encodes the provided value into a form suitable for use as the assertion value in the string representation of a search filter. Parentheses, asterisks, backslashes, null characters, and any non-ASCII characters will be escaped using a backslash before the hexadecimal representation of each byte in the character to escape. */
    encodeValue(value: string): string;
    /** (Static) Encodes the provided value into a form suitable for use as the assertion value in the string representation of a search filter. Parentheses, asterisks, backslashes, null characters, and any non-ASCII characters will be escaped using a backslash before the hexadecimal representation of each byte in the character to escape. */
    encodeValueBytes(value: any): string;
}
declare var LdapFilter: LdapFilter & { new(): LdapFilter; prototype: LdapFilter };

/** Plug-in: Active Directory */
interface LdapLoadBalancingMode {
    /** Connect to a single server */
    readonly SingleServer: LdapLoadBalancingMode;
    /** Use a round-robin algorithm to select the server to which the connection should be established. Any number of servers may be included in this server set, and each request will attempt to retrieve a connection to the next server in the list. */
    readonly RoundRobin: LdapLoadBalancingMode;
    /** Establish connections to servers in the order they are provided. If the first server is unavailable, then it will attempt to connect to the second, then to the third. */
    readonly Failover: LdapLoadBalancingMode;
    /** Returns load balancing mode as string. */
    getValue(): string;
    /** (Static) Returns supported load balancing modes . */
    getValuesAsString(): any;
    /** (Static) Create LdapLoadBalancingMode object from it's string representation. */
    fromString(value: string): LdapLoadBalancingMode;
}
declare var LdapLoadBalancingMode: LdapLoadBalancingMode & { new(): LdapLoadBalancingMode; prototype: LdapLoadBalancingMode };

/** Plug-in: Active Directory */
interface LdapModification {
    /** Retrieves the name of the attribute to target with this modification. */
    getAttributeName(): string;
    /** the set of values for this modification as an array of strings. */
    getValues(): string[];
    /** Retrieves the set of values for this modification as an array of byte arrays */
    getValueByteArrays(): any;
}
declare var LdapModification: LdapModification & { new(modificationType: any, attributeName: string): LdapModification; new(modificationType: any, attributeName: string, attributeValue: string): LdapModification; new(modificationType: any, attributeName: string, attributeValues: string[]): LdapModification; prototype: LdapModification };

/** Plug-in: Active Directory */
interface LdapModificationType {
    readonly ADD: LdapModificationType;
    readonly DELETE: LdapModificationType;
    readonly REPLACE: LdapModificationType;
    readonly INCREMENT: LdapModificationType;
}
declare var LdapModificationType: LdapModificationType & { new(): LdapModificationType; prototype: LdapModificationType };

/**
 * This class provides a data structure for holding information about an LDAP relative distinguished name (RDN). An RDN consists of one or more attribute name-value pairs.
 * Plug-in: Active Directory
 */
interface LdapRDN {
    /** (Static) Creates a new RDN from the provided string representation. */
    fromString(rdnString: string): LdapRDN;
    /** (Static) Creates a new single-valued RDN with the provided information. */
    fromNameValue(attributeName: string, attributeValue: string): LdapRDN;
    /** Retrieves the set of attribute names for this RDN. */
    getAttributeNames(): string[];
    /** Retrieves the set of attribute values for this RDN. */
    getAttributeValues(): string[];
    /** Retrieves a string representation of this RDN. */
    toString(): string;
    /** Retrieves a normalized string representation of this RDN. */
    toNormalizedString(): string;
    /** Indicates whether the provided object is equal to this RDN. The given object will only be considered equal to this RDN if it is also an RDN with the same set of names and values. */
    equals(rdn: LdapRDN): boolean;
}
declare var LdapRDN: LdapRDN & { new(): LdapRDN; prototype: LdapRDN };

/**
 * This class provides a data structure for holding the elements that are common to most types of LDAP responses.
 * Plug-in: Active Directory
 */
interface LdapResult {
    /** Retrieves the result code from the response. */
    getResultCode(): any;
    /** Retrieves the matched DN from the response, if available. */
    getMatchedDN(): string;
    /** Retrieves the set of referral URLs from the response, if available. */
    getReferralURLs(): string[];
    /** Retrieves the diagnostic message from the response, if available. */
    getDiagnosticMessage(): string;
    /** Retrieves a string representation of this LDAP result, consisting of the result code, diagnostic message (if present), matched DN (if present), and referral URLs (if present). */
    getResultString(): string;
}
declare var LdapResult: LdapResult & { new(): LdapResult; prototype: LdapResult };

/**
 * This class implements the processing necessary to perform an LDAPv3 search operation, which can be used to retrieve entries that match a given set of criteria.
 * Plug-in: Active Directory
 */
interface LdapSearchRequest {
    /** Creates a new instance of this LDAP request that may be modified without impacting this request. The provided controls will be used for the new request instead of duplicating the controls from this request. */
    duplicate(controls: any[]): LdapSearchRequest;
    /** Specifies the filter that should be used to identify matching entries. */
    setFilter(filter: string): void;
    /** (Static) Factory method for creating new LdapSearchRequest instances from provided info. */
    createRequest(param0: string, param1: string, param2: LdapSearchScope, param3: string[], param4: LdapDereferencePolicy, param5: number, param6: number, param7: boolean): LdapSearchRequest;
    /** Specifies the scope for this search request. */
    setScope(param0: LdapSearchScope): void;
    /** Indicates whether the server should return only attribute names in matching entries, rather than both names and values. */
    typesOnly(): boolean;
    /** Retrieves the maximum number of entries that should be returned by the server when processing this search request. */
    getSizeLimit(): number;
    /** Retrieves the base DN for this search request */
    getBaseDN(): string;
    /** Retrieves the maximum length of time in seconds that the server should spend processing this search request. */
    getTimeLimitSeconds(): number;
    /** Specifies the base DN for this search request. */
    setBaseDN(baseDN: string): void;
    /** Specifies the maximum number of entries that should be returned by the server when processing this search request. A value of zero indicates that there should be no limit. */
    setSizeLimit(sizeLimit: number): void;
    /** Specifies the dereference policy that should be used by the server for any aliases encountered during search processing. */
    setDerefPolicy(param0: LdapDereferencePolicy): void;
    /** Specifies whether the server should return only attribute names in matching entries, rather than both names and values. */
    setTypesOnly(typesOnly: boolean): void;
    /** Retrieves the set of requested attributes to include in matching entries. */
    getAttributeList(): any[];
    /** Specifies the maximum length of time in seconds that the server should spend processing this search request. A value of zero indicates that there should be no limit. */
    setTimeLimitSeconds(timeLimit: number): void;
    /** Specifies the set of requested attributes to include in matching entries. */
    setAttributes(attributes: any[]): void;
    /** Retrieves the scope for this search request. */
    getScope(): LdapSearchScope;
    /** Retrieves the control with the specified OID from this request. If this request has multiple controls with the specified OID, then the first will be returned. */
    getControl(oid: string): void;
    /** Retrieves the type of operation that is represented by this request. */
    getOperationType(): any;
    /** Retrieves the set of controls for this request. The caller must not alter this set of controls. */
    getControls(): any[];
    /** Indicates whether this request contains at least one control. */
    hasControl(): boolean;
    /** Retrieves the maximum length of time in milliseconds that processing on this operation should be allowed to block while waiting for a response from the server. */
    getResponseTimeoutMillis(client: LdapClient): number;
    /** Specifies the maximum length of time in milliseconds that processing on this operation should be allowed to block while waiting for a response from the server. A value of zero indicates that no timeout should be enforced. A value that is less than zero indicates that the default response timeout for the underlying connection should be used. */
    setResponseTimeoutMillis(responseTimeout: number): void;
    /** Retrieves the message ID for the last LDAP message sent using this request. */
    getLastMessageID(): number;
    /** Specifies whether to automatically follow any referrals encountered while processing this request. This may be used to override the default behavior defined in the connection options for the connection used to process the request. */
    setFollowReferrals(followReferrals: boolean): void;
    /** Indicates whether to automatically follow any referrals encountered while processing this request. If a value has been set for this request, then it will be returned. Otherwise, the default from the connection options for the provided connection will be used. */
    followReferrals(client: LdapClient): boolean;
    /** Replaces the control with the same OID as the provided control with the provided control. If no control with the same OID exists in the request, then the control will be added to the request. If the request has multiple controls with the same OID as the new control, then only the first will be replaced. */
    replaceControl(control: any): any;
    /** Removes all controls from this request. */
    clearControls(): void;
    /** Adds the provided control to the set of controls for this request. */
    addControl(control: any): void;
    /** Replaces the control with the specified OID with the provided control. If no control with the given OID exists in the request, then a new control will be added. If this request has multiple controls with the specified OID, then only the first will be replaced. */
    replaceControlByOid(oid: string, control: any): void;
    /** Indicates whether this request contains at least one control with the specified OID. */
    hasControlByOid(oid: string): boolean;
    /** Removes the control with the specified OID from the set of controls for this request. If this request has multiple controls with the same OID, then only the first will be removed. */
    removeControlByOid(oid: string): any;
}
declare var LdapSearchRequest: LdapSearchRequest & { new(): LdapSearchRequest; prototype: LdapSearchRequest };

/**
 * This class provides a data structure for holding information about the result of processing a search request.
 * Plug-in: Active Directory
 */
interface LdapSearchResult {
    /** Retrieves the number of matching entries returned for the search operation. */
    getEntryCount(): number;
    /** Retrieves the result code from the response. */
    getResultCode(): any;
    /** Retrieves the matched DN from the response, if available. */
    getMatchedDN(): string;
    /** Retrieves the diagnostic message from the response, if available. */
    getDiagnosticMessage(): string;
    /** Retrieves the search result entry with the specified DN from the set of entries returned. This will only be available if a SearchResultListener was not used during the search. */
    getSearchEntries(): any[];
    /** Retrieves the number of search references returned for the search operation. This may be zero even if search references were received if the connection used when processing the search was configured to automatically follow referrals. */
    getReferenceCount(): number;
    /** Retrieves the search result entry with the specified DN from the set of entries returned. This will only be available if a SearchResultListener was not used during the search. */
    getSearchEntry(dn: string): LdapEntry;
    /** Retrieves a list containing the search references returned from the search operation. May be empty even if search references were received if the connection used when processing the search was configured to automatically follow referrals. */
    getSearchReferences(): any[];
}
declare var LdapSearchResult: LdapSearchResult & { new(): LdapSearchResult; prototype: LdapSearchResult };

/**
 * This class provides a data structure for representing an LDAP search result reference. A search result reference consists of a set of referral URLs and may also include zero or more controls. It describes an alternate location in which additional results for the search may be found. If there are multiple referral URLs, then they should all be considered equivalent ways to access the information (e.g., referrals referencing different servers that may be contacted).
 * Plug-in: Active Directory
 */
interface LdapSearchResultReference {
    /** Retrieves the set of referral URLs for this search result reference. */
    getReferralURLs(): string[];
}
declare var LdapSearchResultReference: LdapSearchResultReference & { new(): LdapSearchResultReference; prototype: LdapSearchResultReference };

/**
 * Ldap search scope
 * Plug-in: Active Directory
 */
interface LdapSearchScope {
    /** indicates that only the entry specified by the base DN should be considered. */
    readonly BASE: LdapSearchScope;
    /** indicates that only entries that are immediate subordinates of the entry specified by the base DN (but not the base entry itself) should be considered */
    readonly ONE: LdapSearchScope;
    /** which indicates that the base entry itself and any subordinate entries (to any depth) should be considered */
    readonly SUB: LdapSearchScope;
    /** indicates that any subordinate entries (to any depth) below the entry specified by the base DN should be considered, but the base entry itself should not be considered */
    readonly SUBORDINATE_SUBTREE: LdapSearchScope;
}
declare var LdapSearchScope: LdapSearchScope & { new(): LdapSearchScope; prototype: LdapSearchScope };

/**
 * This class provides an implementation of the simple paged results control as defined in RFC 2696. It allows the client to iterate through a potentially large set of search results in subsets of a specified number of entries (i.e., "pages")."
 * Plug-in: Active Directory
 */
interface LdapSimplePagedResultsControl {
    /** (Static) Extracts a simple paged results response control from the provided result. */
    get(param0: LdapSearchResult): LdapSimplePagedResultsControl;
    /** Retrieves the size for this paged results control. For a request control, it may be used to specify the number of entries that should be included in the next page of results. For a response control, it may be used to specify the estimated number of entries in the complete result set. */
    getSize(): number;
    /** Indicates whether there are more results to return as part of this search */
    moreResultsToReturn(): boolean;
    /** Retrieves the cookie for this control, which may be used in a subsequent request to resume reading entries from the next page of results. The value should have a length of zero when used to retrieve the first page of results for a given search, and also in the response from the server when there are no more entries to send. It should be non-empty for all other conditions. */
    getCookieBytes(): any[];
    /** Retrieves the cookie for this control, which may be used in a subsequent request to resume reading entries from the next page of results. The value should have a length of zero when used to retrieve the first page of results for a given search, and also in the response from the server when there are no more entries to send. It should be non-empty for all other conditions. */
    getCookie(): any;
    /** @ScriptingFunction("Retrieves the user-friendly name for this control, if available. If no user-friendly name has been defined, then the OID will be returned.") */
    getOID(): string;
    /** Indicates whether this control should be considered critical. */
    isCritical(): boolean;
    /** Retrieves the user-friendly name for this control, if available. If no user-friendly name has been defined, then the OID will be returned. */
    getControlName(): string;
}
declare var LdapSimplePagedResultsControl: LdapSimplePagedResultsControl & { new(pageSize: number, cookie: any, isCritical: boolean): LdapSimplePagedResultsControl; prototype: LdapSimplePagedResultsControl };

/**
 * TThis class provides an implementation of the subtree delete request control as defined in draft-armijo-ldap-treedelete. This can be used to delete an entry and all subordinate entries in a single operation."
 * Plug-in: Active Directory
 */
interface LdapSubtreeDeleteRequestControl {
    /** @ScriptingFunction("Retrieves the user-friendly name for this control, if available. If no user-friendly name has been defined, then the OID will be returned.") */
    getOID(): string;
    /** Indicates whether this control should be considered critical. */
    isCritical(): boolean;
    /** Retrieves the user-friendly name for this control, if available. If no user-friendly name has been defined, then the OID will be returned. */
    getControlName(): string;
}
declare var LdapSubtreeDeleteRequestControl: LdapSubtreeDeleteRequestControl & { new(): LdapSubtreeDeleteRequestControl; prototype: LdapSubtreeDeleteRequestControl };
