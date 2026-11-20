// Mail (o11n-plugin-mail), generated from modernvroapi.in data. Do not edit.

/** Plug-in: Mail */
interface ConnectionManager {
    /** Creates a new Connection for the provided parameters. */
    save(smtpHost: string, smtpPort: number, username: string, password: string, fromAddress: string, fromName: string): string;
}
declare var ConnectionManager: ConnectionManager & { new(): ConnectionManager; prototype: ConnectionManager };

/**
 * Main class to create mail messages
 * Plug-in: Mail
 */
interface EmailMessage {
    /** Mail sender SMTP host name or IP address */
    smtpHost: string;
    /** Mail sender SMTP port (the default is 25) */
    smtpPort: number;
    /** Comma-separated list of destination email addresses */
    toAddress: string;
    /** Email address of the sender */
    fromAddress: string;
    /** Display name of the sender (optional) */
    fromName: string;
    /** Comma-separated list of Carbon copy email addresses */
    ccAddress: string;
    /** Comma-separated list of Blank Carbon copy email addresses */
    bccAddress: string;
    /** Email subject */
    subject: string;
    /** Username to connect to the SNMP host */
    username: string;
    /** Password to connect to the SNMP host */
    password: any;
    /** Whether or not using smtp or smtps (SMTP over Ssl) protocol */
    useSsl: boolean;
    /** Whether or not to enable STARTTLS command */
    useStartTls: boolean;
    /** Send the message. */
    sendMessage(): void;
    /** Add a mime part to the message. */
    addMimePart(content: any, mimetype: string): void;
    /** Set a session property. */
    setSessionProperty(key: string, value: string): void;
    /** Get the value of the specified session property. */
    getSessionProperty(key: string): string;
}
declare var EmailMessage: EmailMessage & { new(): EmailMessage; prototype: EmailMessage };

/**
 * Mail client that can be used to retrieve messages from a mail server. The default protocol is IMAP but POP3 protocol can also be used.
 * Plug-in: Mail
 */
interface MailClient {
    /** Enable SSL connection. */
    enableSSL(): void;
    /** Set connection timeout. */
    setConnectionTimeout(timeout: number): void;
    /** Set socket timeout. */
    setSocketTimeout(timeout: number): void;
    /** Set a mail protocol to use. */
    setProtocol(protocol: string): void;
    /** Connect the client to a mail server. */
    connect(host: string, port: number, username: string, password: string): void;
    /** Enables the IMAP Compatibility mode. It allows the client to avoid all sorts of parsing and protocol bugs in many IMAP servers, but of course it comes at the cost of being less efficient because it is not taking advantage of the IMAP protocol's ability to fetch only the parts of the message that are needed. For complete reference - http://www.oracle.com/technetwork/java/javamail/faq/index.html#imapserverbug */
    enableImapCompatibilityMode(): void;
    /** Disables the IMAP Compatibility mode. */
    disableImapCompatibilityMode(): void;
    /** Returns the name of the root folder of the default namespace presented to the user. */
    getDefaultFolder(): void;
    /** Opens a folder on the mail server. */
    openFolder(folderName: string): any;
    /** Opens the root folder of the default namespace presented to the user. */
    openDefaultFolder(): any;
    /** Returns a list of subfolders of the current folder. */
    getSubFolders(): string[];
    /** Returns a list of subfolders of the current folder. */
    getSubscribedSubFolders(): string[];
    /** Returns a set of folders representing the namespaces for a user. */
    getUserNamespaces(userName: string): string[];
    /** Closes the current folder. */
    closeFolder(): any;
    /** Returns a message from the mail server. */
    getMessage(msgNumber: string): ReceivedMessage[];
    /** Returns a list of messages from the mail server which have message numbers within a certain range. */
    getMessagesBetween(startMsgNumber: string, endMsgNumber: string): ReceivedMessage[];
    /** Returns all messages in the current folder. */
    getMessages(): ReceivedMessage[];
    /** Returns all unread messages in the current folder. */
    getUnseenMessages(): ReceivedMessage[];
    /** Returns all recent messages of the current folder. */
    getRecentMessages(): ReceivedMessage[];
    /** Returns all deleted messages from the current folder. */
    getDeletedMessages(): ReceivedMessage[];
    /** Returns all messages that contain a specific string in the "From" address attribute. */
    searchFromAddress(pattern: string): ReceivedMessage[];
    /** Returns all messages that contain a specific string in the "To", "Cc" or "Bcc" address attributes. */
    searchRecipientAddress(pattern: string): ReceivedMessage[];
    /** Returns all messages that contain a specific string in the message body. */
    searchBodyMessage(pattern: string): ReceivedMessage[];
    /** Returns all messages that contain a specific string in the message subject. */
    searchSubjectMessage(pattern: string): ReceivedMessage[];
    /** Returns the total number of messages in the current folder. */
    getMessageCount(): number;
    /** Returns the number of the new messages in the current folder. */
    getNewMessageSize(): number;
    /** Mark a message for deletion. Messages marked for deletion are deleted by the server only when the folder is closed or by explicitly invoking an 'expunge' method. */
    deleteMessage(msgNumber: string): void;
    /** Mark messages for deletion. Messages marked for deletion are deleted by the server only when the folder is closed or by explicitly invoking an 'expunge' method. */
    deleteMessages(msgNumbers: string[]): void;
    /** Expunge (permanently remove) all messages marked for deletion. */
    expungeMessages(): ReceivedMessage[];
    /** Set MAX allowed body part size in MB */
    setMaxBodyPartSize(size: number): void;
    /** Set a session property. */
    setSessionProperty(key: string, value: string): void;
    /** Get the value of the specified session property. */
    getSessionProperty(key: string): string;
    /** Disconnects the client from the mail server. Expunges all messages marked for deletion. */
    close(): void;
}
declare var MailClient: MailClient & { new(): MailClient; prototype: MailClient };

