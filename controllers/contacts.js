
import { HttpError } from '../helpers/HttpError.js';
import Contact, { contactAddSchema, contactFavoriteSchema } from '../models/contact.js';
import { ctrlWrapper } from '../decorators/ctrlWrapper.js';

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { favorite } = req.query;

  const filter = favorite === "true" || favorite === "false" ? { favorite: favorite === "true", owner } : { owner };

  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find(filter, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email password");
  res.json(result);
};

const getById = async (req, res) => {
    
      const { contactId } = req.params;
      const result = await Contact.findById(contactId);
      if (!result) {
        throw HttpError(404);
      }
      res.json(result)
  
  }

  const add = async (req, res) => {
    
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result)
  }

const addById = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body)
      if (error) {
        throw HttpError(400, error.message)
      }
      const result = await Contact.addContact(req.body);
      res.status(201).json(result)
      console.log(result)
    } catch (error) {
      next(error)
    }
  }
  
const deleteById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await Contact.findByIdAndDelete(contactId);
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
  
      const result = await Contact.findByIdAndUpdate(contactId, req.body);
  
      if (!result) {
        throw HttpError(404, "Not found");
      }
  
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
  const updateStatusContact = async (req, res ) => {
    const { error } = contactFavoriteSchema.validate(req.body)
    if (error) {
        throw HttpError(400, error.message)
    }
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result)
};

  
export default {
    getAll: ctrlWrapper(getAll),
    add: ctrlWrapper(add),
    getById: ctrlWrapper(getById),
    addById: ctrlWrapper(addById),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
  }