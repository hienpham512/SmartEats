import * as recipesRoute from './recipes'
import * as exercisesRoute from './exercises'
import * as foodsRoute from './foods'
import * as mealPlannerRoute from './mealPlanner'
import * as foodDetectionsRoute from './foodDetections'
import { Router } from 'express'

const router = Router()

router.use(recipesRoute.default)
router.use(exercisesRoute.default)
router.use(foodsRoute.default)
router.use(mealPlannerRoute.default)
router.use(foodDetectionsRoute.default)

export default router
