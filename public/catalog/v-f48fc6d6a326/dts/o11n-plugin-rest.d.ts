// REST API (o11n-plugin-rest), generated from modernvroapi.in data. Do not edit.

/**
 * Authorization value util
 * Plug-in: REST API
 */
interface AuthorizationValue {
    setKeyName(keyName: string): void;
    setType(type: string): void;
    setValue(value: string): void;
    getKeyName(): string;
    getValue(): string;
    getType(): string;
    keyName(keyName: string): AuthorizationValue;
    value(value: string): AuthorizationValue;
    type(type: string): AuthorizationValue;
}
declare var AuthorizationValue: AuthorizationValue & { new(): AuthorizationValue; prototype: AuthorizationValue };

/**
 * Contains server authentication properties.
 * Plug-in: REST API
 */
interface HTTPBasicAuthentication {
    /** Type of this authentication object */
    readonly type: string;
    /** The authentication properties returned as array */
    readonly rawAuthProperties: string[];
    /** Retrieves an authentication property by specified index. */
    getRawAuthProperty(index: number): string;
    /** (Static) get Basic Auth Header Value */
    getBasicAuthHeaderValue(username: string, password: string): string;
}
declare var HTTPBasicAuthentication: HTTPBasicAuthentication & { new(): HTTPBasicAuthentication; prototype: HTTPBasicAuthentication };

/**
 * Contains server authentication properties.
 * Plug-in: REST API
 */
interface RESTAuthentication {
    /** Type of this authentication object */
    readonly type: string;
    /** The authentication properties returned as array */
    readonly rawAuthProperties: string[];
    /** Retrieves an authentication property by specified index. */
    getRawAuthProperty(index: number): string;
}
declare var RESTAuthentication: RESTAuthentication & { new(): RESTAuthentication; prototype: RESTAuthentication };

/**
 * Provides authentication types listing and creation.
 * Plug-in: REST API
 */
interface RESTAuthenticationManager {
    /** Returns all available authentication types. */
    getRESTAuthentications(): string[];
    /** Returns the supported session modes. */
    getSessionModes(): string[];
    /** Creates an authentication instance. */
    createAuthentication(type: string, params: string[]): any;
}
declare var RESTAuthenticationManager: RESTAuthenticationManager & { new(): RESTAuthenticationManager; prototype: RESTAuthenticationManager };

/**
 * Wrapper around http cookie. RESTCookie objects are read-only.
 * Plug-in: REST API
 */
interface RESTCookie {
    /** Cookie name. */
    readonly name: string;
    /** Cookie value. */
    readonly value: string;
    /** Cookie domain. */
    readonly domain: string;
    /** Cookie path. */
    readonly path: string;
    /** Cookie expiry date. */
    readonly expiryDate: Date;
}
declare var RESTCookie: RESTCookie & { new(): RESTCookie; prototype: RESTCookie };

/**
 * REST plug-in host object
 * Plug-in: REST API
 */
interface RESTHost {
    /** id */
    readonly id: string;
    /** name */
    name: string;
    /** url */
    url: string;
    /** authentication */
    authentication: any;
    /** proxyAuthentication */
    proxyAuthentication: any;
    /** connectionTimeout */
    connectionTimeout: number;
    /** operationTimeout */
    operationTimeout: number;
    /** hostVerification */
    hostVerification: boolean;
    /** Proxy host */
    proxyHost: string;
    /** Proxy port */
    proxyPort: number;
    /** The Id of the PrivateKeyEntry to use for client cerificate authentication. */
    privateKeyId: string;
    /** Cookies */
    readonly cookies: RESTCookie[];
    /** Retrieves cookies associated with this RESTHost. */
    getCookies(): RESTCookie[];
    /** Clears the cookies associated with this RESTHost. */
    clearCookies(): any;
    /** Clears cookies associated with this RESTHost expired by the given date. */
    clearExpired(date: Date): boolean;
    /** Creates a copy of the REST host. */
    clone(): RESTHost;
    /** Creates a new host from this REST host. */
    newHostFromThis(): RESTHost;
    /** Adds a new operation to the host. */
    addOperation(operation: RESTOperation): RESTOperation;
    /** Updates a REST operation. */
    updateOperation(operation: RESTOperation): RESTOperation;
    /** Retrieves an operation by id. */
    getOperation(id: string): RESTOperation;
    /** Removes a REST operation from this host. */
    removeOperation(id: string): RESTOperation;
    /** Retrieves all operation names. */
    getOperations(): string[];
    /** Adds an XSD schema from a given URL. */
    addSchemaFromUrl(url: string): string[];
    /** Adds an XSD schema provided as a string. */
    addSchemaFromXmlString(xml: string): string[];
    /** Removes all associated XSD schemas from this host. */
    removeAllSchemas(): void;
    /** Retrieves all XML elements for a given namespace, from XSD files for this host. */
    getSchemaElements(namespace: string): any[];
    /** Retrieves all namespaces from XSD files for this host. */
    getSchemaNamespaces(): string[];
    /** Check if the current REST host instance supports parallel request executions */
    supportParallelRequests(): boolean;
    /** Creates a RESTRequest using the host data. */
    createRequest(method: string, url: string, content: any): any;
    /** Creates a RESTRequest using the host data. */
    createRequestWithOptions(method: string, url: string, content: any, options: RESTRequestOptions): any;
    /** (DEPRECATED) Set automatic URL redirection. If set to true, the generated HTTP request will automatically follow the URL redirects (upon HTTP response status 301, 302 and 307). Return true if the value is propagated. setRedirectStrategy method is to be used. */
    setAutoUrlRedirect(autoRedirectEnabled: boolean): void;
    /** (DEPRECATED) Check if the automatically redirection is enabled. getRedirectStrategy method is to be used. */
    getAutoUrlRedirectEnabled(): boolean;
    /** The chosen redirect strategy. Possible values are defaultRedirect, neverRedirect, alwaysRedirect. */
    setRedirectStrategy(redirectStrategy: string): any;
    /** Returns which redirect strategy is used */
    getRedirectStrategy(): string;
    /** Executes a request with provided credentials. Supported only for hosts created with RESTHostManager.createTransientHostFrom() with HTTP Basic Authentication. */
    executeRequestWithCredentials(method: string, url: string, content: any, user: string, pass: string): any;
}
declare var RESTHost: RESTHost & { new(): RESTHost; prototype: RESTHost };

