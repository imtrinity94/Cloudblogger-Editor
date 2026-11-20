// Aria Automation or VM Apps (o11n-plugin-vra), generated from modernvroapi.in data. Do not edit.

/** Plug-in: Aria Automation or VM Apps */
interface VraBlockDevice {
    /** Email of the user that owns the entity. */
    owner: string;
    cloudAccountIdsExtension: string;
    linksExtension: string;
    /** The external zoneId of the resource. */
    externalZoneId: string;
    /** The external regionId of the resource. */
    externalRegionId: string;
    /** External entity Id on the provider side. */
    externalId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on this resource. */
    tags: any[];
    /** Capacity of the block device in GB. */
    capacityInGB: number;
    /** Set of ids of the cloud accounts this resource belongs to. */
    cloudAccountIds: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** The provisioning status of the resource. One of three provisioning statuses. `PROVISIONING`: The resource is being provisioned. `READY`: The resource is already provisioned. `SUSPEND`: The resource is being destroyed. */
    provisioningStatus: string;
    /** Deployment id that is associated with this resource. */
    deploymentId: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    tagsExtension: string;
    blockDeviceStatus: string;
    /** The id of this resource instance */
    id: string;
    /** Indicates whether the block device survives a delete action. */
    persistent: boolean;
    /** The id of the project this resource belongs to. */
    projectId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    customPropertiesExtension: string;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraBlockDevice;
    addTagsItem(tagsItem: VraTag): VraBlockDevice;
    addCloudAccountIdsItem(cloudAccountIdsItem: string): VraBlockDevice;
    putLinksItem(key: string, linksItem: VraHref): VraBlockDevice;
}
declare var VraBlockDevice: VraBlockDevice & { new(): VraBlockDevice; prototype: VraBlockDevice };

/**
 * State object representing a query result of block device.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraBlockDeviceResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraBlockDeviceResult: VraBlockDeviceResult & { new(): VraBlockDeviceResult; prototype: VraBlockDeviceResult };

/**
 * BlockDeviceSpecification
 * Plug-in: Aria Automation or VM Apps
 */
interface VraBlockDeviceSpecification {
    /** Capacity of the block device in GB. */
    capacityInGB: number;
    /** Reference to URI using which the block device has to be created. */
    sourceReference: string;
    /** Indicates whether the block device should be encrypted or not. */
    encrypted: boolean;
    /** The id of the deployment that is associated with this resource */
    deploymentId: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** Content of a disk, base64 encoded. */
    diskContentBase64: string;
    /** Indicates whether the block device survives a delete action. */
    persistent: boolean;
    /** Constraints that are used to drive placement policies for the block device that is produced from this specification. Constraint expressions are matched against tags on existing placement targets. */
    constraints: any[];
    /** The id of the project the current user belongs to. */
    projectId: string;
    /** A set of tag keys and optional values that should be set on any resource that is produced from this specification. */
    tags: any[];
    addConstraintsItem(constraintsItem: VraConstraint): VraBlockDeviceSpecification;
    addTagsItem(tagsItem: VraTag): VraBlockDeviceSpecification;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraBlockDeviceSpecification;
}
declare var VraBlockDeviceSpecification: VraBlockDeviceSpecification & { new(): VraBlockDeviceSpecification; prototype: VraBlockDeviceSpecification };

/**
 * Specification for a second day change security groups operation for a vsphere machine
 * Plug-in: Aria Automation or VM Apps
 */
interface VraChangeSecurityGroupSpecification {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** A set of network interface controller specifications for this machine. If not specified, then no reconfiguration will be performed. */
    networkInterfaceSpecifications: any[];
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** The id of this resource instance */
    id: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    addNetworkInterfaceSpecificationsItem(networkInterfaceSpecificationsItem: VraNetworkInterfaceSpecification): VraChangeSecurityGroupSpecification;
    putLinksItem(key: string, linksItem: VraHref): VraChangeSecurityGroupSpecification;
}
declare var VraChangeSecurityGroupSpecification: VraChangeSecurityGroupSpecification & { new(): VraChangeSecurityGroupSpecification; prototype: VraChangeSecurityGroupSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraCloudAccount {
    /** Email of the user that owns the entity. */
    owner: string;
    /** JSON String containing Links for the CloudAccount */
    linksExtension: string;
    /** Cloud account type */
    cloudAccountType: string;
    /** A human-friendly description. */
    description: string;
    /** JSON String containing a set of region names to enable provisioning on. */
    enabledRegionIdsExtension: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on the Cloud Account */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** A list of regions that are enabled for provisioning on this cloud account */
    enabledRegions: any[];
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** JSON String containing a set of tag keys and optional values that were set on the Cloud Account */
    tagsExtension: string;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** JSON String containing key value pair of properties that will be used */
    customPropertiesExtension: string;
    addEnabledRegionsItem(enabledRegionsItem: VraRegion): VraCloudAccount;
    putCloudAccountPropertiesItem(key: string, cloudAccountPropertiesItem: string): VraCloudAccount;
    putLinksItem(key: string, linksItem: VraHref): VraCloudAccount;
    addTagsItem(tagsItem: VraTag): VraCloudAccount;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraCloudAccount;
}
declare var VraCloudAccount: VraCloudAccount & { new(): VraCloudAccount; prototype: VraCloudAccount };

/** Plug-in: Aria Automation or VM Apps */
interface VraCloudAccountNsxT {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Host name for the NSX-T cloud account */
    hostName: string;
    /** Indicates whether NSX-T cloud account was created in Manager (legacy) mode. */
    managerMode: boolean;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on the Cloud Account */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** Identifier of a data collector vm deployed in the on premise infrastructure. */
    dcid: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** Indicates whether this is an NSX-T Global Manager cloud account. NSX-T global manager cloud account can be associated with NSX-T local manager cloud accounts. It cannot be associated with vSphere cloud accounts. Default value: false. */
    isGlobalManager: boolean;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** Username to authenticate with the cloud account */
    username: string;
    putLinksItem(key: string, linksItem: VraHref): VraCloudAccountNsxT;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraCloudAccountNsxT;
    addTagsItem(tagsItem: VraTag): VraCloudAccountNsxT;
}
declare var VraCloudAccountNsxT: VraCloudAccountNsxT & { new(): VraCloudAccountNsxT; prototype: VraCloudAccountNsxT };

/**
 * State object representing a query result of Nsx-T cloud accounts.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountNsxTResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraCloudAccountNsxTResult: VraCloudAccountNsxTResult & { new(): VraCloudAccountNsxTResult; prototype: VraCloudAccountNsxTResult };

/**
 * State object representing an Nsx-V cloud account.<br><br>A cloud account identifies a cloud account type and an account-specific deployment region or data center where the associated cloud account resources are hosted.<br>**HATEOAS** links:<br>**self** - CloudAccountNsxV - Self link to this cloud account
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountNsxV {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Host name for the Nsx-V cloud account */
    hostName: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on the Cloud Account */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** Identifier of a data collector vm deployed in the on premise infrastructure. */
    dcid: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** Username to authenticate with the cloud account */
    username: string;
    addTagsItem(tagsItem: VraTag): VraCloudAccountNsxV;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraCloudAccountNsxV;
    putLinksItem(key: string, linksItem: VraHref): VraCloudAccountNsxV;
}
declare var VraCloudAccountNsxV: VraCloudAccountNsxV & { new(): VraCloudAccountNsxV; prototype: VraCloudAccountNsxV };

/**
 * State object representing a query result of Nsx-V cloud accounts.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountNsxVResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraCloudAccountNsxVResult: VraCloudAccountNsxVResult & { new(): VraCloudAccountNsxVResult; prototype: VraCloudAccountNsxVResult };

/**
 * State object representing cloud account region.<br><br>**externalRegions** - array[RegionSpecification] - Set of regions that can be enabled for this cloud account.<br>**externalRegionIds** - array[String] - Set of ids of regions that can be enabled for this cloud account.<br>
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountRegions {
    /** A set of regions that can be enabled for this cloud account. */
    externalRegions: any[];
    addExternalRegionsItem(externalRegionsItem: VraRegionSpecification): VraCloudAccountRegions;
}
declare var VraCloudAccountRegions: VraCloudAccountRegions & { new(): VraCloudAccountRegions; prototype: VraCloudAccountRegions };

/**
 * State object representing a query result of cloud accounts.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraCloudAccountResult: VraCloudAccountResult & { new(): VraCloudAccountResult; prototype: VraCloudAccountResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraCloudAccountService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** Delete a vSphere Cloud Account with a given id */
    deleteVSphereCloudAccountById(cloudAccountVsphereId: string): void;
    /** Delete a vSphere Cloud Account with a given cloudAccountVsphere object */
    deleteVSphereCloudAccount(cloudAccountVsphere: VraCloudAccountVsphere): void;
    /** Create a vSphere cloud account */
    createVSphereCloudAccount(body: VraCloudAccountVsphereSpecification): VraCloudAccountVsphere;
    /** Create a vSphere cloud account in an asynchronous manner */
    createVSphereCloudAccountAsync(body: VraCloudAccountVsphereSpecification): VraRequestTracker;
    /** Update vSphere cloud account in an asynchronous manner */
    updateVSphereCloudAccountAsync(cloudAccountVsphere: VraCloudAccountVsphere, body: VraUpdateCloudAccountVsphereSpecification): VraRequestTracker;
    /** Update vSphere cloud account */
    updateVSphereCloudAccount(cloudAccountVsphere: VraCloudAccountVsphere, body: VraUpdateCloudAccountVsphereSpecification): VraCloudAccountVsphere;
}
declare var VraCloudAccountService: VraCloudAccountService & { new(): VraCloudAccountService; prototype: VraCloudAccountService };

