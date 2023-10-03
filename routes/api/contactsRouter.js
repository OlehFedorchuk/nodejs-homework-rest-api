import express from 'express';
import contactsController from "../../controllers/contacts-controller.js";

import {isEmptyBody} from "../../middlewars/index.js";
const router = express.Router()



router.get('/', contactsController.getAll)

router.get('/:contactId', contactsController.getById)

router.post('/', isEmptyBody, contactsController.addById)

router.delete('/:contactId', contactsController.deleteById)

router.put('/:contactId', isEmptyBody, contactsController.updateById)

export default router;
