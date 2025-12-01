import { Router } from 'express';
import * as ideaController from '../controllers/idea.controller';

const router = Router();

// GET routes
router.get('/', ideaController.getAllIdeas);
router.get('/unseen', ideaController.getUnseenIdeas);
router.get('/status/:status', ideaController.getIdeasByStatus);
router.get('/student/:studentId', ideaController.getIdeasByStudent);
router.get('/:id', ideaController.getIdeaById);

// POST routes
router.post('/', ideaController.createIdea);

// PUT routes
router.put('/:id', ideaController.updateIdea);
router.put('/:id/seen', ideaController.markIdeaAsSeen);

// DELETE routes
router.delete('/:id', ideaController.deleteIdea);

export default router;