/** Plug-in: Aria Automation or VM Apps */
interface VraCloudAccountVsphere {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Host name for the vSphere cloud account */
    hostName: string;
    /** JSON String containing Links for the CloudAccountVsphere */
    linksExtension: string;
    /** JSON String containing a set of region names to enable provisioning on. */
    enabledRegionIdsExtension: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on the Cloud Account */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** A list of regions that are enabled for provisioning on this cloud account */
    enabledRegions: any[];
    /** Identifier of a data collector vm deployed in the on premise infrastructure. */
    dcid: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** JSON String containing a set of tag keys and optional values that were set on the Cloud Account */
    tagsExtension: string;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** Username to authenticate with the cloud account */
    username: string;
    /** JSON String containing key value pair of properties that will be used */
    customPropertiesExtension: string;
    putLinksItem(key: string, linksItem: VraHref): VraCloudAccountVsphere;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraCloudAccountVsphere;
    addEnabledRegionsItem(enabledRegionsItem: VraRegion): VraCloudAccountVsphere;
    addTagsItem(tagsItem: VraTag): VraCloudAccountVsphere;
}
declare var VraCloudAccountVsphere: VraCloudAccountVsphere & { new(): VraCloudAccountVsphere; prototype: VraCloudAccountVsphere };

/**
 * Specification for a region enumeration of vshpere cloud account.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountVsphereRegionEnumerationSpecification {
    /** Accept self signed certificate when connecting to vSphere */
    acceptSelfSignedCertificate: boolean;
    /** Host name for the vSphere endpoint. Either provide hostName or provide a cloudAccountId of an existing account. */
    hostName: string;
    /** Password for the user used to authenticate with the cloud Account. Either provide password or provide a cloudAccountId of an existing account. */
    password: string;
    /** Identifier of a data collector vm deployed in the on premise infrastructure. Refer to the data-collector API to create or list data collectors. Note: Data collector endpoints are not available in VMware Aria Automation(on-prem) release. */
    dcid: string;
    /** Existing cloud account id. Either provide existing cloud account Id, or hostName, username, password. */
    cloudAccountId: string;
    /** Username to authenticate with the cloud account. Either provide username or provide a cloudAccountId of an existing account. */
    username: string;
}
declare var VraCloudAccountVsphereRegionEnumerationSpecification: VraCloudAccountVsphereRegionEnumerationSpecification & { new(): VraCloudAccountVsphereRegionEnumerationSpecification; prototype: VraCloudAccountVsphereRegionEnumerationSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraCloudAccountVsphereResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraCloudAccountVsphereResult: VraCloudAccountVsphereResult & { new(): VraCloudAccountVsphereResult; prototype: VraCloudAccountVsphereResult };

/**
 * Specification for a vSphere cloud account.<br><br>A cloud account identifies a cloud account type and an account-specific deployment region or data center where the associated cloud account resources are hosted.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraCloudAccountVsphereSpecification {
    /** Host name for the vSphere endpoint */
    hostName: string;
    /** Accept self signed certificate when connecting to vSphere */
    acceptSelfSignedCertificate: boolean;
    /** Create default cloud zones for the enabled regions. */
    createDefaultZones: boolean;
    /** Password for the user used to authenticate with the cloud Account */
    password: string;
    /** NSX-V or NSX-T account to associate with this vSphere cloud account. vSphere cloud account can be a single NSX-V cloud account or a single NSX-T cloud account. */
    associatedCloudAccountIds: any[];
    /** A set of regions to enable provisioning on.Refer to /iaas/api/cloud-accounts/region-enumeration. */
    regions: any[];
    /** Identifier of a data collector vm deployed in the on premise infrastructure. Refer to the data-collector API to create or list data collectors. Note: Data collector endpoints are not available in VMware Aria Automation(on-prem) release. */
    dcid: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** Username to authenticate with the cloud account */
    username: string;
    /** A set of tag keys and optional values to set on the Cloud Account */
    tags: any[];
    addRegionsItem(regionsItem: VraRegionSpecification): VraCloudAccountVsphereSpecification;
    addAssociatedCloudAccountIdsItem(associatedCloudAccountIdsItem: string): VraCloudAccountVsphereSpecification;
    addTagsItem(tagsItem: VraTag): VraCloudAccountVsphereSpecification;
}
declare var VraCloudAccountVsphereSpecification: VraCloudAccountVsphereSpecification & { new(): VraCloudAccountVsphereSpecification; prototype: VraCloudAccountVsphereSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraCloudZoneService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** This method deletes Zone based on given zoneId */
    deleteZoneById(zoneId: string): void;
    /** This method deletes Zone based on given zone. */
    deleteZone(zone: VraZone): void;
    /** This method updates the Zone based on zoneId & ZoneSpecification. */
    updateZone(id: string, body: VraZoneSpecification): VraZone;
    /** This method creates Zone based on ZoneSpecification details. */
    createZone(body: VraZoneSpecification): VraZone;
}
declare var VraCloudZoneService: VraCloudZoneService & { new(): VraCloudZoneService; prototype: VraCloudZoneService };

/**
 * A constraint that is conveyed to the policy engine.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraConstraint {
    /** An expression of the form \"[!]tag-key[:[tag-value]]\", used to indicate a constraint match on keys and values of tags. */
    expression: string;
    /** Indicates whether this constraint should be strictly enforced or not. */
    mandatory: boolean;
}
declare var VraConstraint: VraConstraint & { new(): VraConstraint; prototype: VraConstraint };

/** Plug-in: Aria Automation or VM Apps */
interface VraDataCollector {
    /** Data collector host name */
    hostName: string;
    /** Data collector identifier */
    dcId: string;
    readonly internalIdString: string;
    /** Ip Address of the data collector VM */
    ipAddress: string;
    host: VraHost;
    /** Data collector name */
    name: string;
    /** Current status of the data collector */
    status: string;
}
declare var VraDataCollector: VraDataCollector & { new(): VraDataCollector; prototype: VraDataCollector };

/**
 * State object representing a query result of data collectors.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraDataCollectorResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraDataCollectorResult: VraDataCollectorResult & { new(): VraDataCollectorResult; prototype: VraDataCollectorResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraDataCollectorService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
}
declare var VraDataCollectorService: VraDataCollectorService & { new(): VraDataCollectorService; prototype: VraDataCollectorService };

/** Plug-in: Aria Automation or VM Apps */
interface VraDiskAttachmentSpecification {
    /** The id of the existing block device */
    blockDeviceId: string;
    /** Deprecated: The SCSI controller to be assigned */
    scsiController: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** Deprecated: The Unit Number to be assigned */
    unitNumber: string;
    putDiskAttachmentPropertiesItem(key: string, diskAttachmentPropertiesItem: string): VraDiskAttachmentSpecification;
}
declare var VraDiskAttachmentSpecification: VraDiskAttachmentSpecification & { new(): VraDiskAttachmentSpecification; prototype: VraDiskAttachmentSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraDiskService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** Create a BlockDevice in Synchronous manner */
    createBlockDevice(blockDeviceSpecification: VraBlockDeviceSpecification): VraBlockDevice;
    /** Resize a BlockDevice in an asynchronous manner. */
    resizeBlockDevice(diskId: string, capacityInGB: number): VraRequestTracker;
    /** Delete a BlockDevice in an asynchronous manner. */
    deleteBlockDevice(diskId: string, purge: boolean, forceDelete: boolean): VraRequestTracker;
    /** Create a BlockDevice in an asynchronous manner */
    createBlockDeviceAsync(blockDeviceSpecification: VraBlockDeviceSpecification): VraRequestTracker;
    /** Create a BlockDevice Snapshot in an asynchronous manner. */
    createBlockDeviceSnapshot(diskId: string, diskSnapshotSpecification: VraDiskSnapshotSpecification): VraRequestTracker;
    /** Revert a BlockDevice Snapshot in an asynchronous manner. */
    revertBlockDeviceSnapshot(diskId: string, snapshotId: string): VraRequestTracker;
    /** Promote a BlockDevice in an asynchronous manner. Second day promote operation on disk. Applicable for vSphere Block Devices only */
    promoteBlockDevice(diskId: string): VraRequestTracker;
    /** Delete a BlockDevice Snapshot in an asynchronous manner. */
    deleteBlockDeviceSnapshot(diskId: string, snapshotId: string): VraRequestTracker;
}
declare var VraDiskService: VraDiskService & { new(): VraDiskService; prototype: VraDiskService };

/**
 * Represents a disk snapshot
 * Plug-in: Aria Automation or VM Apps
 */
interface VraDiskSnapshot {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    linksExtension: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    snapshotPropertiesExtension: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** A human-friendly description. */
    desc: string;
    /** A set of tag keys and optional values that have to be set on the snapshot in the cloud. Currently supported for Azure Snapshots */
    tags: any[];
    putLinksItem(key: string, linksItem: VraHref): VraDiskSnapshot;
    addTagsItem(tagsItem: VraTag): VraDiskSnapshot;
    putSnapshotPropertiesItem(key: string, snapshotPropertiesItem: string): VraDiskSnapshot;
}
declare var VraDiskSnapshot: VraDiskSnapshot & { new(): VraDiskSnapshot; prototype: VraDiskSnapshot };

/**
 * Specification for Disk Snapshot creation request.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraDiskSnapshotSpecification {
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** A set of tag keys and optional values that have to be set on the snapshot in the cloud. Currently supported for Azure Snapshots */
    tags: any[];
    putSnapshotPropertiesItem(key: string, snapshotPropertiesItem: string): VraDiskSnapshotSpecification;
    addTagsItem(tagsItem: VraTag): VraDiskSnapshotSpecification;
}
declare var VraDiskSnapshotSpecification: VraDiskSnapshotSpecification & { new(): VraDiskSnapshotSpecification; prototype: VraDiskSnapshotSpecification };

/**
 * VMware Aria Automation Entity finder to search for an entity
 * Plug-in: Aria Automation or VM Apps
 */