/**
 * Part of the message that contains a set of attributes and a content
 * Plug-in: Mail
 */
interface MessageBodyPart {
    /** Content-Type of the content of this part. Returns null if the Content-Type could not be determined. */
    readonly contentType: string;
    /** Disposition of this part. The disposition describes how the part should be presented to the user. */
    readonly disposition: string;
    /** Filename associated with this part, if possible. */
    readonly fileName: string;
    /** Returns the content of this body part as a raw string. */
    getContent(): string;
    /** Returns the content as MessageMultiPart if the body part is of a multipart type. */
    getMultiPartContent(): MessageMultiPart;
    /** Shows whether the content is a multipart object. */
    isContentMultiPart(): boolean;
    /** Return the size of the content of this part in bytes. */
    getSize(): number;
    /** Returns true if this part is an attachment. */
    isAttachment(): boolean;
    /** Returns the content as MimeAttachment object. */
    getAsMimeAttachment(): MimeAttachment;
}
declare var MessageBodyPart: MessageBodyPart & { new(): MessageBodyPart; prototype: MessageBodyPart };

/**
 * Container that holds multiple body parts
 * Plug-in: Mail
 */
interface MessageMultiPart {
    /** Returns the number of the body parts. */
    getPartsCount(): number;
    /** Returns a specific body part from the multipart message. */
    getBodyPart(index: number): MessageBodyPart;
}
declare var MessageMultiPart: MessageMultiPart & { new(): MessageMultiPart; prototype: MessageMultiPart };

/**
 * Represents a received email message from a mail server.
 * Plug-in: Mail
 */
interface ReceivedMessage {
    /** "From" attribute of the message as array of strings */
    readonly from: string[];
    /** "To" attribute of the message as array of strings */
    readonly to: string[];
    /** "Subject" attribute of the message */
    readonly subject: string;
    /** "Cc" attribute of the message as array of strings */
    readonly cc: string[];
    /** "Bcc" attribute of the message as array of strings */
    readonly bcc: string[];
    /** "ReplyTo" attribute of the message as array of strings */
    readonly replyTo: string[];
    /** Number of the message */
    readonly id: number;
    /** Content type of the message */
    readonly contentType: string;
    /** Returns all message headers as properties. */
    getHeaders(): Properties;
    /** Returns a value of a specific header key. */
    getHeader(key: string): string;
    /** Returns the folder from which this message was obtained. */
    getFolder(): string;
    /** Returns the content of the message as a raw string. */
    getContent(): string;
    /** Returns the content of the message as MessageMultiPart if the content is of a multipart type. */
    getMultiPartContent(): MessageMultiPart;
    /** Shows whether the content is a multipart object. */
    isContentMultiPart(): boolean;
    /** Returns the date on which this message was received. */
    getReceivedDate(): Date;
    /** Returns the date on which this message was sent. */
    getSentDate(): Date;
    /** Checks whether this message is expunged. */
    isExpunged(): boolean;
    /** Marks this message for deletion */
    delete(): void;
}
declare var ReceivedMessage: ReceivedMessage & { new(): ReceivedMessage; prototype: ReceivedMessage };