/**
 * Provides CRUD operations for RootElement objects.
 * Plug-in: REST API
 */
interface RESTHostManager {
    /** Creates a RESTHost object. */
    createHost(name: string): RESTHost;
    /** Creates a RESTHost object with option to use new Http Context per request. With that setup the Rest Host supports parallel requests. */
    createHostSupportingParallelRequests(name: string): RESTHost;
    /** Adds a RESTHost object to the plug-in's inventory. */
    addHost(host: RESTHost): RESTHost;
    /** Updates the specified RESTHost in the plug-in's inventory. */
    updateHost(host: RESTHost): RESTHost;
    /** Removes a RESTHost object from the plug-in's inventory. */
    removeHost(id: string): RESTHost;
    /** Retrieves a RESTHost object by name. */
    getHost(id: string): RESTHost;
    /** Retrieves an array of available host names. */
    getHosts(): string[];
    /** Reloads the plug-in configuration. */
    reloadConfiguration(): any;
    /** Generates a workflow from a REST operation. */
    createWorkflow(operation: RESTOperation, workflowName: string, category: WorkflowCategory, defaultContentType: string): Workflow;
    /** Generates a workflow from a REST operation. */
    createWorkflowWithXsdInput(operation: RESTOperation, workflowName: string, category: WorkflowCategory, namespace: string, elementName: string, defaultContentType: string): Workflow;
    /** Creates a new transient (not persisted) host. */
    createTransientHostFrom(restHostPrototype: RESTHost): RESTHost;
    /** Creates a new transient RESTOperation. If Tthe base URL of operation's host is changed, all subsequent requests to the operation will be executed against the new base URL (new host). */
    createTransientOperationFrom(restOperationPrototype: RESTOperation): RESTOperation;
    /** Get the OpenAPI service URL from OpenAPI spec and the preferred protocol */
    getOpenApiServiceUrl(openApiSpec: string, preferredUrl: string): string;
    /** Creates rest host from OpenAPI spec provided as string */
    createRESTHostFromOpenApiSpecString(hostName: string, openApiSpec: string, preferredUrl: string, params: any): RESTHost;
    /** Creates rest host from OpenAPI url provided as string */
    createRESTHostFromOpenApiUrl(hostName: string, url: string, auths: AuthorizationValue[], preferredUrl: string, params: any): RESTHost;
    /** Get the Swagger service URL from Swagger spec and the preferred protocol */
    getSwaggerServiceUrl(swaggerSpec: string, host: string, basePath: string, preferredCommunicationProtocol: string): string;
    /** Adds a new operation from a URL. */
    createRESTHostFromSwaggerSpecUrl(hostName: string, swaggerSpecUrl: string, auths: AuthorizationValue[], preferredCommunicationProtocol: string, params: any): RESTHost;
    /** Adds a new operation from string definition */
    createRESTHostFromSwaggerSpecString(hostName: string, swaggerSpec: string, host: string, basePath: string, preferredCommunicationProtocol: string, params: any): RESTHost;
}
declare var RESTHostManager: RESTHostManager & { new(): RESTHostManager; prototype: RESTHostManager };

/**
 * REST plug-in operation object
 * Plug-in: REST API
 */
