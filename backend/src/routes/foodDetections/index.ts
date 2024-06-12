import { Router, type Request, type Response } from 'express'
import verifyToken from '../../middleWare'
import { getFoodDetections } from '../../controllers'

const router = Router()

router.use('/food-detections', verifyToken)

// add swagger docs

/**
 * @swagger
 * /food-detections:
 *   post:
 *     summary: Get food detections
 *     description: Get food detections
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: string
 *             format: binary
 *     responses:
 *       200:
 *         description: A list of food detections
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IFoodDetected'
 *       400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *            type: string
 */
router.post('/food-detections', async (req: Request, res: Response): Promise<void> => {
  const result = await getFoodDetections(req, res)

  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

export default router
