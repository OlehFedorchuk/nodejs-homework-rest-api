import express from 'express';
import contactsController from "../../controllers/contacts-controller.js";
const router = express.Router()



router.get('/', contactsController.getAll)

router.get('/:contactId', contactsController.getById)

router.post('/', contactsController.addById)

router.delete('/:contactId', contactsController.deleteById)

router.put('/:contactId', contactsController.updateById)

export default router;
