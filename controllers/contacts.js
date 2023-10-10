
// import * as contactsService from '../models/contacts.js'
import { HttpError } from '../helpers/HttpError.js';
import Contact from '../models/contact.js';



const getAll =  async (req, res) => {
    const result = await Contact.find();
    res.json(result)
  }
const add = async (req, res)=>{
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  }

const getById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await contactsService.getContactById(contactId);
      if (!result) {
        throw HttpError(404);
      }
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
  
const addById = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body)
      if (error) {
        throw HttpError(400, error.message)
      }
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result)
      console.log(result)
    } catch (error) {
      next(error)
    }
  }
  
const deleteById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await contactsService.removeContact(contactId);
      if (!result) {
        throw HttpError(404);
      }
      res.json({
        message: "contact deleted"
      })
    } catch (error) {
      next(error)
    }
  }
  
const updateById = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body)
      if (error) {
        throw HttpError(400, error.message)
      }
  
      const { contactId } = req.params;
  
      const result = await contactsService.updateContact(contactId, req.body);
  
      if (!result) {
        throw HttpError(404, `Contatct with id ${contactId} not found.`);
      }
  
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
  
export default {
    getAll,
    add,
    getById,
    addById,
    updateById,
    deleteById,
  }