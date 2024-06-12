import { Router, type Request, type Response } from 'express'
import { getFoods } from '../../controllers'
import verifyToken from '../../middleWare'

const router = Router()

router.use('/foods', verifyToken)

/**
 * @swagger
 * /foods:
 *  get:
 *    summary: Get a list of foods by keyword search
 *    description: Retrieve a list of foods based on specified parameters.
 *    parameters:
 *      - in: query
 *        name: nextPage
 *        schema:
 *          type: string
 *        description: The next page token. REQUIRED if 'upc' is specified. NOT REQUIRED if 'upc' is not specified.
 *      - in: query
 *        name: ingr
 *        schema:
 *          type: string
 *        description: A keyword search parameter to be found in the food name. REQUIRED if 'upc' and 'brand' are not specified. NOT REQUIRED if 'brand' is specified. DO NOT POPULATE if 'upc' is specified.
 *        required: true
 *    responses:
 *      200:
 *        description: A list of foods.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IFoods'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/IError'
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *            type: string
 */

router.get('/foods', async (req: Request, res: Response): Promise<void> => {
  const result = await getFoods(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

export default router
