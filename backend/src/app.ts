import config from './config'
import cors from 'cors'
import express from 'express'
import router from './routes'
import specs from './swaggerOptions'
import swaggerUi from 'swagger-ui-express'
import admin from 'firebase-admin'
import fs from 'fs'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()
const data = {
  type: config.firebase.type,
  project_id: config.firebase.project_id,
  private_key_id: config.firebase.private_key_id,
  private_key: config.firebase.private_key?.replace(/\\n/g, '\n'),
  client_email: config.firebase.client_email,
  client_id: config.firebase.client_id,
  auth_uri: config.firebase.auth_uri,
  token_uri: config.firebase.token_uri,
  auth_provider_x509_cert_url: config.firebase.auth_provider_x509_cert_url,
  client_x509_cert_url: config.firebase.client_x509_cert_url,
  universe_domain: config.firebase.universe_domain,
}

const filePath = 'secret.json'

fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

/* eslint-disable @typescript-eslint/no-var-requires */
const serviceAccount = require('../secret.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const app = express()
const port = config.server.port ?? 8080

// Middleware to parse application/octet-stream requests
app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }))

const corsOptions = {
  origin: config.server.origin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(router)

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Express API!' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
