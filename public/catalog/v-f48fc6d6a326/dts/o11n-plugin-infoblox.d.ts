// Infoblox IPAM (o11n-plugin-infoblox), generated from modernvroapi.in data. Do not edit.

/** Plug-in: Infoblox IPAM */
interface DhcpPropertiesManager {
    /** Gets Member DHCP Properties */
    getMemberDhcpProperties(address: string, isIPv4Network: boolean): IpamMemberDhcpProperties;
    /** Gets Grid DHCP Properties */
    getGridDhcpProperties(): IpamGridDhcpProperties;
}
declare var DhcpPropertiesManager: DhcpPropertiesManager & { new(): DhcpPropertiesManager; prototype: DhcpPropertiesManager };

/**
 * Infoblox A/AAAA Record
 * Plug-in: Infoblox IPAM
 */
interface IpamAddressRecord {
    /** IPv4/IPv6 address */
    address: string;
    /** Name in FQDN format */
    name: string;
    /** DNS view */
    view: string;
    /** DNS zone */
    dnsZone: string;
    /** Comment */
    comment: string;
    /** Extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
}
declare var IpamAddressRecord: IpamAddressRecord & { new(): IpamAddressRecord; prototype: IpamAddressRecord };

/**
 * Infoblox IPAM API Type
 * Plug-in: Infoblox IPAM
 */
interface IpamApiType {
    /** WAPI */
    readonly WAPI: IpamApiType;
    /** Cloud API */
    readonly CLOUD_API: IpamApiType;
}
declare var IpamApiType: IpamApiType & { new(): IpamApiType; prototype: IpamApiType };

/**
 * The DNS Auth Zone
 * Plug-in: Infoblox IPAM
 */
interface IpamAuthZone {
    /** The FQDN of the Auth Zone. */
    fqdn: string;
    /** The Network View name. */
    networkView: string;
    /** The DNS View name. */
    dnsView: string;
}
declare var IpamAuthZone: IpamAuthZone & { new(): IpamAuthZone; prototype: IpamAuthZone };

/**
 * Infoblox CNAME Record
 * Plug-in: Infoblox IPAM
 */
interface IpamCnameRecord {
    /** Alias in FQDN format */
    alias: string;
    /** Canonical name in FQDN format */
    canonical: string;
    /** DNS view */
    view: string;
    /** DNS zone */
    dnsZone: string;
    /** Comment */
    comment: string;
    /** Extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
}
declare var IpamCnameRecord: IpamCnameRecord & { new(): IpamCnameRecord; prototype: IpamCnameRecord };

/**
 * Infoblox IPAM connection
 * Plug-in: Infoblox IPAM
 */
interface IpamConnection {
    /** Connection ID */
    readonly id: string;
    /** Host name */
    readonly hostName: string;
    /** API type */
    readonly apiType: IpamApiType;
    /** Config Default Network View */
    readonly configDefaultNetworkView: string;
    /** Config Default DNS View */
    readonly configDefaultDnsView: string;
    /** Default connection */
    readonly defaultConnection: boolean;
    /** Connection Priority */
    readonly connectionPriority: number;
    /** Gets network manager */
    getNetworkManager(): IpamNetworkManager;
    /** Gets DNS record manager */
    getDnsRecordManager(): IpamDnsRecordManager;
    /** Gets host manager */
    getHostManager(): IpamHostManager;
    /** Gets fixed address manager */
    getFixedAddressManager(): IpamFixedAddressManager;
    /** Gets view manager */
    getViewManager(): IpamViewManager;
    /** Gets tenant manager */
    getTenantManager(): TenantManager;
    /** Gets DHCP Properties Manager */
    getDhcpPropertiesManager(): DhcpPropertiesManager;
    /** Gets DNS Zone Manager */
    getZoneManager(): IpamZoneManager;
    /** Check connectivity */
    checkConnectivity(): void;
    /** Restart Grid services */
    restartServices(restartOptions: IpamRestartOptions): void;
    /** Gets extensible attribute definitions */
    getExtensibleAttributeDefinitions(): IpamExtensibleAttributeDefinition[];
    /** Gets extensible attribute definition */
    getExtensibleAttributeDefinition(name: string): IpamExtensibleAttributeDefinition;
    /** Reloads extensible attribute definitions */
    reloadExtensibleAttributeDefinitions(): void;
    /** Checks if specified IPAM connection is equal to the current one */
    isEqual(other: IpamConnection): boolean;
}
declare var IpamConnection: IpamConnection & { new(id: string, password: string, apiType: IpamApiType): IpamConnection; prototype: IpamConnection };

/** Plug-in: Infoblox IPAM */
interface IpamConnectionManager {
    /** Gets IPAM connection by id */
    getConnectionById(id: string): IpamConnection;
    /** Saves IPAM connection in the plug-in cache */
    saveConnection(connection: IpamConnection): IpamConnection;
    /** (Static) Refreshes SSL context */
    refreshSslContext(): void;
}
declare var IpamConnectionManager: IpamConnectionManager & { new(): IpamConnectionManager; prototype: IpamConnectionManager };

/**
 * Infoblox IPAM DHCP Options
 * Plug-in: Infoblox IPAM
 */
interface IpamDhcpOptions {
    /** The IP addresses of the routers. Applicable only for IPv4 networks. */
    routers: string[];
    /** The domain name (DNS suffix) */
    domainName: string;
    /** The IP addresses of the DNS servers */
    domainNameServers: string[];
    /** The DNS suffixes for search */
    domainSearch: string[];
    /** The IP addresses of the NetBIOS name servers. Applicable only for IPv4 networks. */
    netbiosNameServers: string[];
}
declare var IpamDhcpOptions: IpamDhcpOptions & { new(): IpamDhcpOptions; prototype: IpamDhcpOptions };

/**
 * Infoblox IPAM DHCP Range
 * Plug-in: Infoblox IPAM
 */
interface IpamDhcpRange {
    /** The reference of range */
    reference: string;
    /** The start address of range */
    startAddress: string;
    /** The end address of range */
    endAddress: string;
    /** The address of network to which this range belongs */
    networkAddress: string;
    /** The CIDR of network to which this range belongs */
    networkCidr: string;
    /** The network view name */
    networkView: string;
    /** The IPAM DHCP options */
    dhcpOptions: IpamDhcpOptions;
    /** The member that will provide service for this range */
    members: IpamMembers;
    /** Flag to restart DHCP service if needed */
    restartIfNeeded: boolean;
    /** The comment about the DHCP range */
    comment: string;
    /** The extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
}
declare var IpamDhcpRange: IpamDhcpRange & { new(): IpamDhcpRange; prototype: IpamDhcpRange };

/** Plug-in: Infoblox IPAM */
interface IpamDnsRecordManager {
    /** Add CNAME record */
    addCnameRecord(ipamCnameRecord: IpamCnameRecord): any;
    /** Remove CNAME record */
    removeCnameRecord(alias: string): any;
    /** Find CNAME records matching the specified alias(name) */
    findCnameRecordsByAlias(alias: string): IpamCnameRecord[];
    /** Find CNAME records matching the specified canonical name */
    findCnameRecordsByCanonicalName(): IpamCnameRecord[];
    /** Find CNAME records matching all the IPAM Extensible Attributes */
    findCnameRecordsByEA(extensibleAttributes: IpamSearchableExtensibleAttribute[], defaultDnsView: boolean): IpamCnameRecord[];
    /** Checks if A/AAAA record exists in IPAM */
    isAddressRecordExists(): boolean;
    /** Add A/AAAA record */
    addAddressRecord(ipamAddressRecord: IpamAddressRecord): any;
    /** Add A/AAAA record in a Network */
    addAddressRecordInNetwork(ipamAddressRecord: IpamAddressRecord, ipamNetwork: IpamNetwork): string;
    /** Add A/AAAA record in a Network Range */
    addAddressRecordInRange(ipamAddressRecord: IpamAddressRecord, ipamDhcpRange: IpamDhcpRange): string;
    /** Remove A/AAAA record */
    removeAddressRecord(ipAddress: string): any;
    /** Find A/AAAA Records matching all the IPAM Extensible Attributes */
    findAddressRecordsByEA(extensibleAttributes: IpamSearchableExtensibleAttribute[], dnsView: string, defaultDnsView: boolean): IpamAddressRecord[];
    /** Checks if PTR record exists in IPAM */
    isPtrRecordExists(): boolean;
    /** Add PTR record */
    addPtrRecord(ipamPtrRecord: IpamPtrRecord): any;
    /** Remove PTR record */
    removePtrRecord(ipAddress: string): any;
    /** Find PTR Records matching all the IPAM Extensible Attributes */
    findPtrRecordsByEA(extensibleAttributes: IpamSearchableExtensibleAttribute[], dnsView: string, defaultDnsView: boolean): IpamPtrRecord[];
    /** Change the IP address of A/AAAA/PTR DNS records with specified name */
    changeIpAddress(newIpAddress: string): any;
    /** Changes the name of A/AAAA/PTR/CNAME DNS records with specified old name */
    changeDnsName(): any;
    /** Searches for A/AAAA/PTR/CNAME records by EAs and updates host name of the found records */
    changeDnsNameByEa(extensibleAttributes: IpamSearchableExtensibleAttribute[]): number;
}
declare var IpamDnsRecordManager: IpamDnsRecordManager & { new(): IpamDnsRecordManager; prototype: IpamDnsRecordManager };

/**
 * Infoblox IPAM Extensible Attribute
 * Plug-in: Infoblox IPAM
 */
interface IpamExtensibleAttribute {
    /** Name of extensible attribute */
    name: string;
    /** Type of extensible attribute */
    type: IpamExtensibleAttributeType;
    /** Value of extensible attribute */
    value: string;
}
declare var IpamExtensibleAttribute: IpamExtensibleAttribute & { new(): IpamExtensibleAttribute; prototype: IpamExtensibleAttribute };

/**
 * Infoblox IPAM Extensible Attribute Definition
 * Plug-in: Infoblox IPAM
 */
interface IpamExtensibleAttributeDefinition {
    /** Name */
    readonly name: string;
    /** Type */
    readonly type: IpamExtensibleAttributeDefinitionType;
    /** Default value */
    readonly defaultValue: string;
    /** Comment */
    readonly comment: string;
    /** Gets the IPAM connection, this object belongs to. */
    getConnection(): IpamConnection;
}
declare var IpamExtensibleAttributeDefinition: IpamExtensibleAttributeDefinition & { new(): IpamExtensibleAttributeDefinition; prototype: IpamExtensibleAttributeDefinition };

/**
 * Infoblox IPAM Extensible Attribute Definition Type
 * Plug-in: Infoblox IPAM
 */
interface IpamExtensibleAttributeDefinitionType {
    /** String extensible attribute type of Infoblox IPAM */
    readonly STRING: IpamExtensibleAttributeType;
    /** Integer extensible attribute type of Infoblox IPAM */
    readonly INTEGER: IpamExtensibleAttributeType;
    /** Date extensible attribute type of Infoblox IPAM */
    readonly DATE: IpamExtensibleAttributeType;
    /** Email extensible attribute type of Infoblox IPAM */
    readonly EMAIL: IpamExtensibleAttributeType;
    /** List extensible attribute type of Infoblox IPAM */
    readonly LIST: IpamExtensibleAttributeType;
    /** URL extensible attribute type of Infoblox IPAM */
    readonly URL: IpamExtensibleAttributeType;
}
declare var IpamExtensibleAttributeDefinitionType: IpamExtensibleAttributeDefinitionType & { new(): IpamExtensibleAttributeDefinitionType; prototype: IpamExtensibleAttributeDefinitionType };

/**
 * Infoblox IPAM Extensible Attribute Type
 * Plug-in: Infoblox IPAM
 */
interface IpamExtensibleAttributeType {
    /** String, List, Email, URL, Date extensible attribute types of Infoblox IPAM */
    readonly STRING: IpamExtensibleAttributeType;
    /** Integer extensible attribute type of Infoblox IPAM */
    readonly INTEGER: IpamExtensibleAttributeType;
}
declare var IpamExtensibleAttributeType: IpamExtensibleAttributeType & { new(): IpamExtensibleAttributeType; prototype: IpamExtensibleAttributeType };

/**
 * Infoblox IPAM Fixed Address
 * Plug-in: Infoblox IPAM
 */
interface IpamFixedAddress {
    /** Reference to the fixed address */
    reference: string;
    /** The IPv4/IPv6 address */
    address: string;
    /** The MAC address/DUID */
    mac: string;
    /** The name for the fixed address. This field is required if the network is served by a Microsoft server. This field accepts the name of the fixed address in the native character set. */
    name: string;
    /** The network view */
    networkView: string;
    /** The comment */
    comment: string;
    /** The IPv4 address of the MS DHCP server associated with this fixed address (applicable for IPv4 fixed address only) */
    msServerIpAddress: string;
    /** The extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
    /** Flag to restart DHCP service if needed */
    restartIfNeeded: boolean;
}
declare var IpamFixedAddress: IpamFixedAddress & { new(): IpamFixedAddress; prototype: IpamFixedAddress };

/** Plug-in: Infoblox IPAM */
interface IpamFixedAddressManager {
    /** Add fixed address to the IPAM */
    addFixedAddress(fixedAddress: IpamFixedAddress): any;
    /** Add fixed address in network to the IPAM */
    addFixedAddressInNetwork(fixedAddress: IpamFixedAddress, network: IpamNetwork): string;
    /** Add fixed address in DHCP range to the IPAM */
    addFixedAddressInRange(fixedAddress: IpamFixedAddress, dhcpRange: IpamDhcpRange): string;
    /** Get fixed address by IP address */
    getFixedAddressByIP(ipAddress: string, networkView: string): IpamFixedAddress;
    /** Remove fixed address */
    removeFixedAddress(reference: string): any;
    /** Find the list of fixed addresses which match the query by Extensible attributes */
    findFixedAddressesByEA(extensibleAttributes: IpamSearchableExtensibleAttribute[], networkView: string, defaultNetworkView: boolean): IpamFixedAddress[];
    /** Update fixed address */
    updateFixedAddress(fixedAddress: IpamFixedAddress): any;
}
declare var IpamFixedAddressManager: IpamFixedAddressManager & { new(): IpamFixedAddressManager; prototype: IpamFixedAddressManager };

/**
 * The Infoblox Grid DHCP Properties
 * Plug-in: Infoblox IPAM
 */
interface IpamGridDhcpProperties {
    /** The IPAM DHCP options. */
    dhcpOptions: IpamDhcpOptions;
}
declare var IpamGridDhcpProperties: IpamGridDhcpProperties & { new(): IpamGridDhcpProperties; prototype: IpamGridDhcpProperties };

/**
 * Infoblox IPAM Host
 * Plug-in: Infoblox IPAM
 */
interface IpamHost {
    /** Reference to the WAPI host record */
    reference: string;
    /** Name in FQDN format */
    fqdn: string;
    /** Host addresses */
    addresses: IpamHostAddress[];
    /** Comment */
    comment: string;
    /** Extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
    /** Aliases in FQDN format */
    aliases: string[];
    /** DNS view */
    dnsView: string;
    /** DNS zone */
    dnsZone: string;
}
declare var IpamHost: IpamHost & { new(): IpamHost; prototype: IpamHost };

/**
 * Infoblox IPAM Host Address
 * Plug-in: Infoblox IPAM
 */
interface IpamHostAddress {
    /** The IPv4 or IPv6 address */
    ip: string;
    /** The MAC address or DUID */
    mac: string;
    /** Flag to enable DHCP configuration */
    enableDhcp: boolean;
}
declare var IpamHostAddress: IpamHostAddress & { new(): IpamHostAddress; prototype: IpamHostAddress };

/**
 * Infoblox IPAM Host Info
 * Plug-in: Infoblox IPAM
 */
interface IpamHostInfo {
    /** Name in FQDN format */
    fqdn: string;
    /** Comment */
    comment: string;
    /** Extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
    /** Aliases in FQDN format */
    aliases: string[];
    /** DNS view */
    dnsView: string;
    /** Enable DNS configuration */
    enableDns: boolean;
    /** Restart DHCP service if needed */
    restartIfNeeded: boolean;
}
declare var IpamHostInfo: IpamHostInfo & { new(): IpamHostInfo; prototype: IpamHostInfo };

/**
 * Detailed documentation not available.
 * Plug-in: Infoblox IPAM
 */
interface IpamHostManager {
    /** Adds host record with specified IP address. */
    addHost(host: IpamHostInfo, hostAddress: IpamHostAddress): any;
    /** Adds host record in a network. */
    addHostInNetwork(host: IpamHostInfo, hostAddress: IpamHostAddress, network: IpamNetwork): string;
    /** Adds host record in a network range. */
    addHostInRange(host: IpamHostInfo, hostAddress: IpamHostAddress, dhcpRange: IpamDhcpRange): string;
    /** Adds a host address with specified IP address to the existing host record in IPAM. */
    addHostAddress(dnsView: string, hostAddress: IpamHostAddress, restartIfNeeded: boolean): any;
    /** Adds a host address to the existing host record in IPAM using specified network to get next available IP address. */
    addHostAddressInNetwork(dnsView: string, hostAddress: IpamHostAddress, network: IpamNetwork, restartIfNeeded: boolean): string;
    /** Adds a host address to the existing host record in IPAM using specified DHCP network range to get next available IP address. */
    addHostAddressInRange(dnsView: string, hostAddress: IpamHostAddress, dhcpRange: IpamDhcpRange, restartIfNeeded: boolean): string;
    /** Finds host records by name. If DNS view is not specified, then default DNS view will be used. */
    findHostsByName(dnsView: string): IpamHost[];
    /** Finds host records by IP address. If network view is not specified, then default network view will be used. */
    findHostsByIP(ipAddress: string, networkView: string): IpamHost[];
    /** Find host records matching all the IPAM extensible attributes. */
    findHostsByEA(extensibleAttributes: IpamSearchableExtensibleAttribute[]): IpamHost[];
    /** Updates host record. */
    updateHost(reference: string, updateInfo: IpamUpdateHostInfo, restartIfNeeded: boolean): any;
    /** Removes host record. */
    removeHost(reference: string): any;
}
declare var IpamHostManager: IpamHostManager & { new(): IpamHostManager; prototype: IpamHostManager };

/**
 * Version of IP protocol
 * Plug-in: Infoblox IPAM
 */
interface IpamIpVersion {
    /** IPv4 protocol */
    readonly IP_V4: IpamIpVersion;
    /** IPv6 protocol */
    readonly IP_V6: IpamIpVersion;
}
declare var IpamIpVersion: IpamIpVersion & { new(): IpamIpVersion; prototype: IpamIpVersion };

/**
 * The Infoblox Member DHCP Properties
 * Plug-in: Infoblox IPAM
 */
interface IpamMemberDhcpProperties {
    /** The IPAM DHCP options. */
    dhcpOptions: IpamDhcpOptions;
    /** The IPv6 Address of the member. */
    ipv6Address: string;
    /** The IPv4 Address of the member. */
    ipv4Address: string;
    /** The Host Name of the member. */
    hostName: string;
}
declare var IpamMemberDhcpProperties: IpamMemberDhcpProperties & { new(): IpamMemberDhcpProperties; prototype: IpamMemberDhcpProperties };

/**
 * The Infoblox Grid members
 * Plug-in: Infoblox IPAM
 */
interface IpamMembers {
    /** The type of Grid members. */
    type: IpamMemberType;
    /** The addresses of Grid members. */
    addresses: string[];
}
declare var IpamMembers: IpamMembers & { new(): IpamMembers; prototype: IpamMembers };

/**
 * The type of member
 * Plug-in: Infoblox IPAM
 */
interface IpamMemberType {
    /** The Infoblox Grid member serving DHCP. */
    readonly INFOBLOX: IpamMemberType;
    /** The Microsoft (r) server serving DHCP. */
    readonly MICROSOFT: IpamMemberType;
}
declare var IpamMemberType: IpamMemberType & { new(): IpamMemberType; prototype: IpamMemberType };

/**
 * Infoblox IPAM network
 * Plug-in: Infoblox IPAM
 */
interface IpamNetwork {
    /** The reference of network */
    reference: string;
    /** The address of network */
    address: string;
    /** The cidr of network */
    cidr: number;
    /** The address of parent network container */
    networkContainerAddress: string;
    /** The cidr of parent network container */
    networkContainerCidr: number;
    /** The comment about the network */
    comment: string;
    /** The network view name */
    networkView: string;
    /** The extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
    /** The IPAM DHCP options */
    dhcpOptions: IpamDhcpOptions;
    /** The list of members or Microsoft(r) servers that serve DHCP for this network */
    members: IpamMembers;
    /** Flag to restart DHCP service if needed */
    restartIfNeeded: boolean;
}
declare var IpamNetwork: IpamNetwork & { new(): IpamNetwork; prototype: IpamNetwork };

/**
 * Infoblox IPAM network container
 * Plug-in: Infoblox IPAM
 */
interface IpamNetworkContainer {
    /** The reference of network container */
    reference: string;
    /** The address of network container */
    address: string;
    /** The cidr of network container */
    cidr: number;
    /** The address of parent network container */
    networkContainerAddress: string;
    /** The cidr of parent network container */
    networkContainerCidr: number;
    /** The network view name */
    networkView: string;
    /** The comment */
    comment: string;
    /** The IPAM DHCP options */
    dhcpOptions: IpamDhcpOptions;
    /** The extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
}
declare var IpamNetworkContainer: IpamNetworkContainer & { new(): IpamNetworkContainer; prototype: IpamNetworkContainer };

/**
 * Filter to search for networks
 * Plug-in: Infoblox IPAM
 */
interface IpamNetworkFilter {
    /** Network view name */
    networkView: string;
    /** IPv4 or IPv6 network */
    ipVersion: IpamIpVersion;
    /** Extensible attributes */
    extensibleAttributes: IpamSearchableExtensibleAttribute[];
    /** Maximum number of results */
    maxResults: number;
    /** Regular expression for searching for networks */
    network: string;
    /** Network search comparison */
    networkSearchComparison: IpamSearchComparisonType;
}
declare var IpamNetworkFilter: IpamNetworkFilter & { new(): IpamNetworkFilter; prototype: IpamNetworkFilter };

/** Plug-in: Infoblox IPAM */
interface IpamNetworkManager {
    /** Get next available IP address from given network */
    getNextAvailableIP(network: IpamNetwork): string;
    /** Get next available IP address from given DHCP range */
    getNextAvailableIPFromRange(dhcpRange: IpamDhcpRange): string;
    /** Add Network */
    addNetwork(network: IpamNetwork, template: string, members: IpamMembers): any;
    /** Add next available network in parent network */
    addNextAvailableNetworkByRef(network: IpamNetwork, parentRef: string, cidr: string): string;
    /** Add next available network in parent network */
    addNextAvailableNetworkByNetaddr(network: IpamNetwork, parentAddress: string, parentNetworkView: string, cidr: string): string;
    /** Add next available network in parent network */
    addNextAvailableNetworkFromContainer(parentAddress: string, networkView: string, cidr: string, eaValue: string, comment: string, param6: string): string;
    /** Find list of networks by filter */
    findNetworks(filter: IpamNetworkFilter): IpamNetwork[];
    /** Find list of network containers by filter */
    findNetworkContainers(filter: IpamNetworkFilter): IpamNetworkContainer[];
    /** Find list of ranges by filter */
    findRanges(filter: IpamRangeFilter): IpamDhcpRange[];
    /** Remove network */
    removeNetwork(ipAddress: string, cidr: number, networkView: string): any;
    /** Remove network by network reference */
    removeNetworkByRef(reference: string): any;
    /** Remove range by range reference */
    removeRangeByRef(reference: string): any;
    /** Update network */
    updateNetwork(reference: string, updateInfo: IpamUpdateNetworkInfo, restartIfNeeded: boolean): any;
    /** Update range */
    updateRange(reference: string, updateInfo: IpamUpdateRangeInfo, restartIfNeeded: boolean): any;
    /** Get network */
    getNetwork(ipAddress: string, cidr: number, networkView: string): IpamNetwork;
    /** Get network by network reference */
    getNetworkByRef(reference: string): IpamNetwork;
    /** Get network container by network reference */
    getNetworkContainerByRef(reference: string): IpamNetworkContainer;
    /** Get network container */
    getNetworkContainer(ipAddress: string, cidr: number, networkView: string): IpamNetworkContainer;
    /** Get Merged Network Container DHCP Options */
    getNetworkContainerInheritedDhcpOptions(ipAddress: string, cidr: number, networkView: string): IpamDhcpOptions;
    /** Get DHCP range */
    getDhcpRange(startAddress: string, endAddress: string, networkView: string): IpamDhcpRange;
    /** Get DHCP range by range reference */
    getRangeByRef(reference: string): IpamDhcpRange;
    /** Add exclusion range in the specified IPAM network */
    addExclusionRange(startAddress: string, endAddress: string, network: IpamNetwork, restartIfNeeded: boolean): any;
    /** Add DHCP range */
    addDhcpRange(range: IpamDhcpRange): any;
    /** Removed the specified DHCP range */
    removeDhcpRange(startAddress: string, endAddress: string, networkView: string): any;
}
declare var IpamNetworkManager: IpamNetworkManager & { new(): IpamNetworkManager; prototype: IpamNetworkManager };

/**
 * Infoblox Network View
 * Plug-in: Infoblox IPAM
 */
interface IpamNetworkView {
    /** Reference */
    readonly reference: string;
    /** Name */
    name: string;
    /** Comment */
    comment: string;
    /** Is default */
    readonly defaultNetworkView: boolean;
    /** Extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
}
declare var IpamNetworkView: IpamNetworkView & { new(): IpamNetworkView; prototype: IpamNetworkView };

/**
 * Infoblox PTR Record
 * Plug-in: Infoblox IPAM
 */
interface IpamPtrRecord {
    /** Domain name in FQDN format */
    domainName: string;
    /** DNS view */
    dnsView: string;
    /** IPv4/IPv6 address */
    address: string;
    /** Comment */
    comment: string;
    /** Extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
}
declare var IpamPtrRecord: IpamPtrRecord & { new(): IpamPtrRecord; prototype: IpamPtrRecord };

/**
 * Filter to search for ranges
 * Plug-in: Infoblox IPAM
 */
interface IpamRangeFilter {
    /** Network view name */
    networkView: string;
    /** IPv4 or IPv6 network */
    ipVersion: IpamIpVersion;
    /** Extensible attributes */
    extensibleAttributes: IpamSearchableExtensibleAttribute[];
    /** Maximum number of results */
    maxResults: number;
    /** Regular expression for searching for networks */
    network: string;
    /** Network search comparison */
    networkSearchComparison: IpamSearchComparisonType;
}
declare var IpamRangeFilter: IpamRangeFilter & { new(): IpamRangeFilter; prototype: IpamRangeFilter };

/**
 * The order in which Grid members are being restarted
 * Plug-in: Infoblox IPAM
 */
interface IpamRestartMemberOrder {
    /** Simultaneously order */
    readonly SIMULTANEOUSLY: IpamRestartMemberOrder;
    /** Sequentially order */
    readonly SEQUENTIALLY: IpamRestartMemberOrder;
}
declare var IpamRestartMemberOrder: IpamRestartMemberOrder & { new(): IpamRestartMemberOrder; prototype: IpamRestartMemberOrder };

/**
 * The options of request to restart Grid services
 * Plug-in: Infoblox IPAM
 */
interface IpamRestartOptions {
    /** The restart member order */
    memberOrder: IpamRestartMemberOrder;
    /** The restart request type */
    requestType: IpamRestartRequestType;
    /** The restart service option */
    serviceOption: IpamRestartServiceOption;
    /** The delayed time, in seconds, between Grid member restarts */
    sequentialDelay: number;
}
declare var IpamRestartOptions: IpamRestartOptions & { new(): IpamRestartOptions; prototype: IpamRestartOptions };

/**
 * The type of restart request
 * Plug-in: Infoblox IPAM
 */
interface IpamRestartRequestType {
    /** Force restart */
    readonly FORCE_RESTART: IpamRestartRequestType;
    /** Restart if needed */
    readonly RESTART_IF_NEEDED: IpamRestartRequestType;
}
declare var IpamRestartRequestType: IpamRestartRequestType & { new(): IpamRestartRequestType; prototype: IpamRestartRequestType };

/**
 * Grid services to restart
 * Plug-in: Infoblox IPAM
 */
interface IpamRestartServiceOption {
    /** All services */
    readonly ALL: IpamRestartServiceOption;
    /** DHCP service */
    readonly DHCP: IpamRestartServiceOption;
    /** DNS service */
    readonly DNS: IpamRestartServiceOption;
}
declare var IpamRestartServiceOption: IpamRestartServiceOption & { new(): IpamRestartServiceOption; prototype: IpamRestartServiceOption };

/**
 * Infoblox IPAM Searchable Extensible Attribute
 * Plug-in: Infoblox IPAM
 */
interface IpamSearchableExtensibleAttribute {
    /** Extensible attribute */
    extensibleAttribute: IpamExtensibleAttribute;
    /** Comparation type */
    comparison: IpamSearchComparisonType;
}
declare var IpamSearchableExtensibleAttribute: IpamSearchableExtensibleAttribute & { new(): IpamSearchableExtensibleAttribute; prototype: IpamSearchableExtensibleAttribute };

/**
 * Infoblox IPAM Search Comparison Type
 * Plug-in: Infoblox IPAM
 */
interface IpamSearchComparisonType {
    /** Exact match */
    readonly EQUAL: IpamSearchComparisonType;
    /** Makes string matching case insensitive */
    readonly EQUAL_CASE_INSENSITIVE: IpamSearchComparisonType;
    /** Negates the condition */
    readonly NOT_EQUAL: IpamSearchComparisonType;
    /** Regular expression search. Expressions are unanchored */
    readonly REGULAR_EXPRESSION: IpamSearchComparisonType;
    /** Less than or equal */
    readonly LESS_OR_EQUAL: IpamSearchComparisonType;
    /** Greater than or equal */
    readonly GREATER_OR_EQUAL: IpamSearchComparisonType;
}
declare var IpamSearchComparisonType: IpamSearchComparisonType & { new(): IpamSearchComparisonType; prototype: IpamSearchComparisonType };

/**
 * Update array strategy
 * Plug-in: Infoblox IPAM
 */
interface IpamUpdateArrayStrategy {
    /** Update existing items or add new items if absent */
    readonly MERGE: IpamUpdateArrayStrategy;
    /** Overwrite existing items with the new ones */
    readonly OVERWRITE: IpamUpdateArrayStrategy;
}
declare var IpamUpdateArrayStrategy: IpamUpdateArrayStrategy & { new(): IpamUpdateArrayStrategy; prototype: IpamUpdateArrayStrategy };

/**
 * Information for updating fixed address
 * Plug-in: Infoblox IPAM
 */
interface IpamUpdateFixedAddressInfo {
    /** The name */
    name: string;
    /** The MAC address or DUID */
    mac: string;
}
declare var IpamUpdateFixedAddressInfo: IpamUpdateFixedAddressInfo & { new(): IpamUpdateFixedAddressInfo; prototype: IpamUpdateFixedAddressInfo };

/**
 * Infoblox IPAM Host Info required for updating
 * Plug-in: Infoblox IPAM
 */
interface IpamUpdateHostInfo {
    /** The new host name */
    newHostName: string;
    /** The additional aliases of the host. These will be appended to existing list of aliases. */
    additionalAliases: string[];
    /** Flag which indicates whether to update host address or not */
    updateHostAddress: boolean;
    /** The IP address to update */
    oldIp: string;
    /** The new IP address */
    newIp: string;
    /** The new MAC address */
    newMac: string;
    /** The new Enable for DHCP flag */
    newEnableDhcp: boolean;
    /** The new Enable for DNS flag */
    newEnableDns: boolean;
}
declare var IpamUpdateHostInfo: IpamUpdateHostInfo & { new(): IpamUpdateHostInfo; prototype: IpamUpdateHostInfo };

/**
 * Information for updating network
 * Plug-in: Infoblox IPAM
 */
interface IpamUpdateNetworkInfo {
    /** The IPAM DHCP options */
    dhcpOptions: IpamDhcpOptions;
    /** The update DHCP options strategy (MERGE by default) */
    updateDhcpOptionsStrategy: IpamUpdateArrayStrategy;
}
declare var IpamUpdateNetworkInfo: IpamUpdateNetworkInfo & { new(): IpamUpdateNetworkInfo; prototype: IpamUpdateNetworkInfo };

/**
 * Information for updating range
 * Plug-in: Infoblox IPAM
 */
interface IpamUpdateRangeInfo {
    /** The IPAM DHCP options */
    dhcpOptions: IpamDhcpOptions;
    /** The extensible attributes */
    extensibleAttributes: IpamExtensibleAttribute[];
    /** The update DHCP options strategy (MERGE by default) */
    updateDhcpOptionsStrategy: IpamUpdateArrayStrategy;
    /** The update extensible attributes strategy (MERGE by default) */
    updateExtensibleAttributesStrategy: IpamUpdateArrayStrategy;
}
declare var IpamUpdateRangeInfo: IpamUpdateRangeInfo & { new(): IpamUpdateRangeInfo; prototype: IpamUpdateRangeInfo };

/** Plug-in: Infoblox IPAM */
interface IpamViewManager {
    /** Adds network view */
    addNetworkView(networkView: IpamNetworkView): any;
    /** Find network views matching all the IPAM extensible attributes */
    findNetworkViewsByEA(extensibleAttributes: IpamSearchableExtensibleAttribute[]): IpamNetworkView[];
    /** Gets all network views */
    getAllNetworkViews(): IpamNetworkView[];
    /** Gets all DNS views */
    getAllDnsViews(): string[];
    /** Gets default network view */
    getDefaultNetworkView(): string;
    /** Gets default DNS view */
    getDefaultDnsView(): string;
    /** Gets list of DNS views for specified network view */
    getDnsViewsForNetworkView(networkView: string): string[];
    /** Gets the network view */
    getNetworkView(networkView: string): IpamNetworkView;
    /** Checks if DNS view is owned by network view */
    isDnsViewOwnedByNetworkView(dnsView: string, networkView: string): boolean;
    /** Removes network view */
    removeNetworkView(reference: string): any;
}
declare var IpamViewManager: IpamViewManager & { new(): IpamViewManager; prototype: IpamViewManager };

/** Plug-in: Infoblox IPAM */
interface IpamZoneManager {
    /** Gets DNS Auth Zone */
    getAuthZone(fqdn: string, networkView: string, dnsView: string): IpamAuthZone;
}
declare var IpamZoneManager: IpamZoneManager & { new(): IpamZoneManager; prototype: IpamZoneManager };

/** Plug-in: Infoblox IPAM */
interface ReferenceInfo {
    /** Reference to the fixed address */
    readonly reference: string;
    /** Reference to the fixed address */
    readonly wapiType: string;
    /** Reference to the fixed address */
    readonly refData: string;
    /** Reference to the fixed address */
    readonly description: string;
    /** (Static) Parses the reference to IPAM object */
    parse(reference: string): ReferenceInfo;
}
declare var ReferenceInfo: ReferenceInfo & { new(): ReferenceInfo; prototype: ReferenceInfo };

/** Plug-in: Infoblox IPAM */
interface TenantManager {
    /** Updates the name of a tenant object */
    updateTenantName(tenantId: string): any;
}
declare var TenantManager: TenantManager & { new(): TenantManager; prototype: TenantManager };
