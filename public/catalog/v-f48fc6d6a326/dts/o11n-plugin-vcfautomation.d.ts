// VCF Automation for All Apps (o11n-plugin-vcfautomation), generated from modernvroapi.in data. Do not edit.

/** Plug-in: VCF Automation for All Apps */
interface VCFACatalogResourceService {
    readonly allSupervisorResources_internal: any[];
    getSupervisorResource_internal(id: string): VCFASupervisorResource;
    getSupervisorResource(id: string): VCFASupervisorResource;
    getSupervisorNamespaceResources_internal(namespaceName: string): VCFASupervisorResource[];
}
declare var VCFACatalogResourceService: VCFACatalogResourceService & { new(host: VCFAHost): VCFACatalogResourceService; prototype: VCFACatalogResourceService };

/** Plug-in: VCF Automation for All Apps */
interface VCFACciService {
    readonly allSupervisorNamespaces_internal: any[];
    readonly allSupervisorNamespaces: any[];
    getSupervisorNamespacesForProject(projectName: string): VCFASupervisorNamespace[];
    createSupervisorNamespace(projectName: string, jsonSpec: string): VCFASupervisorNamespace;
    getSupervisorNamespace(projectName: string, name: string): VCFASupervisorNamespace;
    getSupervisorNamespacesForProject_internal(projectName: string): VCFASupervisorNamespace[];
    getSupervisorNamespace_internal(projectName: string, name: string): VCFASupervisorNamespace;
}
declare var VCFACciService: VCFACciService & { new(host: VCFAHost): VCFACciService; prototype: VCFACciService };

/**
 * VMware Cloud Foundation Automation Entity finder to search for an entity
 * Plug-in: VCF Automation for All Apps
 */
interface VCFAEntitiesFinder {
}
declare var VCFAEntitiesFinder: VCFAEntitiesFinder & { new(): VCFAEntitiesFinder; prototype: VCFAEntitiesFinder };

/**
 * A generic VMware Cloud Foundation Automation Rest client for executing REST operations
 * Plug-in: VCF Automation for All Apps
 */
interface VCFAGenericRestClient {
    host: VCFAHost;
    /** Get Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    get(request: VCFARestRequest): VCFARestResponse;
    /** Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    execute(restRequest: VCFARestRequest): VCFARestResponse;
    /** Put Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    put(request: VCFARestRequest): VCFARestResponse;
    /** Delete Method (Http Delete) to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    delete(request: VCFARestRequest): VCFARestResponse;
    /** Post Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    post(request: VCFARestRequest): VCFARestResponse;
    /** Method to create HTTP rest Request. It holds parameter (HTTP Method (GET/PUT/POST/DELETE/PATCH), Resource Path URI, Request Payload (Stringified JSON)). */
    createRequest(method: string, path: string, requestPayload: string): VCFARestRequest;
    /** Patch Method (Http Patch) to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload) */
    patch(request: VCFARestRequest): VCFARestResponse;
}
declare var VCFAGenericRestClient: VCFAGenericRestClient & { new(): VCFAGenericRestClient; prototype: VCFAGenericRestClient };

/**
 * VMware Cloud Foundation Automation Host provides access to connection host properties & validation access.
 * Plug-in: VCF Automation for All Apps
 */
interface VCFAHost {
    readonly apiToken: string;
    readonly projectService: VCFAProjectService;
    /** DisplayName for the Connection Host. */
    readonly displayName: string;
    /** Host Connection Name */
    readonly name: string;
    /** Host URL for the Automation Host Connection. */
    readonly host: string;
    readonly cciService: VCFACciService;
    /** Host Id. */
    readonly id: string;
    /** Session Mode of the Automation Host Connection (Shared Session or Per User Session). */
    readonly sessionMode: string;
    readonly catalogResourceService: VCFACatalogResourceService;
    readonly tenant: string;
    readonly k8sApiVersion: string;
    /** Destroys the connection object */
    destroy(): void;
    /** Validates the Host Connection */
    validate(): boolean;
    /** Creates a generic REST client for Automation Host */
    createRestClient(): VCFAGenericRestClient;
}
declare var VCFAHost: VCFAHost & { new(): VCFAHost; prototype: VCFAHost };