interface RESTOperation {
    /** id */
    readonly id: string;
    /** Unique identifier of the operation */
    name: string;
    /** Parent RESTHost of this operation */
    host: RESTHost;
    /** The count of the input parameters (all parameters defined in the URL template) for this operation */
    readonly inParametersCount: number;
    /** HTTP method of this operation (GET, HEAD, PATCH, POST, PUT, OPTIONS, TRACE or DELETE) */
    method: string;
    /** The URL template for this operation (ex. /operation/{param1}?param2={param2}) */
    urlTemplate: string;
    /** The default content type of the content input for this operation (meaningful for operations with method PUT or POST) */
    defaultContentType: string;
    /** Creates a copy of the REST operation. */
    clone(): RESTOperation;
    /** Creates a new operation from this REST operation. */
    newOperationFromThis(): RESTOperation;
    /** Creates a RESTRequest by using the information contained in this operation and its parent host. */
    createRequest(params: string[], content: any): any;
    /** Creates a RESTRequest by using the information contained in this operation and its parent host. */
    createRequestWithOptions(params: string[], content: any, options: RESTRequestOptions): any;
    /** Retrieves the names of URL template input parameters. */
    getInParameters(): string[];
    /** Retrieves the names of HTTP request headers. */
    getHeaderParameters(): string[];
    /** The path parameters count. */
    getPathParamsCount(): number;
    /** Get the default content type */
    getDefaultContentType(): string;
    /** Get the supported request body content type */
    getSupportedContentTypes(): any;
    /** Add a supported content type */
    addSupportedContentType(supportedContentType: string): void;
    /** Get supportet Accept header media types */
    getSupportedAcceptHeaderMediaTypes(): string[];
    /** Add preferred media type for the Accept header */
    addPreferredAcceptHeaderMediaType(mediaType: string): void;
    /** Add supported media type for the Accept header] */
    addSupportedAcceptHeaderMediaType(mediaType: string): void;
    /** Is a mandatory path parameter. */
    isPathParamMandatory(pathParamName: string): boolean;
    /** Marks an existing path parameter as mandatory. */
    addMandatoryPathParameter(mandatoryPathParamName: string): void;
    /** Check if query param is mandatory] */
    isQueryParamMandatory(queryParamName: string): boolean;
    /** Marks an existing query parameter as mandatory. */
    addMandatoryQueryParameter(mandatoryQueryParamName: string): void;
    /** Is a mandatory header parameter. */
    isHeaderParamMandatory(headerParamName: string): boolean;
    /** Marks an existing header parameter as mandatory. */
    addMandatoryHeaderParameter(mandatoryHeaderParamName: string): void;
}
declare var RESTOperation: RESTOperation & { new(): RESTOperation; prototype: RESTOperation };

/**
 * Utility class created from REST operation (or host), used to make the actual HTTP request.
 * Plug-in: REST API
 */
interface RESTRequest {
    /** Retrieves the full request URL - the one combining the host base URL and operation URL template with filled in input parameters */
    readonly fullUrl: string;
    /** The content type of the request */
    contentType: string;
    /** Runs the HTTP request. */
    execute(): any;
    /** Runs the HTTP request with provided Basic HTTP Authentication credentials. This operation is supported only for requests executed against RESTHost that supports Basic HTTP Authentication. */
    executeWithCredentials(user: string, pass: string): any;
    /** Sets an additional HTTP header to this request. */
    setHeader(header: string, value: string): any;
    /** Get HTTP method of the request. */
    getMethod(): string;
}
declare var RESTRequest: RESTRequest & { new(): RESTRequest; prototype: RESTRequest };

/**
 * Options for a request
 * Plug-in: REST API
 */
interface RESTRequestOptions {
    /** The operation timeout */
    operationTimeout: number;
    /** The connection timeout */
    connectionTimeout: number;
}
declare var RESTRequestOptions: RESTRequestOptions & { new(): RESTRequestOptions; prototype: RESTRequestOptions };

/**
 * Utility class used for HTTP server response.
 * Plug-in: REST API
 */
interface RESTResponse {
    /** The server's response content as a string */
    readonly contentAsString: string;
    /** The server's response status code */
    readonly statusCode: number;
    /** The server's response content length */
    readonly contentLength: number;
    /** Retrieves the server's response header values per header with specified name */
    getHeaderValues(headerName: string): string[];
    /** Retrieves the server's response headers as a Properties object. */
    getAllHeaders(): Properties;
}
declare var RESTResponse: RESTResponse & { new(): RESTResponse; prototype: RESTResponse };

/**
 * Various utility functions.
 * Plug-in: REST API
 */
interface RESTUtils {
    xml2json(xmlString: string): string;
    xmlDate(date: Date): string;
    xmlInt(number: number): string;
}
declare var RESTUtils: RESTUtils & { new(): RESTUtils; prototype: RESTUtils };