interface VraEntitiesFinder {
    /** Get all tags. */
    getTags(vRAHost: VraHost, filter: string): VraTag[];
    /** Get CloudZone for a given zone id. */
    getCloudZone(vRAHost: VraHost, zoneId: string): VraZone;
    /** Get all FabricNetwork for a given Host. */
    getFabricNetworks(vRAHost: VraHost, filter: string): VraFabricNetwork[];
    /** Get all CloudZones for the given Host. */
    getCloudZones(vRAHost: VraHost, filter: string): VraZone[];
    /** Get all FlavorProfile objects for a given Host. */
    getFlavorProfiles(vRAHost: VraHost): VraFlavorProfile[];
    /** Get StorageProfile by ID. */
    getStorageProfile(vRAHost: VraHost, id: string): VraStorageProfile;
    /** Get vSphere Cloud Account By Id. */
    getVsphereCloudAccount(vRAHost: VraHost, vsphereCloudAccountId: string): VraCloudAccountVsphere;
    /** Retrieves a project by id for the given Host. */
    getProject(vRAHost: VraHost, id: string): VraProject;
    /** Get FabricNetwork by ID. */
    getFabricNetwork(vRAHost: VraHost, id: string, select: string): VraFabricNetwork;
    /** Get project resource metadata by a given project id. */
    getProjectResourceMetadata(vRAHost: VraHost, id: string): VraProjectResourceMetadata;
    /** Get all Data Collectors/Cloud Proxies. */
    getDataCollectors(vRAHost: VraHost, isDisabledDataCollector: boolean): VraDataCollector[];
    /** Get all image mapping keys for a given Host. */
    getAllImageMapping(vRAHost: VraHost): string[];
    /** Get NSX-V Cloud Account by Id. */
    getNsxVCloudAccount(vRAHost: VraHost, id: string): VraCloudAccountNsxV;
    /** Get ImageProfile by ID. */
    getImageProfile(vRAHost: VraHost, id: string): VraImageProfile;
    /** Get all image reference keys for a given Host and Image. */
    getAllImageReferencesByImage(vRAHost: VraHost, image: string): string[];
    /** Get all RequestTracker objects. */
    getRequestTrackers(vRAHost: VraHost): VraRequestTracker[];
    /** Get all NSX-V Cloud Account. */
    getNsxVCloudAccounts(vRAHost: VraHost): VraCloudAccountNsxV[];
    /** Get vSphere Cloud Account Regions/DataCenter. */
    getVsphereCloudAccountRegions(vRAHost: VraHost, cloudAccountVsphereSpecification: VraCloudAccountVsphereSpecification): VraCloudAccountRegions;
    /** Get all BlockDevice/Disk snapshots for a given BlockDevice/Disk Id. */
    getBlockDeviceSnapshots(vRAHost: VraHost, blockDeviceId: string): VraDiskSnapshot[];
    /** Get all ImageProfile objects for a given Host. */
    getImageProfiles(vRAHost: VraHost): VraImageProfile[];
    /** Get Block Device/Disk Snapshot details for given Block Device Id. */
    getBlockDeviceSnapshot(vRAHost: VraHost, blockDeviceId: string, snapshotId: string): VraDiskSnapshot;
    /** Get Machine Snapshot details for given Machine ID and Snapshot ID. */
    getMachineSnapshot(vRAHost: VraHost, machineId: string, snapshotId: string): VraSnapshot;
    /** Get NetworkProfile by ID. */
    getNetworkProfile(vRAHost: VraHost, id: string): VraNetworkProfile;
    /** Get all Machine Disks for a given machine. */
    getMachineDisksByMachineId(vRAHost: VraHost, machineId: string): VraBlockDevice[];
    /** Get Available BlockDevices for a given Host. */
    getAvailableBlockDevices(vRAHost: VraHost, filter: string): VraBlockDevice[];
    /** Get all Networks. */
    getNetworks(vRAHost: VraHost): VraNetwork[];
    /** Get Machine Disk by ID for a specific machine. */
    getMachineDisk(vRAHost: VraHost, machineId: string, diskId: string): VraBlockDevice;
    /** Get tags by key. */
    getTagsByKey(vRAHost: VraHost, key: string, filter: string): VraTag[];
    /** Get all vSphere Cloud Accounts. */
    getVsphereCloudAccounts(vRAHost: VraHost): VraCloudAccountVsphere[];
    /** Get all flavor mapping keys for a given Host. */
    getAllFlavorMapping(vRAHost: VraHost): string[];
    /** Get Machine Network Interface details for given Machine ID and Network Interface ID. */
    getMachineNetworkInterface(vRAHost: VraHost, machineId: string, networkInterfaceId: string): VraNetworkInterface;
    /** Get machine by ID. */
    getMachine(vRAHost: VraHost, id: string, select: string): VraMachine;
    /** Get all Snapshots for a given Machine. */
    getMachineSnapshots(vRAHost: VraHost, machineId: string): VraSnapshot[];
    /** Get Cloud Account - Vsphere, NSXT, NXTV, AWS, Azure, GCP etc by ID. */
    getCloudAccount(vRAHost: VraHost, id: string, select: string): VraCloudAccount;
    /** Get all Machines for a given Host. */
    getMachines(vRAHost: VraHost, filter: string): VraMachine[];
    /** Get RequestTracker object for a given request id. */
    getRequestTracker(vRAHost: VraHost, requestTrackerId: string): VraRequestTracker;
    /** Get all NSX-T Cloud Account. */
    getNsxTCloudAccounts(vRAHost: VraHost): VraCloudAccountNsxT[];
    /** Get all projects with specified paging parameters for the given Host. */
    getProjects(vRAHost: VraHost, filter: string): VraProject[];
    /** Get all Network Interfaces for a given Machine. */
    getMachineNetworkInterfaces(vRAHost: VraHost, machineId: string): VraNetworkInterface[];
    /** Get NSX-T Cloud Account by Id. */
    getNsxTCloudAccount(vRAHost: VraHost, id: string): VraCloudAccountNsxT;
    /** Get CloudZone Region by given Zone. */
    getCloudZoneRegionByZone(vRAHost: VraHost, zone: VraZone): VraRegion;
    /** Get all NetworkProfile objects for a given Host. */
    getNetworkProfiles(vRAHost: VraHost): VraNetworkProfile[];
    /** Get CloudZone Region by given region Id. */
    getCloudZoneRegion(vRAHost: VraHost, regionId: string): VraRegion;
    /** Get Tag Object by String Key and value. */
    getTag(vRAHost: VraHost, key: string, value: string): VraTag;
    /** Get all StorageProfile objects for a given Host. */
    getStorageProfiles(vRAHost: VraHost): VraStorageProfile[];
    /** Get all Cloud zone Region. */
    getCloudZoneRegions(vRAHost: VraHost): VraRegion[];
    /** Get Data Collector/Cloud Proxy by Id. */
    getDataCollector(vRAHost: VraHost, dataCollectorId: string): VraDataCollector;
    /** Get all flavor references for a given Host and flavor. */
    getAllFlavorReferencesByFlavor(vRAHost: VraHost, flavor: string): string[];
    /** Get BlockDevice by ID. */
    getBlockDevice(vRAHost: VraHost, id: string): VraBlockDevice;
    /** Get all Cloud Accounts - Vsphere, NSXT, NXTV, AWS, Azure, GCP etc. */
    getCloudAccounts(vRAHost: VraHost, filter: string): VraCloudAccount[];
    /** Get all BlockDevice for a given Host. */
    getBlockDevices(vRAHost: VraHost, filter: string): VraBlockDevice[];
    /** Get FlavorProfile by ID. */
    getFlavorProfile(vRAHost: VraHost, id: string): VraFlavorProfile;
    /** Get Network for a given Network Id. */
    getNetwork(vRAHost: VraHost, networkId: string): VraNetwork;
}
declare var VraEntitiesFinder: VraEntitiesFinder & { new(): VraEntitiesFinder; prototype: VraEntitiesFinder };

/** Plug-in: Aria Automation or VM Apps */
interface VraFabricFlavor {
    /** Size of the boot disk (in megabytes). Not populated when inapplicable. */
    bootDiskSizeInMB: number;
    /** Total amount of memory (in megabytes). Not populated when inapplicable. */
    memoryInMB: number;
    /** The value of the instance type in the corresponding cloud. */
    name: string;
    /** The type of storage supported by this instance type. Not populated when inapplicable. */
    storageType: string;
    /** Number of data disks. Not populated when inapplicable. */
    dataDiskMaxCount: number;
    /** The internal identification used by the corresponding cloud end-point */
    id: string;
    /** Size of the data disks (in megabytes). Not populated when inapplicable. */
    dataDiskSizeInMB: number;
    /** The type of network supported by this instance type. Not populated when inapplicable. */
    networkType: string;
    /** Number of CPU cores. Not populated when inapplicable. */
    cpuCount: number;
}
declare var VraFabricFlavor: VraFabricFlavor & { new(): VraFabricFlavor; prototype: VraFabricFlavor };

/** Plug-in: Aria Automation or VM Apps */
interface VraFabricNetwork {
    /** Email of the user that owns the entity. */
    owner: string;
    cloudAccountIdsExtension: string;
    linksExtension: string;
    /** The id of the region for which this network is defined */
    externalRegionId: string;
    /** External entity Id on the provider side. */
    externalId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on this resource instance. */
    tags: any[];
    /** Set of ids of the cloud accounts this entity belongs to. */
    cloudAccountIds: any[];
    /** Network IPv6 CIDR to be used. */
    ipv6Cidr: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** Indicates whether this is the default subnet for the zone. */
    isDefault: boolean;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    tagsExtension: string;
    /** Indicates whether the sub-network supports public IP assignment. */
    isPublic: boolean;
    /** Network CIDR to be used. */
    cidr: string;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    customPropertiesExtension: string;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraFabricNetwork;
    addTagsItem(tagsItem: VraTag): VraFabricNetwork;
    addCloudAccountIdsItem(cloudAccountIdsItem: string): VraFabricNetwork;
    putLinksItem(key: string, linksItem: VraHref): VraFabricNetwork;
}
declare var VraFabricNetwork: VraFabricNetwork & { new(): VraFabricNetwork; prototype: VraFabricNetwork };