/**
 * HostManager provides all the CRUD operations for VMware Cloud Foundation Automation Plugin along with Generic Rest Client support.
 * Plug-in: VCF Automation for All Apps
 */
interface VCFAHostManager {
    /** Default Host Connection. */
    readonly defaultHostData: VCFAHost;
    /** Save Automation Host object. */
    save(props: any): string;
    /** Update Automation Host object. */
    update(props: any, host: VCFAHost): void;
    /** Creates a dynamic Automation Host. */
    createHost(properties: any): VCFAHost;
    /** Creates a temporary host with the current user host and credentials. */
    createHostForCurrentUser(): VCFAHost;
    /** Delete Automation Host. */
    delete(host: VCFAHost): void;
    /** Validate Automation Host. */
    validate(host: VCFAHost): boolean;
    /** Get Automation Host by Sid. */
    getHostBySid(sid: string): VCFAHost;
}
declare var VCFAHostManager: VCFAHostManager & { new(): VCFAHostManager; prototype: VCFAHostManager };

/** Plug-in: VCF Automation for All Apps */
interface VCFAPrincipal {
    type: string;
    email: string;
}
declare var VCFAPrincipal: VCFAPrincipal & { new(): VCFAPrincipal; prototype: VCFAPrincipal };

/** Plug-in: VCF Automation for All Apps */
interface VCFAProject {
    sharedResources: boolean;
    readonly internalIdString: string;
    host: VCFAHost;
    name: string;
    description: string;
    id: string;
    administrators: VCFAPrincipal[];
}
declare var VCFAProject: VCFAProject & { new(): VCFAProject; prototype: VCFAProject };

/** Plug-in: VCF Automation for All Apps */
interface VCFAProjectService {
    readonly projects: any[];
    readonly projects_internal: any[];
    getProject_internal(id: string): VCFAProject;
    getProject(id: string): VCFAProject;
}
declare var VCFAProjectService: VCFAProjectService & { new(host: VCFAHost): VCFAProjectService; prototype: VCFAProjectService };

/**
 * Represents a request object for VMware Cloud Foundation Automation API.
 * Plug-in: VCF Automation for All Apps
 */
interface VCFARestRequest {
    path: string;
    method: string;
    payload: string;
    /** Gets Http Header value for the key from the Http Request. */
    getHeader(header: string): string;
    /** Sets Headers to the Http Request Object. */
    setHeader(key: string, value: string): void;
}
declare var VCFARestRequest: VCFARestRequest & { new(): VCFARestRequest; prototype: VCFARestRequest };

/**
 * Utility class used for VMware Cloud Foundation Automation API server response.
 * Plug-in: VCF Automation for All Apps
 */
interface VCFARestResponse {
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
declare var VCFARestResponse: VCFARestResponse & { new(): VCFARestResponse; prototype: VCFARestResponse };

/** Plug-in: VCF Automation for All Apps */
interface VCFASupervisorNamespace {
    readonly internalIdString: string;
    host: VCFAHost;
    readonly name: string;
    readonly projectName: string;
    readonly projectId: string;
    readonly k8sId: string;
}
declare var VCFASupervisorNamespace: VCFASupervisorNamespace & { new(): VCFASupervisorNamespace; prototype: VCFASupervisorNamespace };

/** Plug-in: VCF Automation for All Apps */
interface VCFASupervisorResource {
    apiVersion: string;
    kind: string;
    readonly internalIdString: string;
    host: VCFAHost;
    readonly name: string;
    readonly namespace: string;
    id: string;
    readonly projectName: string;
    readonly projectId: string;
}
declare var VCFASupervisorResource: VCFASupervisorResource & { new(): VCFASupervisorResource; prototype: VCFASupervisorResource };
