import express from 'express';
import contactsController from "../../controllers/contacts.js";

import {authenticate, isEmptyBody, isEmptyBodyPUT} from "../../middlewars/index.js";
import { isValidId } from "../../middlewars/index.js";

const router = express.Router()

router.get('/', authenticate, contactsController.getAll)

router.get('/:contactId', authenticate, isValidId, contactsController.getById)

router.post('/',authenticate, isEmptyBodyPUT, contactsController.add)

router.delete('/:contactId', authenticate, contactsController.deleteById)

router.put('/:contactId', authenticate, isValidId, isEmptyBodyPUT, contactsController.updateById)

router.patch('/:contactId/favorite', authenticate, isValidId, isEmptyBody, contactsController.updateStatusContact)

export default router;