/**
 * State object representing a query result of fabric networks.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraFabricNetworkResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraFabricNetworkResult: VraFabricNetworkResult & { new(): VraFabricNetworkResult; prototype: VraFabricNetworkResult };

/**
 * Describes a flavor mapping between a global fabric flavor key and fabric flavor.<br>**HATEOAS** links:<br>**region** - Region - Region for the mapping.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraFlavorMapping {
    /** The id of the region for which this mapping is defined. */
    externalRegionId: string;
    putMappingItem(key: string, mappingItem: VraFabricFlavor): VraFlavorMapping;
    putLinksItem(key: string, linksItem: VraHref): VraFlavorMapping;
}
declare var VraFlavorMapping: VraFlavorMapping & { new(): VraFlavorMapping; prototype: VraFlavorMapping };

/** Plug-in: Aria Automation or VM Apps */
interface VraFlavorProfile {
    /** Email of the user that owns the entity. */
    owner: string;
    /** A list of the flavor mappings defined for the corresponding cloud end-point region */
    flavorMappings: VraFlavorMapping;
    linksExtension: string;
    /** The id of the region for which this profile is defined */
    externalRegionId: string;
    flavorMappingsExtension: string;
    readonly displayName: string;
    /** Id of the cloud account this flavor profile belongs to. */
    cloudAccountId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    putLinksItem(key: string, linksItem: VraHref): VraFlavorProfile;
}
declare var VraFlavorProfile: VraFlavorProfile & { new(): VraFlavorProfile; prototype: VraFlavorProfile };

/**
 * State object representing a query result of flavor profiles.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraFlavorProfileResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraFlavorProfileResult: VraFlavorProfileResult & { new(): VraFlavorProfileResult; prototype: VraFlavorProfileResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraFlavorProfileService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
}
declare var VraFlavorProfileService: VraFlavorProfileService & { new(): VraFlavorProfileService; prototype: VraFlavorProfileService };

/**
 * A generic VMware Aria Automation Rest client for executing REST operations
 * Plug-in: Aria Automation or VM Apps
 */
interface VraGenericRestClient {
    host: VraHost;
    /** Get Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    get(request: VraRestRequest): VraRestResponse;
    /** Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    execute(restRequest: VraRestRequest): VraRestResponse;
    /** Put Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    put(request: VraRestRequest): VraRestResponse;
    /** Delete Method (Http Delete) to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    delete(request: VraRestRequest): VraRestResponse;
    /** Post Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    post(request: VraRestRequest): VraRestResponse;
    /** Method to create HTTP rest Request. It holds parameter (HTTP Method (GET/PUT/POST/DELETE/PATCH), Resource Path URI, Request Payload (Stringified JSON)). */
    createRequest(method: string, path: string, requestPayload: string): VraRestRequest;
    /** Patch Method (Http Patch) to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    patch(request: VraRestRequest): VraRestResponse;
}
declare var VraGenericRestClient: VraGenericRestClient & { new(): VraGenericRestClient; prototype: VraGenericRestClient };

/**
 * VMware Aria Automation Host provides access to connection host properties & validation access.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraHost {
    /** DisplayName for the Connection Host. */
    readonly displayName: string;
    /** Host Connection Name */
    readonly name: string;
    /** Cloud Host URL for the Host Connection. */
    readonly cloudHost: string;
    /** Host Id. */
    readonly id: string;
    /** Host URL for the Automation Host Connection. */
    readonly vraHost: string;
    /** Session Mode of the Automation Host Connection (Shared Session or Per User Session). */
    readonly sessionMode: string;
    /** Connection type of the Automation Host Connection. */
    readonly connectionType: string;
    /** User associated with the Automation Host Connection (applicable for Shared Session Connections). */
    readonly user: string;
    createInfrastructureClient(): VraInfrastructureClient;
    /** Validates the Host Connection */
    validate(): boolean;
    /** Destroys the connection object */
    destroy(): void;
    /** Creates a generic REST client for Automation Host */
    createRestClient(): VraGenericRestClient;
}
declare var VraHost: VraHost & { new(): VraHost; prototype: VraHost };

/**
 * HostManager provides all the CRUD operations for VMware Aria Automation Plugin along with Generic Rest Client support.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraHostManager {
    /** Default Host Connection. */
    readonly defaultHostData: VraHost;
    /** Save Automation Host object. */
    save(props: any): string;
    /** Update Automation Host object. */
    update(props: any, host: VraHost): void;
    /** Creates a dynamic Automation Host. */
    createHost(properties: any): VraHost;
    /** Creates a temporary host with the current user host and credentials. */
    createHostForCurrentUser(): VraHost;
    /** Get All Automation Host by ConnectionType. */
    findHostsByType(connectionType: string): VraHost[];
    /** Delete Automation Host. */
    delete(host: VraHost): void;
    /** Validate Automation Host. */
    validate(host: VraHost): boolean;
    /** Get Automation Host by Sid. */
    getHostBySid(sid: string): VraHost;
}
declare var VraHostManager: VraHostManager & { new(): VraHostManager; prototype: VraHostManager };

/** Plug-in: Aria Automation or VM Apps */
interface VraHref {
    /** Get hrefs */
    hrefs: any[];
    /** Get href */
    href: string;
    addHrefsItem(hrefsItem: string): VraHref;
}
declare var VraHref: VraHref & { new(): VraHref; prototype: VraHref };

/**
 * Describes an image mapping between image key and fabric image.<br>**HATEOAS** links:<br>**region** - Region - Region for the mapping.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraImageMapping {
    /** The id of the region for which this mapping is defined. */
    externalRegionId: string;
    putLinksItem(key: string, linksItem: VraHref): VraImageMapping;
    putMappingItem(key: string, mappingItem: VraImageMappingDescription): VraImageMapping;
}
declare var VraImageMapping: VraImageMapping & { new(): VraImageMapping; prototype: VraImageMapping };

/** Plug-in: Aria Automation or VM Apps */
interface VraImageMappingDescription {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Cloud config for this image. This cloud config will be merged during provisioning with other cloud configurations such as the bootConfig provided in MachineSpecification. */
    cloudConfig: string;
    /** Operating System family of the image. */
    osFamily: string;
    /** The regionId of the image */
    externalRegionId: string;
    /** A human-friendly description. */
    description: string;
    /** External entity Id on the provider side. */
    externalId: string;
    /** Indicates whether this fabric image is private. For vSphere, private images are considered to be templates and snapshots and public are Content Library Items */
    isPrivate: boolean;
    /** Constraints that are used to drive placement policies for the image that is produced from this mapping.Constraint expressions are matched against tags on existing placement targets. */
    constraints: any[];
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Set of ids of the cloud accounts this entity belongs to. */
    cloudAccountIds: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    addConstraintsItem(constraintsItem: VraConstraint): VraImageMappingDescription;
    putLinksItem(key: string, linksItem: VraHref): VraImageMappingDescription;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraImageMappingDescription;
    addCloudAccountIdsItem(cloudAccountIdsItem: string): VraImageMappingDescription;
}
declare var VraImageMappingDescription: VraImageMappingDescription & { new(): VraImageMappingDescription; prototype: VraImageMappingDescription };

/**
 * Represents a structure that holds a list of image mappings defined for the particular region.<br>**HATEOAS** links:<br>**region** - Region - Region for the profile.<br>**self** - ImageProfile - Self link to this image profile
 * Plug-in: Aria Automation or VM Apps
 */
interface VraImageProfile {
    /** Email of the user that owns the entity. */
    owner: string;
    linksExtension: string;
    /** The id of the region for which this profile is defined */
    externalRegionId: string;
    /** A list of the image mappings defined for the particular region */
    imageMappings: VraImageMapping;
    readonly displayName: string;
    /** Id of the cloud account this image profile belongs to. */
    cloudAccountId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    imageMappingsExtension: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    putLinksItem(key: string, linksItem: VraHref): VraImageProfile;
}
declare var VraImageProfile: VraImageProfile & { new(): VraImageProfile; prototype: VraImageProfile };

/**
 * State object representing a query result of image profiles.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraImageProfileResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraImageProfileResult: VraImageProfileResult & { new(): VraImageProfileResult; prototype: VraImageProfileResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraImageProfileService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
}
declare var VraImageProfileService: VraImageProfileService & { new(): VraImageProfileService; prototype: VraImageProfileService };

/** Plug-in: Aria Automation or VM Apps */
interface VraInfrastructure {
    readonly displayName: string;
    name: string;
}
declare var VraInfrastructure: VraInfrastructure & { new(): VraInfrastructure; prototype: VraInfrastructure };

/** Plug-in: Aria Automation or VM Apps */
interface VraInfrastructureClient {
    /** Create Data Collector service to invoke APIs. */
    createDataCollectorService(): VraDataCollectorService;
    /** Create a Request service to invoke APIs. */
    createRequestService(): VraRequestService;
    /** Create Cloud Zone service to invoke APIs. */
    createCloudZoneService(): VraCloudZoneService;
    /** Create a Cloud Account service to invoke APIs. */
    createCloudAccountService(): VraCloudAccountService;
    /** Create a Network service to invoke APIs. */
    createNetworkService(): VraNetworkService;
    /** Create a FlavorProfile service to invoke APIs. */
    createFlavorProfileService(): VraFlavorProfileService;
    /** Create a StorageProfile service to invoke APIs. */
    createStorageProfileService(): VraStorageProfileService;
    /** Create Tags service to invoke APIs. */
    createTagsService(): VraTagsService;
    /** Create a Disk service to invoke APIs. */
    createDiskService(): VraDiskService;
    /** Create a Machine service to invoke APIs. */
    createMachineService(): VraMachineService;
    /** Create a Project service to invoke APIs. */
    createProjectService(): VraProjectService;
    /** Create a NetworkProfile service to invoke APIs. */
    createNetworkProfileService(): VraNetworkProfileService;
    /** Create a ImageProfile service to invoke APIs. */
    createImageProfileService(): VraImageProfileService;
}
declare var VraInfrastructureClient: VraInfrastructureClient & { new(genericRestClient: VraGenericRestClient): VraInfrastructureClient; prototype: VraInfrastructureClient };

