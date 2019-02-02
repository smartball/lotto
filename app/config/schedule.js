import schedule from 'node-schedule'
import fs from 'fs'
import path from 'path'

const startJob = async () => {
    // const message = `exports.accessToken = '${dataToken}'\n exports.accessTokenPrivilege = '${dataTokenPrivilege}'`
    const message = `export const uniqueCode = ${Date.now()}`
    const pathDir = path.join(__dirname, '../utils/constants/uniqueCode.js')
      fs.writeFileSync(pathDir, message, (err) => {
        if (err) throw err;
        console.log('Saved!')
      })
  }
  export const scheduleRenewUniqueCode = () => {
    // startJob()
    schedule.scheduleJob('*/5 * * * *', startJob)
  }