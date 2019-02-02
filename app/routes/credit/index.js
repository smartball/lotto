

import express from 'express'
import { handleAPI } from './controllers'

const router = express.Router()
router.post('/', async (req, res) => {
  // console.log(req)
  if (req.body.method) {
    const response = await handleAPI(req.body, res)
    res.json(response)
  }
  else {
    res.json('method error')
  }
})

export default router

