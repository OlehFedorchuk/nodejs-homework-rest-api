
import fs from 'fs/promises';
import path from 'path';
// import { nanoid } from 'nanoid';

const contactsPath = path.resolve("models", "contacts", "contacts.json");

  const updateContacts = allContacts => {
    fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  }

export const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
 return JSON.parse(contacts);

  };
 
// export const getContactById = async(id)=> {
//   const contacts = await listContacts();
//   const result = contacts.find(item => item.id === id);
//   return result || null;
// }

// export const addContact = async ({name, email, phone}) => {
//   const contacts = await listContacts();
//   const newContacts = {
//     id: nanoid(),
//     name,
//     email,
//     phone,
//   }
//   contacts.push(newContacts);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return newContacts;
// }
// export const removeContact = async (id) => {
// const allContacts = await listContacts();
// const index = allContacts.findIndex(item => item.id === id);
// if(index === -1){
//   return null;
// }
// const [result] = allContacts.splice(index, 1);
// updateContacts(allContacts);
// return result;
// }