/**
 * Represents a cloud agnostic machine.<br>**HATEOAS** links:<br>**operations** - array[String] - Supported operations for the machine.<br>**network-interfaces** - array[NetworkInterface] - Network interfaces for the machine.<br>**disks** - array[MachineDisk] - disks for the machine.<br>**deployment** - Deployment - Deployment that this machine is part of.<br>**cloud-accounts** - array[CloudAccount] - Cloud accounts where this machine is provisioned.<br>**self** - Machine - Self link to this machine
 * Plug-in: Aria Automation or VM Apps
 */
interface VraMachine {
    /** The external zoneId of the resource. */
    externalZoneId: string;
    /** The external regionId of the resource. */
    externalRegionId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Set of ids of the cloud accounts this resource belongs to. */
    cloudAccountIds: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** Hostname associated with this machine instance. */
    hostname: string;
    /** The provisioning status of the resource. One of three provisioning statuses. `PROVISIONING`: The resource is being provisioned. `READY`: The resource is already provisioned. `SUSPEND`: The resource is being destroyed. */
    provisioningStatus: string;
    /** Deployment id that is associated with this resource. */
    deploymentId: string;
    readonly internalIdString: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** Email of the user that owns the entity. */
    owner: string;
    /** JSON String containing a list of Cloud account ids. */
    cloudAccountIdsExtension: string;
    /** JSON String containing Links for the Machines */
    linksExtension: string;
    /** Primary address allocated or in use by this machine. The actual type of the address depends on the adapter type. Typically it is either the public or the external IP address. */
    address: string;
    /** External entity Id on the provider side. */
    externalId: string;
    /** A set of tag keys and optional values that were set on this resource. */
    tags: any[];
    /** Salt configuration on the machine */
    saltConfiguration: VraSaltConfiguration;
    /** The cloud config data in json-escaped yaml syntax */
    bootConfig: VraMachineBootConfig;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** Power state of machine. */
    machinePowerState: string;
    /** JSON String containing a set of tag keys and optional values that were set on the Machine */
    tagsExtension: string;
    /** The id of the project this resource belongs to. */
    projectId: string;
    /** JSON String containing key value pair of properties that will be used */
    customPropertiesExtension: string;
    putLinksItem(key: string, linksItem: VraHref): VraMachine;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraMachine;
    addTagsItem(tagsItem: VraTag): VraMachine;
    addCloudAccountIdsItem(cloudAccountIdsItem: string): VraMachine;
}
declare var VraMachine: VraMachine & { new(): VraMachine; prototype: VraMachine };

/**
 * Machine boot config that will be passed to the instance that can be used to perform common automated configuration tasks and even run scripts after the instance starts.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraMachineBootConfig {
    /** A valid cloud config data in json-escaped yaml syntax */
    content: string;
}
declare var VraMachineBootConfig: VraMachineBootConfig & { new(): VraMachineBootConfig; prototype: VraMachineBootConfig };

/** Plug-in: Aria Automation or VM Apps */
interface VraMachineBootConfigSettings {
    /** A phone_home module will be added to the Cloud Config and the provisioning will wait on a callback prior proceeding */
    phoneHomeShouldWait: boolean;
    /** In case a timeout occurs whether the provisioning process should fail or continue. */
    phoneHomeFailOnTimeout: boolean;
    /** The period of time to wait for the phone_home module callback to occur */
    phoneHomeTimeoutSeconds: number;
}
declare var VraMachineBootConfigSettings: VraMachineBootConfigSettings & { new(): VraMachineBootConfigSettings; prototype: VraMachineBootConfigSettings };

/** Plug-in: Aria Automation or VM Apps */
interface VraMachineResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraMachineResult: VraMachineResult & { new(): VraMachineResult; prototype: VraMachineResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraMachineService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** Create a Machine in Synchronous manner */
    createMachine(machineSpecification: VraMachineSpecification): VraMachine;
    /** Shutdown a Machine */
    shutDown(id: string): VraRequestTracker;
    /** Delete a Machine in an asynchronous manner */
    deleteMachine(machine: VraMachine, forceDelete: boolean): VraRequestTracker;
    /** Resets a Machine */
    reset(id: string): VraRequestTracker;
    /** Resize a Machine. */
    resize(id: string, name: string, cpuCount: string, memoryInMB: string, coreCount: string, rebootMachine: boolean): VraRequestTracker;
    /** Reboot a Machine */
    reboot(id: string): VraRequestTracker;
    /** Power-on a Machine */
    powerOn(id: string): VraRequestTracker;
    /** Revert Machine Snapshot. */
    revertMachineSnapshot(machineId: string, snapshotId: string): VraRequestTracker;
    /** Power-off a Machine */
    powerOff(id: string): VraRequestTracker;
    /** Create a Machine in an asynchronous manner */
    createMachineAsync(machineSpecification: VraMachineSpecification): VraRequestTracker;
    /** Create Machine Snapshot. */
    createMachineSnapshot(machineId: string, snapshotSpecification: VraSnapshotSpecification): VraRequestTracker;
    /** Update a Machine */
    updateMachine(machine: VraMachine, updateMachineSpecification: VraUpdateMachineSpecification): VraMachine;
    /** Detach Disk from machine */
    detachMachineDisk(machineId: string, diskId: string): VraRequestTracker;
    /** Attach machine disk to a machine. */
    attachMachineDisk(attachmentSpecification: VraDiskAttachmentSpecification, machineId: string): VraRequestTracker;
    /** Delete Machine Snapshot. */
    deleteMachineSnapshot(machineId: string, snapshotId: string): VraRequestTracker;
}
declare var VraMachineService: VraMachineService & { new(): VraMachineService; prototype: VraMachineService };

/** Plug-in: Aria Automation or VM Apps */
interface VraMachinesFolder {
    name: string;
}
declare var VraMachinesFolder: VraMachinesFolder & { new(): VraMachinesFolder; prototype: VraMachinesFolder };

/** Plug-in: Aria Automation or VM Apps */
interface VraMachineSpecification {
    /** Type of image used for this machine. */
    image: string;
    /** A set of disk specifications for this machine. */
    disks: any[];
    /** Constraints that are used to drive placement policies for the image disk. Constraint expressions are matched against tags on existing placement targets. */
    imageDiskConstraints: any[];
    /** Describes machine within the scope of your organization and is not propagated to the cloud */
    description: string;
    /** Constraints that are used to drive placement policies for the virtual machine that is produced from this specification. Constraint expressions are matched against tags on existing placement targets. */
    constraints: any[];
    /** Number of machines to provision - default 1. */
    machineCount: number;
    /** A set of tag keys and optional values that should be set on any resource that is produced from this specification. */
    tags: any[];
    /** Flavor of machine instance. */
    flavor: string;
    /** Settings to apply salt configuration on the provisioned machine. */
    saltConfiguration: VraSaltConfiguration;
    /** A set of settings that specify how the provided Boot Config should be handled */
    bootConfigSettings: VraMachineBootConfigSettings;
    /** The id of the deployment that is associated with this resource */
    deploymentId: string;
    /** A valid cloud config data in json-escaped yaml syntax */
    bootConfig: VraMachineBootConfig;
    /** A set of network interface controller specifications for this machine. If not specified, then a default network connection will be created. */
    nics: any[];
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** Provider specific flavor reference. Valid if no flavor property is provided */
    flavorRef: string;
    /** Settings to remotely connect to the provisioned machine, by public/private key pair or username/password authentication. AWS and vSphere support key pair. Azure supports key pair or username/password. */
    remoteAccess: VraRemoteAccessSpecification;
    /** Direct image reference used for this machine (name, path, location, uri, etc.). Valid if no image property is provided */
    imageRef: string;
    /** The id of the project the current user belongs to. */
    projectId: string;
    addNicsItem(nicsItem: VraNetworkInterfaceSpecification): VraMachineSpecification;
    addImageDiskConstraintsItem(imageDiskConstraintsItem: VraConstraint): VraMachineSpecification;
    addConstraintsItem(constraintsItem: VraConstraint): VraMachineSpecification;
    addTagsItem(tagsItem: VraTag): VraMachineSpecification;
    addDisksItem(disksItem: VraDiskAttachmentSpecification): VraMachineSpecification;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraMachineSpecification;
}
declare var VraMachineSpecification: VraMachineSpecification & { new(): VraMachineSpecification; prototype: VraMachineSpecification };

/**
 * The network object is an opaque reference to a logical network that network interfaces are attached to.<br> Based on settings specified by your cloud administrator, it may be a reference to an existing network, or be backed by an on-demand network created for isolation, or a security group that will be attached to machines as part of provisioning.<br> Networks are a limited resource, when it is not needed it should be deleted.<br>**HATEOAS** links:<br>**self** - Network - Self link to this network
 * Plug-in: Aria Automation or VM Apps
 */
