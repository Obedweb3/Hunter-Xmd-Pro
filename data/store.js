const { isJidBroadcast, isJidGroup, isJidNewsletter } = require('@whiskeysockets/baileys');
const fs = require('fs/promises')
const path = require('path')
const { DataTypes } = require('sequelize');
const { DATABASE } = require('../lib/database');
const storeDir = path.join(process.cwd(), 'store');

/**
 * Reads a JSON file and parses its content.
 *
 * This function constructs the file path using the provided filename and the predefined store directory.
 * It attempts to read the file asynchronously and parse its content as JSON.
 * If an error occurs during reading or parsing, it returns an empty array.
 *
 * @param {string} file - The name of the JSON file to read.
 */
const readJSON = async (file) => {
  try {
    const filePath = path.join(storeDir, file);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * Writes JSON data to a specified file.
 */
const writeJSON = async (file, data) => {
  const filePath = path.join(storeDir, file);
  await fs.mkdir(storeDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

/**
 * Save a contact's information to a JSON file.
 *
 * This function checks if the provided jid and name are valid. If valid, it reads the existing contacts from 'contact.json',
 * updates the contact's name if the jid already exists, or adds a new contact if it does not. Finally, it writes the updated
 * contacts back to the JSON file.
 *
 * @param jid - The JID of the contact to save.
 * @param name - The name of the contact to save.
 */
const saveContact = async (jid, name) => {
  if (!jid || !name || isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid)) return;
  const contacts = await readJSON('contact.json');
  const index = contacts.findIndex((contact) => contact.jid === jid);
  if (index > -1) {
    contacts[index].name = name;
  } else {
    contacts.push({ jid, name });
  }
  await writeJSON('contact.json', contacts);
};

const getContacts = async () => {
  try {
    const contacts = await readJSON('contact.json');
    return contacts;
  } catch (error) {
    return [];
  }
};

const saveMessage = async (message) => {
  const jid = message.key.remoteJid;
  const id = message.key.id;
  if (!id || !jid || !message) return;
  await saveContact(message.sender, message.pushName);
  const messages = await readJSON('message.json');
  const index = messages.findIndex((msg) => msg.id === id && msg.jid === jid);
  const timestamp = message.messageTimestamp ? message.messageTimestamp * 1000 : Date.now();
  if (index > -1) {
    messages[index].message = message;
    messages[index].timestamp = timestamp;
  } else {
    messages.push({ id, jid, message, timestamp });
  }
  await writeJSON('message.json', messages);
};

/**
 * Loads a message by its ID from a JSON file.
 *
 * This function checks if the provided ID is valid. If it is, it reads the messages from 'message.json'
 * and searches for a message that matches the given ID. If found, it returns the message; otherwise, it returns null.
 *
 * @param {string} id - The ID of the message to load.
 */
const loadMessage = async (id) => {
  if (!id) return null;
  const messages = await readJSON('message.json');
  return messages.find((msg) => msg.id === id) || null;
};

/**
 * Retrieves the name associated with a given JID from contacts.
 */
const getName = async (jid) => {
  const contacts = await readJSON('contact.json');
  const contact = contacts.find((contact) => contact.jid === jid);
  return contact ? contact.name : jid.split('@')[0].replace(/_/g, ' ');
};

/**
 * Save metadata for a specified group.
 *
 * This function checks if the provided jid is a valid group identifier. It retrieves the group's metadata using the client, formats the relevant fields, and updates or adds the metadata to a JSON file. Additionally, it extracts participant information and saves it to a separate JSON file. The function handles asynchronous operations for reading and writing files.
 *
 * @param jid - The identifier of the group whose metadata is to be saved.
 * @param client - The client instance used to fetch the group metadata.
 */
const saveGroupMetadata = async (jid, client) => {
  if (!isJidGroup(jid)) return;
  const groupMetadata = await client.groupMetadata(jid);
  const metadata = {
    jid: groupMetadata.id,
    subject: groupMetadata.subject,
    subjectOwner: groupMetadata.subjectOwner,
    subjectTime: groupMetadata.subjectTime
      ? new Date(groupMetadata.subjectTime * 1000).toISOString()
      : null,
    size: groupMetadata.size,
    creation: groupMetadata.creation ? new Date(groupMetadata.creation * 1000).toISOString() : null,
    owner: groupMetadata.owner,
    desc: groupMetadata.desc,
    descId: groupMetadata.descId,
    linkedParent: groupMetadata.linkedParent,
    restrict: groupMetadata.restrict,
    announce: groupMetadata.announce,
    isCommunity: groupMetadata.isCommunity,
    isCommunityAnnounce: groupMetadata.isCommunityAnnounce,
    joinApprovalMode: groupMetadata.joinApprovalMode,
    memberAddMode: groupMetadata.memberAddMode,
    ephemeralDuration: groupMetadata.ephemeralDuration,
  };

  const metadataList = await readJSON('metadata.json');
  const index = metadataList.findIndex((meta) => meta.jid === jid);
  if (index > -1) {
    metadataList[index] = metadata;
  } else {
    metadataList.push(metadata);
  }
  await writeJSON('metadata.json', metadataList);

  const participants = groupMetadata.participants.map((participant) => ({
    jid,
    participantId: participant.id,
    admin: participant.admin,
  }));
  await writeJSON(`${jid}_participants.json`, participants);
};

/**
 * Retrieves metadata for a specified group.
 *
 * This function checks if the provided jid is a valid group identifier. If valid, it reads the group metadata from 'metadata.json' and searches for the corresponding entry. If found, it also retrieves the participants' data from a separate JSON file named after the jid. The function returns an object that combines the metadata with the participants' information.
 *
 * @param {string} jid - The JID of the group whose metadata is to be retrieved.
 */
const getGroupMetadata = async (jid) => {
  if (!isJidGroup(jid)) return null;
  const metadataList = await readJSON('metadata.json');
  const metadata = metadataList.find((meta) => meta.jid === jid);
  if (!metadata) return null;

  const participants = await readJSON(`${jid}_participants.json`);
  return { ...metadata, participants };
};
/**
 * Save the count of messages sent by a user in a group or individual chat.
 *
 * The function first checks if the message and its sender are valid. It then reads the current message counts from 'message_count.json', updates the count for the sender if they already exist, or adds a new record if they do not. Finally, it writes the updated counts back to the JSON file.
 *
 * @param message - The message object containing details about the sender and the chat.
 * @returns {Promise<void>} A promise that resolves when the message count is saved.
 */
const saveMessageCount = async (message) => {
  if (!message) return;
  const jid = message.key.remoteJid;
  const sender = message.key.participant || message.sender;
  if (!jid || !sender || !isJidGroup(jid)) return;

  const messageCounts = await readJSON('message_count.json');
  const index = messageCounts.findIndex((record) => record.jid === jid && record.sender === sender);

  if (index > -1) {
    messageCounts[index].count += 1;
  } else {
    messageCounts.push({ jid, sender, count: 1 });
  }

  await writeJSON('message_count.json', messageCounts);
};

const getInactiveGroupMembers = async (jid) => {
  if (!isJidGroup(jid)) return [];
  const groupMetadata = await getGroupMetadata(jid);
  if (!groupMetadata) return [];

  const messageCounts = await readJSON('message_count.json');
  const inactiveMembers = groupMetadata.participants.filter((participant) => {
    const record = messageCounts.find((msg) => msg.jid === jid && msg.sender === participant.id);
    return !record || record.count === 0;
  });

  return inactiveMembers.map((member) => member.id);
};

/**
 * Retrieves the message count for members of a specified group.
 *
 * This function checks if the provided jid is a valid group identifier. If it is, it reads the message counts from a JSON file, filters the records to include only those related to the specified group with a positive count, and sorts them in descending order. Finally, it maps over the filtered records to create an array of objects containing the sender's information, their name, and the message count.
 *
 * @param {string} jid - The JID of the group whose members' message counts are to be retrieved.
 */
const getGroupMembersMessageCount = async (jid) => {
  if (!isJidGroup(jid)) return [];
  const messageCounts = await readJSON('message_count.json');
  const groupCounts = messageCounts
    .filter((record) => record.jid === jid && record.count > 0)
    .sort((a, b) => b.count - a.count);

  return Promise.all(
    groupCounts.map(async (record) => ({
      sender: record.sender,
      name: await getName(record.sender),
      messageCount: record.count,
    }))
  );
};

const getChatSummary = async () => {
  const messages = await readJSON('message.json');
  const distinctJids = [...new Set(messages.map((msg) => msg.jid))];

  const summaries = await Promise.all(
    distinctJids.map(async (jid) => {
      const chatMessages = messages.filter((msg) => msg.jid === jid);
      const messageCount = chatMessages.length;
      const lastMessage = chatMessages.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )[0];
      const chatName = isJidGroup(jid) ? jid : await getName(jid);

      return {
        jid,
        name: chatName,
        messageCount,
        lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null,
      };
    })
  );

  return summaries.sort(
    (a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
  );
};

const saveMessageV1 = saveMessage;
const saveMessageV2 = (message) => {
  return Promise.all([saveMessageV1(message), saveMessageCount(message)]);
};

module.exports = {
    saveContact,
    loadMessage,
    getName,
    getChatSummary,
    saveGroupMetadata,
    getGroupMetadata,
    saveMessageCount,
    getInactiveGroupMembers,
    getGroupMembersMessageCount,
    saveMessage: saveMessageV2,
};

// codes by JawadTechX 
