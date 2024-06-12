import { Router } from 'express'
import {
  getExercises,
  getExerciseName,
  getExercisesBodyPart,
  getExercisesEquipment,
  getExercisesTarget,
  getExerciseId,
} from '../../controllers'
import verifyToken from '../../middleWare'

const router = Router()

router.use('/exercises', verifyToken)
router.use('/exercises/name/:name', verifyToken)
router.use('/exercises/body-part/:bodyPart', verifyToken)
router.use('/exercises/equipment/:equipment', verifyToken)
router.use('/exercises/target/:target', verifyToken)
router.use('/exercises/exercise/:id', verifyToken)

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Get a list of exercises
 *     description: Retrieve a list of exercises.
 *     responses:
 *      200:
 *       description: A list of exercises.
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/IExercise'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/exercises', async (req, res) => {
  const result = await getExercises(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

/**
 * @swagger
 * /exercises/name/{name}:
 *   get:
 *     summary: Get a list of exercises by name
 *     description: Retrieve a list of exercises by name.
 *     parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        description: The name of the exercise to retrieve.
 *     responses:
 *      200:
 *       description: A list of exercises.
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/IExercise'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/exercises/name/:name', async (req, res) => {
  const result = await getExerciseName(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

/**
 * @swagger
 * /exercises/name/{id}:
 *   get:
 *     summary: Get details of a specific exercise
 *     description: Retrieve details of a specific exercise by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the exercise to retrieve.
 *     responses:
 *      200:
 *         description: Successful response
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IExercise'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/exercises/exercise/:id', async (req, res) => {
  const result = await getExerciseId(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

/**
 * @swagger
 * /exercises/body-part/{bodyPart}:
 *   get:
 *     summary: Get a list of exercises by body part
 *     description: Retrieve a list of exercises by body part.
 *     parameters:
 *      - in: path
 *        name: bodyPart
 *        schema:
 *         $ref: '#/components/schemas/BodyPart'
 *        description: The body part of the exercise to retrieve.
 *     responses:
 *      200:
 *       description: A list of exercises.
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/IExercise'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/exercises/body-part/:bodyPart', async (req, res) => {
  const result = await getExercisesBodyPart(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

/**
 * @swagger
 * /exercises/equipment/{equipment}:
 *   get:
 *     summary: Get a list of exercises by equipment
 *     description: Retrieve a list of exercises by equipment.
 *     parameters:
 *      - in: path
 *        name: equipment
 *        schema:
 *         $ref: '#/components/schemas/Equipment'
 *        description: The equipment of the exercise to retrieve.
 *     responses:
 *      200:
 *       description: A list of exercises.
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/IExercise'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/exercises/equipment/:equipment', async (req, res) => {
  const result = await getExercisesEquipment(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

/**
 * @swagger
 * /exercises/target/{target}:
 *   get:
 *     summary: Get a list of exercises by target
 *     description: Retrieve a list of exercises by target.
 *     parameters:
 *      - in: path
 *        name: target
 *        schema:
 *         $ref: '#/components/schemas/Target'
 *        description: The target of the exercise to retrieve.
 *     responses:
 *      200:
 *       description: A list of exercises.
 *       content:
 *        application/json:
 *         schema:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/IExercise'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/exercises/target/:target', async (req, res) => {
  const result = await getExercisesTarget(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})
export default router
