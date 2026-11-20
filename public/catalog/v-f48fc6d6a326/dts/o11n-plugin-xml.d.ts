// XML (o11n-plugin-xml), generated from modernvroapi.in data. Do not edit.

/**
 * XML document
 * Plug-in: XML
 */
interface XMLDocument {
    /** This is a convenience attribute that allows direct access to the child node that is the root element of the document. */
    getDocumentElement(): XMLElement;
    /** Create a new element with the given name */
    createElement(name: string): XMLElement;
    /** Create a new comment node */
    createComment(name: string): XMLNode;
    /** Create a text node */
    createTextNode(name: string): XMLNode;
    /** Create a new CDATA node */
    createCDATASection(name: any): XMLNode;
    /** Create a ProcessingInstruction node given the specified name and data strings. */
    createProcessingInstruction(target: string, data: string): XMLNode;
    /** Normalize the document */
    normalize(): any;
    /** Returns a XMLNodeList of all the Elements with a given tag name in the order in which they are encountered in a preorder traversal of the XMLDocument tree. */
    getElementsByTagName(name: string): any;
    /** Adds the node newChild to the end of the list of children of this node. If the newChild is already in the tree, it is first removed. */
    appendChild(child: XMLNode): any;
    /** Removes the child node indicated by oldChild from the list of children, and returns it */
    removeChild(oldChild: XMLNode): any;
    /** Replaces the child node oldChild with newChild in the list of children, and returns the oldChild node. If the newChild is already in the tree, it is first removed. */
    replaceChild(newNode: XMLNode, oldNode: XMLNode): any;
    /** Inserts the node newChild before the existing child node refChild. If refChild is null, insert newChild at the end of the list of children. If the newChild is already in the tree, it is first removed. */
    insertBefore(newNode: XMLNode, refNode: XMLNode): any;
    /** Clone the node */
    cloneNode(deep: boolean): any;
    /** Get all children */
    getChildNodes(): any;
}
declare var XMLDocument: XMLDocument & { new(): XMLDocument; prototype: XMLDocument };

/**
 * Main Element
 * Plug-in: XML
 */
interface XMLElement {
    textContent: string;
    readonly tagName: string;
    /** A XMLNamedNodeMap containing the attributes of this Element. */
    getAttributes(): any;
    /** Set a new attribute */
    setAttribute(name: string, value: string): any;
    /** Remove atrribute with the given name */
    removeAttribute(name: string): any;
    /** Returns true if the attribute exists */
    hasAttribute(name: string): boolean;
    /** Returns a XMLNodeList of all the Elements with a given tag name in the order in which they are encountered in a preorder traversal of the current element tree. */
    getElementsByTagName(name: string): any;
    /** Adds the node newChild to the end of the list of children of this node. If the newChild is already in the tree, it is first removed. */
    appendChild(child: XMLNode): any;
    /** Removes the child node indicated by oldChild from the list of children, and returns it */
    removeChild(oldChild: XMLNode): any;
    /** Replaces the child node oldChild with newChild in the list of children, and returns the oldChild node. If the newChild is already in the tree, it is first removed. */
    replaceChild(newNode: XMLNode, oldNode: XMLNode): any;
    /** Inserts the node newChild before the existing child node refChild. If refChild is null, insert newChild at the end of the list of children. If the newChild is already in the tree, it is first removed. */
    insertBefore(newNode: XMLNode, refNode: XMLNode): any;
    /** Clone the node */
    cloneNode(deep: boolean): any;
    /** Normalize the node */
    normalize(): any;
    /** Get all children */
    getChildNodes(): XMLNodeList;
}
declare var XMLElement: XMLElement & { new(): XMLElement; prototype: XMLElement };

/**
 * Main class to create xml document parser
 * Plug-in: XML
 */
interface XMLManager {
    /** (Static) Create a new Empty XML document */
    newDocument(): XMLDocument;
    /** (Static) Deprecated. Use XMLManager.fromString instead. Get the document for a given path using the default character encoding */
    loadDocument(path: string, validate: boolean): XMLDocument;
    /** (Static) Deprecated. Use XMLManager.fromString instead. Get the document for a given path using the specified character encoding */
    loadDocumentWithEncoding(path: string, encoding: string, validate: boolean): XMLDocument;
    /** (Static) Get the document for a given string content */
    fromString(stringContext: string): XMLDocument;
    /** (Static) Deprecated. Return the content as string instead using getDocumentContent. Save the document to a given path using the default character encoding */
    saveDocument(document: XMLDocument, path: string, systemDtD: string, publicDtD: string): any;
    /** (Static) Deprecated. Return the content as string instead using getDocumentContent. Save the document to a given path using the default character encoding */
    saveDocumentWithEncoding(document: XMLDocument, path: string, encoding: string, systemDtD: string, publicDtD: string): any;
    /** (Static) Validate a document without saving it */
    validateDocument(document: XMLDocument, systemDtD: string, publicDtD: string): any;
    /** (Static) Get the document as string */
    getDocumentContent(document: XMLDocument): string;
}
declare var XMLManager: XMLManager & { new(): XMLManager; prototype: XMLManager };

/**
 * Node map, usually used for attributes of an element
 * Plug-in: XML
 */
interface XMLNamedNodeMap {
    /** list's length */
    readonly length: number;
    /** Get child at index */
    item(index: number): XMLNode;
    /** Retrieves a node specified by name. */
    getNamedItem(name: string): XMLNode;
}
declare var XMLNamedNodeMap: XMLNamedNodeMap & { new(): XMLNamedNodeMap; prototype: XMLNamedNodeMap };

/**
 * Node Element
 * Plug-in: XML
 */
interface XMLNode {
    /** The node value */
    nodeValue: string;
    /** The node name */
    readonly nodeName: string;
    /** The parent node (XMLNode) */
    readonly parentNode: any;
    /** Adds the node newChild to the end of the list of children of this node. If the newChild is already in the tree, it is first removed. */
    appendChild(child: XMLNode): any;
    /** Removes the child node indicated by oldChild from the list of children, and returns it */
    removeChild(oldChild: XMLNode): any;
    /** Replaces the child node oldChild with newChild in the list of children, and returns the oldChild node. If the newChild is already in the tree, it is first removed. */
    replaceChild(newNode: XMLNode, oldNode: XMLNode): any;
    /** Inserts the node newChild before the existing child node refChild. If refChild is null, insert newChild at the end of the list of children. If the newChild is already in the tree, it is first removed. */
    insertBefore(newNode: XMLNode, refNode: XMLNode): any;
    /** Clone the node */
    cloneNode(deep: boolean): any;
    /** Normalize the node */
    normalize(): any;
    /** Get all children */
    getChildNodes(): XMLNodeList;
}
declare var XMLNode: XMLNode & { new(): XMLNode; prototype: XMLNode };

/**
 * NodeList Element
 * Plug-in: XML
 */
interface XMLNodeList {
    /** list's length */
    readonly length: number;
    /** Get child at index */
    item(index: number): any;
}
declare var XMLNodeList: XMLNodeList & { new(): XMLNodeList; prototype: XMLNodeList };
