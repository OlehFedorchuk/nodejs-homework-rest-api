import express from 'express';
import contactsController from "../../controllers/contacts.js";

import {isEmptyBody, isEmptyBodyPUT} from "../../middlewars/index.js";
import { isValidId } from "../../middlewars/IsValidld.js";

const router = express.Router()

router.get('/', contactsController.getAll)

router.get('/:contactId',isValidId, contactsController.getById)

router.post('/', isEmptyBody, contactsController.add)

router.delete('/:contactId', contactsController.deleteById)

router.put('/:contactId', isValidId, isEmptyBodyPUT, contactsController.updateById)

router.patch('/:contactId/favorite', isValidId, isEmptyBody, contactsController.updateStatusContact)

export default router;