interface VraNetwork {
    /** Email of the user that owns the entity. */
    owner: string;
    cloudAccountIdsExtension: string;
    linksExtension: string;
    /** The external zoneId of the resource. */
    externalZoneId: string;
    /** The external regionId of the resource. */
    externalRegionId: string;
    /** External entity Id on the provider side. */
    externalId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on this resource. */
    tags: any[];
    /** Set of ids of the cloud accounts this resource belongs to. */
    cloudAccountIds: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** The provisioning status of the resource. One of three provisioning statuses. `PROVISIONING`: The resource is being provisioned. `READY`: The resource is already provisioned. `SUSPEND`: The resource is being destroyed. */
    provisioningStatus: string;
    /** Deployment id that is associated with this resource. */
    deploymentId: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    tagsExtension: string;
    /** IPv4 address range of the network in CIDR format */
    cidr: string;
    /** The id of this resource instance */
    id: string;
    /** The id of the project this resource belongs to. */
    projectId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    customPropertiesExtension: string;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraNetwork;
    putLinksItem(key: string, linksItem: VraHref): VraNetwork;
    addCloudAccountIdsItem(cloudAccountIdsItem: string): VraNetwork;
    addTagsItem(tagsItem: VraTag): VraNetwork;
}
declare var VraNetwork: VraNetwork & { new(): VraNetwork; prototype: VraNetwork };

/** Plug-in: Aria Automation or VM Apps */
interface VraNetworkInterface {
    /** Email of the user that owns the entity. */
    owner: string;
    /** A list of IP addresses allocated or in use by this network interface. */
    addresses: any[];
    /** The external regionId of the network interface. */
    externalRegionId: string;
    /** External entity Id on the provider side. */
    externalId: string;
    /** A human-friendly description. */
    description: string;
    /** The device index of this network interface. */
    deviceIndex: number;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on this network interface. */
    tags: any[];
    /** Set of ids of the cloud accounts this entity belongs to. */
    cloudAccountIds: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** A list of security group ids this network interface is associated with */
    securityGroupIds: any[];
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    addTagsItem(tagsItem: VraTag): VraNetworkInterface;
    addAddressesItem(addressesItem: string): VraNetworkInterface;
    addCloudAccountIdsItem(cloudAccountIdsItem: string): VraNetworkInterface;
    putLinksItem(key: string, linksItem: VraHref): VraNetworkInterface;
    addSecurityGroupIdsItem(securityGroupIdsItem: string): VraNetworkInterface;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraNetworkInterface;
}
declare var VraNetworkInterface: VraNetworkInterface & { new(): VraNetworkInterface; prototype: VraNetworkInterface };

/** Plug-in: Aria Automation or VM Apps */
interface VraNetworkInterfaceSpecification {
    /** A list of IP addresses allocated or in use by this network interface. */
    addresses: any[];
    /** MAC address of the network interface. */
    macAddress: string;
    /** A list of security group ids which this network interface will be assigned to. */
    securityGroupIds: any[];
    /** Id of the fabric network for the network interface. Either networkId or fabricNetworkId can be specified, not both. */
    fabricNetworkId: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** Id of the network for the network interface. Either networkId or fabricNetworkId can be specified, not both. */
    networkId: string;
    /** The device index of this network interface. */
    deviceIndex: number;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraNetworkInterfaceSpecification;
    addSecurityGroupIdsItem(securityGroupIdsItem: string): VraNetworkInterfaceSpecification;
    addAddressesItem(addressesItem: string): VraNetworkInterfaceSpecification;
}
declare var VraNetworkInterfaceSpecification: VraNetworkInterfaceSpecification & { new(): VraNetworkInterfaceSpecification; prototype: VraNetworkInterfaceSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraNetworkProfile {
    /** Email of the user that owns the entity. */
    owner: string;
    linksExtension: string;
    /** The id of the region for which this profile is defined */
    externalRegionId: string;
    /** Id of the cloud account this profile belongs to. */
    cloudAccountId: string;
    /** A human-friendly description. */
    description: string;
    /** CIDR of the isolation network domain. */
    isolationNetworkDomainCIDR: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on this Network Profile. */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    tagsExtension: string;
    /** The id of this resource instance */
    id: string;
    /** The CIDR prefix length to be used for the isolated networks that are created with the network profile. */
    isolatedNetworkCIDRPrefix: number;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    customPropertiesExtension: string;
    addTagsItem(tagsItem: VraTag): VraNetworkProfile;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraNetworkProfile;
    putLinksItem(key: string, linksItem: VraHref): VraNetworkProfile;
}
declare var VraNetworkProfile: VraNetworkProfile & { new(): VraNetworkProfile; prototype: VraNetworkProfile };

/**
 * State object representing a query result of network profiles.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraNetworkProfileResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraNetworkProfileResult: VraNetworkProfileResult & { new(): VraNetworkProfileResult; prototype: VraNetworkProfileResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraNetworkProfileService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
}
declare var VraNetworkProfileService: VraNetworkProfileService & { new(): VraNetworkProfileService; prototype: VraNetworkProfileService };

/** Plug-in: Aria Automation or VM Apps */
interface VraNetworkService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** Delete a network in an asynchronous manner. */
    deleteNetwork(networkId: string, forceDelete: boolean): VraRequestTracker;
    /** Create a network Provision a new network based on the passed in constraints. The network should be destroyed after the machine is destroyed to free up resources. */
    createNetwork(networkSpecification: VraNetworkSpecification): VraRequestTracker;
}
declare var VraNetworkService: VraNetworkService & { new(): VraNetworkService; prototype: VraNetworkService };

/**
 * Specification for a cloud network
 * Plug-in: Aria Automation or VM Apps
 */
interface VraNetworkSpecification {
    /** The id of the deployment that is associated with this resource */
    deploymentId: string;
    /** Flag to indicate if the network needs to have outbound access or not. Default is true. This field will be ignored if there is proper input for networkType customProperty */
    outboundAccess: boolean;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** Flag to indicate if the network creation should create a gateway. Default is true. */
    createGateway: boolean;
    /** Constraints that are used to drive placement policies for the network that is produced from this specification, related with the network profile. Constraint expressions are matched against tags on existing placement targets. */
    constraints: any[];
    /** The id of the project the current user belongs to. */
    projectId: string;
    /** A set of tag keys and optional values that should be set on any resource that is produced from this specification. */
    tags: any[];
    addConstraintsItem(constraintsItem: VraConstraint): VraNetworkSpecification;
    addTagsItem(tagsItem: VraTag): VraNetworkSpecification;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraNetworkSpecification;
}
declare var VraNetworkSpecification: VraNetworkSpecification & { new(): VraNetworkSpecification; prototype: VraNetworkSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraProject {
    /** Email of the user that owns the entity. */
    owner: string;
    /** JSON String containing List of viewer users associated with the project. */
    viewersExtension: string;
    /** JSON String containing Links for the Project */
    linksExtension: string;
    /** JSON String containing List of storage, network and extensibility constraints to be applied when provisioning through this project. */
    constraintsExtension: string;
    /** JSON String containing List of Cloud Zones assigned to this project. You can limit deployment to a single region or allow multi-region placement by adding more than one cloud zone to a project. A cloud zone lists available resources. Use tags on resources to control workload placement. */
    zonesExtension: string;
    /** The timeout that should be used for Blueprint operations and Provisioning tasks. The timeout is in seconds */
    operationTimeout: number;
    /** A human-friendly description. */
    description: string;
    /** List of Cloud Zones assigned to this project. You can limit deployment to a single region or allow multi-region placement by adding more than one cloud zone to a project. A cloud zone lists available resources. Use tags on resources to control workload placement. */
    zones: any[];
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** JSON String containing List of member users associated with the project. */
    memberExtension: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** List of viewer users associated with the project. */
    viewers: any[];
    /** The naming template to be used for machines provisioned in this project */
    machineNamingTemplate: string;
    /** Specifies whether the resources in this projects are shared or not. */
    sharedResources: boolean;
    /** List of member users associated with the project. */
    members: any[];
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** Placement policy for the project. Determines how a zone will be selected for provisioning. DEFAULT or SPREAD. */
    placementPolicy: string;
    /** The id of this resource instance */
    id: string;
    /** JSON String containing List of administrator users associated with the project. Only administrators can manage project's configuration. */
    administratorsExtension: string;
    /** List of administrator users associated with the project. Only administrators can manage project's configuration. */
    administrators: any[];
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** JSON String containing the project custom properties which are added to all requests in this project */
    customPropertiesExtension: string;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraProject;
    addMembersItem(membersItem: VraUser): VraProject;
    addViewersItem(viewersItem: VraUser): VraProject;
    addZonesItem(zonesItem: VraZoneAssignment): VraProject;
    addAdministratorsItem(administratorsItem: VraUser): VraProject;
    putLinksItem(key: string, linksItem: VraHref): VraProject;
    putConstraintsItem(key: string, constraintsItem: VraConstraint[]): VraProject;
}
declare var VraProject: VraProject & { new(): VraProject; prototype: VraProject };

/**
 * Represents the resource metadata associated with a project
 * Plug-in: Aria Automation or VM Apps
 */
interface VraProjectResourceMetadata {
    readonly internalIdString: string;
    host: VraHost;
    /** A list of keys and optional values to be applied to compute resources provisioned in a project */
    tags: any[];
    addTagsItem(tagsItem: VraTag): VraProjectResourceMetadata;
}
declare var VraProjectResourceMetadata: VraProjectResourceMetadata & { new(): VraProjectResourceMetadata; prototype: VraProjectResourceMetadata };

/** Plug-in: Aria Automation or VM Apps */
interface VraProjectResourceMetadataSpecification {
    /** A list of keys and optional values to be applied to compute resources provisioned in a project */
    tags: any[];
    addTagsItem(tagsItem: VraTag): VraProjectResourceMetadataSpecification;
}
declare var VraProjectResourceMetadataSpecification: VraProjectResourceMetadataSpecification & { new(): VraProjectResourceMetadataSpecification; prototype: VraProjectResourceMetadataSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraProjectResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraProjectResult: VraProjectResult & { new(): VraProjectResult; prototype: VraProjectResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraProjectService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** Update project resource metadata by a given project id. */
    updateProjectResourceMetadata(id: string, projectResourceMetadataSpecification: VraProjectResourceMetadataSpecification): VraProject;
    /** Updates a project by id. */
    updateProject(id: string, projectSpecification: VraProjectSpecification): VraProject;
    /** Deletes a project with a given Project object. */
    deleteProject(project: VraProject): void;
    /** Creates a project. */
    createProject(request: VraProjectSpecification): VraProject;
    /** Deletes a project with a given id. */
    deleteProjectById(id: string): void;
}
declare var VraProjectService: VraProjectService & { new(): VraProjectService; prototype: VraProjectService };

/**
 * Represents a specification for a project.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraProjectSpecification {
    /** List of viewer users associated with the project. */
    viewers: any[];
    /** The naming template to be used for machines provisioned in this project */
    machineNamingTemplate: string;
    /** Specifies whether the resources in this projects are shared or not. If not set default will be used. */
    sharedResources: boolean;
    /** The timeout that should be used for Blueprint operations and Provisioning tasks. The timeout is in seconds */
    operationTimeout: number;
    /** List of member users associated with the project. */
    members: any[];
    /** List of configurations for zone assignment to a project. */
    zoneAssignmentConfigurations: any[];
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** Placement policy for the project. Determines how a zone will be selected for provisioning. DEFAULT or SPREAD. */
    placementPolicy: string;
    /** A human-friendly description. */
    description: string;
    /** List of administrator users associated with the project. Only administrators can manage project's configuration. */
    administrators: any[];
    putConstraintsItem(key: string, constraintsItem: VraConstraint[]): VraProjectSpecification;
    addZoneAssignmentConfigurationsItem(zoneAssignmentConfigurationsItem: VraZoneAssignmentSpecification): VraProjectSpecification;
    addMembersItem(membersItem: VraUser): VraProjectSpecification;
    addViewersItem(viewersItem: VraUser): VraProjectSpecification;
    addAdministratorsItem(administratorsItem: VraUser): VraProjectSpecification;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraProjectSpecification;
}
declare var VraProjectSpecification: VraProjectSpecification & { new(): VraProjectSpecification; prototype: VraProjectSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraRegion {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** Unique identifier of region on the provider side. */
    externalRegionId: string;
    readonly internalIdString: string;
    /** The id of the cloud account this region belongs to. */
    cloudAccountId: string;
    /** Name of region on the provider side. In vSphere, the name of the region is different from its id. */
    name: string;
    host: VraHost;
    /** The id of this resource instance */
    id: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    putLinksItem(key: string, linksItem: VraHref): VraRegion;
}
declare var VraRegion: VraRegion & { new(): VraRegion; prototype: VraRegion };

/**
 * State object representing a query result of regions.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraRegionResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraRegionResult: VraRegionResult & { new(): VraRegionResult; prototype: VraRegionResult };

/**
 * Specification for a region in a cloud account.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraRegionSpecification {
    /** Unique identifier of region on the provider side. */
    externalRegionId: string;
    /** Name of region on the provider side. In vSphere, the name of the region is different from its id. */
    name: string;
}
declare var VraRegionSpecification: VraRegionSpecification & { new(): VraRegionSpecification; prototype: VraRegionSpecification };

/**
 * Represents a specification for machine's remote access settings.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraRemoteAccessSpecification {
    /** Remote access password for the Azure machine. */
    password: string;
    /** In key pair authentication, the public key on the provisioned machine. Users are expected to log in with their private key and a default username from the cloud provider. An AWS Ubuntu image comes with default user ubuntu, and Azure comes with default user azureuser. To log in by SSH: `ssh -i <private-key-path> ubuntu@52.90.80.153` `ssh -i <private-key-path> azureuser@40.76.14.255` */
    sshKey: string;
    /** Key Pair Name. */
    keyPair: string;
    /** One of four authentication types. `generatedPublicPrivateKey`: The provisioned machine generates the public/private key pair and enables SSH to use them without user input. `publicPrivateKey`: The user enters the private key in the SSH command. See remoteAccess.sshKey. `usernamePassword`: The user enters a username and password for remote access. `keyPairName`: The user enters an already existing keyPair name. See remoteAccess.keyPair */
    authentication: string;
    /** Remote access username for the Azure machine. */
    username: string;
}
declare var VraRemoteAccessSpecification: VraRemoteAccessSpecification & { new(): VraRemoteAccessSpecification; prototype: VraRemoteAccessSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraRequestService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
    /** Awaits successfully completed RequestTracker Response. */
    awaitRequestTrackerResponse(requestTracker: VraRequestTracker): VraRequestTracker;
    /** Delete a request tracker object for a given request id. */
    deleteRequestTracker(requestTrackerId: string): void;
}
declare var VraRequestService: VraRequestService & { new(): VraRequestService; prototype: VraRequestService };

