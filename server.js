import express from 'express'
import routes from './routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
