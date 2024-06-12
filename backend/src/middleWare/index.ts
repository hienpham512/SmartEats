import admin from 'firebase-admin'
import { type NextFunction } from 'express'

/* eslint-disable @typescript-eslint/no-explicit-any */
const verifyToken = async (req: any, res: any, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).send('You are not authorized')
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).send('Invalid Authorization header format')
  }

  const token = authorization.split(' ')[1] // Extract the token without the "Bearer " prefix

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.userId = decodedToken.uid
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).send('You are not authorized')
  }
}

export default verifyToken