/**
 * An object used to track long-running operations.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraRequestTracker {
    /** ID of the deployment, this request is connected to. */
    deploymentId: string;
    readonly internalIdString: string;
    /** Name of the operation. */
    name: string;
    host: VraHost;
    /** Collection of resources. */
    resources: any[];
    /** Progress of the request as percentage. */
    progress: number;
    /** ID of this request. */
    id: string;
    /** Status of the request. */
    requestTrackerStatus: string;
    /** Status message of the request. */
    message: string;
    /** Self link of this request. */
    selfLink: string;
    addResourcesItem(resourcesItem: string): VraRequestTracker;
}
declare var VraRequestTracker: VraRequestTracker & { new(): VraRequestTracker; prototype: VraRequestTracker };

/**
 * State object representing a query result of request tracker objects.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraRequestTrackerResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    readonly internalIdString: string;
    host: VraHost;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraRequestTrackerResult: VraRequestTrackerResult & { new(): VraRequestTrackerResult; prototype: VraRequestTrackerResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraRestRequest {
    /** Path parameter for the Request URL. */
    path: string;
    /** HTTP Method type for the Request URL. */
    method: string;
    /** Request Payload for the Http Request. */
    payload: string;
    /** Sets Headers to the Http Request Object. */
    setHeader(key: string, value: string): void;
    /** Gets Http Header value for the key from the Http Request. */
    getHeader(header: string): string;
}
declare var VraRestRequest: VraRestRequest & { new(): VraRestRequest; prototype: VraRestRequest };

/**
 * Utility class used for VMware Aria Automation API server response.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraRestResponse {
    /** The Server's response body as string. */
    readonly contentAsString: string;
    /** Retrieves the server's response headers as a Properties object. */
    readonly allHeaders: Properties;
    /** The Server's response content length. */
    readonly contentLength: number;
    /** The Server's response status message. */
    readonly statusMessage: string;
    /** The Server's response status code. */
    readonly statusCode: number;
    /** Retrieves the server's response header values per header with specific name. */
    getHeaderValues(headerName: string): string[];
}
declare var VraRestResponse: VraRestResponse & { new(): VraRestResponse; prototype: VraRestResponse };

/** Plug-in: Aria Automation or VM Apps */
interface VraSaltConfiguration {
    /** Salt minion installer file name on the master. */
    installerFileName: string;
    /** Salt master id to which the Salt minion will be connected to. */
    masterId: string;
    /** Salt environment to use when running state files. */
    saltEnvironment: string;
    /** Pillar environment to use when running state files. */
    pillarEnvironment: string;
    /** List of state files to run on the deployed minion. */
    stateFiles: any[];
    /** Salt minion ID to be assigned to the deployed minion. */
    minionId: string;
    putAdditionalAuthParamsItem(key: string, additionalAuthParamsItem: string): VraSaltConfiguration;
    addStateFilesItem(stateFilesItem: string): VraSaltConfiguration;
    putAdditionalMinionParamsItem(key: string, additionalMinionParamsItem: string): VraSaltConfiguration;
    putVariablesItem(key: string, variablesItem: string): VraSaltConfiguration;
}
declare var VraSaltConfiguration: VraSaltConfiguration & { new(): VraSaltConfiguration; prototype: VraSaltConfiguration };

/** Plug-in: Aria Automation or VM Apps */
interface VraSnapshot {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    linksExtension: string;
    /** Indicates if the snapshot is the current snapshot for machine */
    isCurrent: boolean;
    readonly displayName: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** A human-friendly description. */
    description: string;
    /** The id of this resource instance */
    id: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    putLinksItem(key: string, linksItem: VraHref): VraSnapshot;
}
declare var VraSnapshot: VraSnapshot & { new(): VraSnapshot; prototype: VraSnapshot };

/** Plug-in: Aria Automation or VM Apps */
interface VraSnapshotSpecification {
    /** Email of the user that owns the entity. */
    owner: string;
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** Captures the full state of a running virtual machine, including the memory. */
    snapshotMemory: boolean;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** The id of this resource instance */
    id: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraSnapshotSpecification;
    putLinksItem(key: string, linksItem: VraHref): VraSnapshotSpecification;
}
declare var VraSnapshotSpecification: VraSnapshotSpecification & { new(): VraSnapshotSpecification; prototype: VraSnapshotSpecification };

/**
 * Represents a structure that holds details of storage profile linked to a cloud zone / region.**HATEOAS** links:<br>**region** - Region - Region for the profile.<br>**self** - StorageProfile - Self link to this storage profile.<br>**datastore** - FabricVsphereDatastore - Datastore of this storage profile.<br>**storage-policy** - FabricVsphereStoragePolicy - vSphere storage policy for this profile.<br> **storage-account** - FabricAzureStorageAccount - Azure storage account for this profile.<br>
 * Plug-in: Aria Automation or VM Apps
 */
interface VraStorageProfile {
    /** Email of the user that owns the entity. */
    owner: string;
    linksExtension: string;
    supportsEncryption: boolean;
    /** The id of the region for which this profile is defined */
    externalRegionId: string;
    /** Id of the cloud account this storage profile belongs to. */
    cloudAccountId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A list of tags that represent the capabilities of this storage profile */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    diskPropertiesExtension: string;
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    tagsExtension: string;
    defaultItem: boolean;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    addTagsItem(tagsItem: VraTag): VraStorageProfile;
    /** Indicates if a storage profile is default profile or not. */
    isDefaultItem(): boolean;
    /** Indicates whether this storage profile supports encryption or not. */
    isSupportsEncryption(): boolean;
    putLinksItem(key: string, linksItem: VraHref): VraStorageProfile;
    putDiskPropertiesItem(key: string, diskPropertiesItem: string): VraStorageProfile;
}
declare var VraStorageProfile: VraStorageProfile & { new(): VraStorageProfile; prototype: VraStorageProfile };

