import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validate-request';
import { Roles } from '../_helpers/role';
import { userService } from './user.service';

const router = express.Router();

// Routes
router.get('/', getAll);
router.get('/:id', getByID);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

// Router functions
function getAll(req: Request, res: Response, next: NextFunction): void {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getByID(req: Request, res: Response, next: NextFunction): void {
    userService.getByID(Number(req.params.id)) // Convert ID to number
        .then(user => res.json(user))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    userService.create(req.body)
        .then(() => res.json({ message: 'User created successfully' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    userService.update(Number(req.params.id), req.body) // Convert ID to number
        .then(() => res.json({ message: 'User updated successfully' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    userService.delete(Number(req.params.id)) // Convert ID to number
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

// Schema validation functions
function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Roles.Admin, Roles.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });

    validateRequest(req, res, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid(Roles.Admin, Roles.User),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');

    validateRequest(req, res, next, schema);
}