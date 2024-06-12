import { Router, type Request, type Response } from 'express'
import { getRecipes, getDetailsRecipe } from '../../controllers'
import verifyToken from '../../middleWare'

const router = Router()

router.use('/recipes', verifyToken)
router.use('/recipes/:id', verifyToken)

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get a list of recipes
 *     description: Retrieve a list of recipes based on specified parameters.
 *     parameters:
 *       - in: query
 *         name: calories
 *         schema:
 *           type: string
 *         description: The maximum number of calories for the recipes.
 *       - in: query
 *         name: cuisineType
 *         schema:
 *          $ref: '#/components/schemas/TCuisineType'
 *         description: The cuisine type for the recipes.
 *       - in: query
 *         name: diet
 *         schema:
 *           $ref: '#/components/schemas/TDiet'
 *         description: The diet type for the recipes.
 *       - in: query
 *         name: dishType
 *         schema:
 *          $ref: '#/components/schemas/TDishType'
 *         description: The dish type for the recipes.
 *       - in: query
 *         name: excluded
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: An array of ingredients to be excluded from the recipes.
 *       - in: query
 *         name: from
 *         schema:
 *           type: number
 *         description: The starting index for pagination.
 *       - in: query
 *         name: health
 *         schema:
 *          $ref: '#/components/schemas/THealth'
 *         description: The health label for the recipes.
 *       - in: query
 *         name: mealType
 *         schema:
 *          $ref: '#/components/schemas/TMealType'
 *         description: The meal type for the recipes.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search query for the recipes.
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: The maximum time required for the recipes.
 *       - in: query
 *         name: _cont
 *         schema:
 *           type: string
 *         description: Additional content parameter.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/IRecipes'
 *       400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/recipes', async (req: Request, res: Response): Promise<void> => {
  const result = await getRecipes(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get details of a specific recipe
 *     description: Retrieve details of a specific recipe by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the recipe to retrieve.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IRecipeDetails'
 *       400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/IError'
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            type: string
 */
router.get('/recipes/:id', async (req: Request, res: Response): Promise<void> => {
  const result = await getDetailsRecipe(req, res)
  res.json(result)
  console.log(`Request: ${req.originalUrl}\n`)
})

export default router