/**
 * State object representing a query result of storage profiles.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraStorageProfileResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraStorageProfileResult: VraStorageProfileResult & { new(): VraStorageProfileResult; prototype: VraStorageProfileResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraStorageProfileService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
}
declare var VraStorageProfileService: VraStorageProfileService & { new(): VraStorageProfileService; prototype: VraStorageProfileService };

/** Plug-in: Aria Automation or VM Apps */
interface VraTag {
    readonly displayName: string;
    readonly internalIdString: string;
    host: VraHost;
    /** Tag's value. */
    value: string;
    /** Tag's key. */
    key: string;
}
declare var VraTag: VraTag & { new(): VraTag; prototype: VraTag };

/**
 * State object representing a query result of tags.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraTagResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraTagResult: VraTagResult & { new(): VraTagResult; prototype: VraTagResult };

/** Plug-in: Aria Automation or VM Apps */
interface VraTagsService {
    setGenericRestClient(genericRestClient: VraGenericRestClient): void;
}
declare var VraTagsService: VraTagsService & { new(): VraTagsService; prototype: VraTagsService };

/** Plug-in: Aria Automation or VM Apps */
interface VraUpdateCloudAccountVsphereSpecification {
    /** Host name for the vSphere endpoint */
    hostName: string;
    /** Accept self signed certificate when connecting to vSphere */
    acceptSelfSignedCertificate: boolean;
    /** Create default cloud zones for the enabled regions. */
    createDefaultZones: boolean;
    /** Password for the user used to authenticate with the cloud Account */
    password: string;
    /** NSX-V or NSX-T account to associate with this vSphere cloud account. vSphere cloud account can be a single NSX-V cloud account or a single NSX-T cloud account. */
    associatedCloudAccountIds: any[];
    /** A set of regions to enable provisioning on.Refer to /iaas/api/cloud-accounts/region-enumeration. */
    regions: any[];
    /** Identifier of a data collector vm deployed in the on premise infrastructure. Refer to the data-collector API to create or list data collectors. Note: Data collector endpoints are not available in VMware Aria Automation(on-prem) release. */
    dcid: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** A human-friendly description. */
    description: string;
    /** Username to authenticate with the cloud account */
    username: string;
    /** A set of tag keys and optional values to set on the Cloud Account */
    tags: any[];
    addAssociatedCloudAccountIdsItem(associatedCloudAccountIdsItem: string): VraUpdateCloudAccountVsphereSpecification;
    addTagsItem(tagsItem: VraTag): VraUpdateCloudAccountVsphereSpecification;
    addRegionsItem(regionsItem: VraRegionSpecification): VraUpdateCloudAccountVsphereSpecification;
}
declare var VraUpdateCloudAccountVsphereSpecification: VraUpdateCloudAccountVsphereSpecification & { new(): VraUpdateCloudAccountVsphereSpecification; prototype: VraUpdateCloudAccountVsphereSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraUpdateMachineSpecification {
    /** Describes machine within the scope of your organization and is not propagated to the cloud */
    description: string;
    /** A set of tag keys and optional values that should be set on any resource that is produced from this specification. */
    tags: any[];
    addTagsItem(tagsItem: VraTag): VraUpdateMachineSpecification;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraUpdateMachineSpecification;
}
declare var VraUpdateMachineSpecification: VraUpdateMachineSpecification & { new(): VraUpdateMachineSpecification; prototype: VraUpdateMachineSpecification };

/**
 * A representation of a user.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraUser {
    /** Type of the principal. Currently supported 'user' (default) and 'group'. */
    type: string;
    /** The email of the user or name of the group. */
    email: string;
}
declare var VraUser: VraUser & { new(): VraUser; prototype: VraUser };

/** Plug-in: Aria Automation or VM Apps */
interface VraZone {
    /** Email of the user that owns the entity. */
    owner: string;
    /** JSON String containing Links for the Zone */
    linksExtension: string;
    /** The id of the region for which this zone is defined */
    externalRegionId: string;
    /** Cloud account this zone belongs to. */
    cloudAccountId: string;
    /** A human-friendly description. */
    description: string;
    /** The id of the organization this entity belongs to. */
    orgId: string;
    /** A set of tag keys and optional values that were set on this placement. */
    tags: any[];
    /** Date when the entity was created. The date is in ISO 8601 and UTC. */
    createdAt: string;
    /** The folder relative path to the datacenter where resources are deployed to. (only applicable for vSphere cloud zones) */
    folder: string;
    /** A set of tag keys and optional values for compute resource filtering. */
    tagsToMatch: any[];
    readonly internalIdString: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    host: VraHost;
    /** The placement policy for the zone. */
    placementPolicy: string;
    /** JSON String containing a set of tag keys and optional values that were set on this placement. */
    tagsExtension: string;
    /** JSON String containing A set of tag keys and optional values for compute resource filtering. */
    tagsToMatchExtension: string;
    /** The id of this resource instance */
    id: string;
    /** Date when the entity was last updated. The date is ISO 8601 and UTC. */
    updatedAt: string;
    /** JSON String containing key value pair of properties that will be used */
    customPropertiesExtension: string;
    addTagsToMatchItem(tagsToMatchItem: VraTag): VraZone;
    putLinksItem(key: string, linksItem: VraHref): VraZone;
    addTagsItem(tagsItem: VraTag): VraZone;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraZone;
}
declare var VraZone: VraZone & { new(): VraZone; prototype: VraZone };

/** Plug-in: Aria Automation or VM Apps */
interface VraZoneAssignment {
    /** The amount of CPUs currently allocated. */
    allocatedCpu: number;
    /** Defines an upper limit on storage that can be requested from a cloud zone which is part of this project. Default is 0 (unlimited storage). Please note that this feature is supported only for vSphere cloud zones. Not valid for other cloud zone types. */
    storageLimitGB: number;
    /** The amount of storage currently allocated. */
    allocatedStorageGB: number;
    /** The number of resource instances currently allocated */
    allocatedInstancesCount: number;
    /** The maximum amount of cpus that can be used by this cloud zone. Default is 0 (unlimited cpu). */
    cpuLimit: number;
    /** The maximum amount of memory that can be used by this cloud zone. Default is 0 (unlimited memory). */
    memoryLimitMB: number;
    /** The amount of memory currently allocated. */
    allocatedMemoryMB: number;
    /** The Cloud Zone Id */
    zoneId: string;
    /** The maximum number of instances that can be provisioned in this cloud zone. Default is 0 (unlimited instances). */
    maxNumberInstances: number;
    /** The priority of this zone in the current project. Lower numbers mean higher priority. Default is 0 (highest) */
    priority: number;
}
declare var VraZoneAssignment: VraZoneAssignment & { new(): VraZoneAssignment; prototype: VraZoneAssignment };

/** Plug-in: Aria Automation or VM Apps */
interface VraZoneAssignmentSpecification {
    /** Defines an upper limit on storage that can be requested from a cloud zone which is part of this project. Default is 0 (unlimited storage). Please note that this feature is supported only for vSphere cloud zones. Not valid for other cloud zone types. */
    storageLimitGB: number;
    /** The maximum amount of cpus that can be used by this cloud zone. Default is 0 (unlimited cpu). */
    cpuLimit: number;
    /** The maximum amount of memory that can be used by this cloud zone. Default is 0 (unlimited memory). */
    memoryLimitMB: number;
    /** The Cloud Zone Id */
    zoneId: string;
    /** The maximum number of instances that can be provisioned in this cloud zone. Default is 0 (unlimited instances). */
    maxNumberInstances: number;
    /** The priority of this zone in the current project. Lower numbers mean higher priority. Default is 0 (highest) */
    priority: number;
}
declare var VraZoneAssignmentSpecification: VraZoneAssignmentSpecification & { new(): VraZoneAssignmentSpecification; prototype: VraZoneAssignmentSpecification };

/** Plug-in: Aria Automation or VM Apps */
interface VraZoneResult {
    /** Number of elements in the current page */
    readonly numberOfElements: number;
    /** List of content items */
    readonly content: any[];
    /** Total number of elements. In some cases the field may not be populated */
    readonly totalElements: number;
}
declare var VraZoneResult: VraZoneResult & { new(): VraZoneResult; prototype: VraZoneResult };

/**
 * Specification for a zone.
 * Plug-in: Aria Automation or VM Apps
 */
interface VraZoneSpecification {
    /** The folder relative path to the datacenter where resources are deployed to. (only applicable for vSphere cloud zones) */
    folder: string;
    /** The ids of the compute resources that will be explicitly assigned to this zone */
    computeIds: any[];
    /** A set of tag keys and optional values that will be used */
    tagsToMatch: any[];
    /** The id of the region for which this profile is created */
    regionId: string;
    /** A human-friendly name used as an identifier in APIs that support this option. */
    name: string;
    /** Placement policy for the zone. One of DEFAULT, SPREAD or BINPACK. */
    placementPolicy: string;
    /** A human-friendly description. */
    description: string;
    /** A set of tag keys and optional values that are effectively applied to all compute resources in this zone, but only in the context of this zone. */
    tags: any[];
    addTagsToMatchItem(tagsToMatchItem: VraTag): VraZoneSpecification;
    putCustomPropertiesItem(key: string, customPropertiesItem: string): VraZoneSpecification;
    addComputeIdsItem(computeIdsItem: string): VraZoneSpecification;
    addTagsItem(tagsItem: VraTag): VraZoneSpecification;
}
declare var VraZoneSpecification: VraZoneSpecification & { new(): VraZoneSpecification; prototype: VraZoneSpecification };
