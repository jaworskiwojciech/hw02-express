const fs = require("node:fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  try {
    const response = await fs.readFile(contactsPath);
    const contacts = JSON.parse(response);
    return contacts;
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const matchedContact = contacts.filter(
      (contact) => contact.id === contactId
    );
    return matchedContact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactToDelete = contacts.filter(
      (contact) => contact.id === contactId
    );
    if (contactToDelete !== undefined) {
      const { name } = contactToDelete;
      const restOfContacts = contacts.filter(
        (contact) => contact.id !== contactId
      );
      fs.writeFile(contactsPath, JSON.stringify(restOfContacts, null, 2));
      console.log(`${name} has deleted!`);
    }
    return;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const contacts = await listContacts();
    if (name && email && phone) {
      const newContact = { id: nanoid(), name, email, phone };
      contacts.push(newContact);
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const indexToUpdate = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (indexToUpdate === -1) {
      return;
    } else {
      contacts[indexToUpdate] = { ...contacts[indexToUpdate], ...body };
      fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
