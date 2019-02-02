import { initUserCredit, updateUserCredit, tranferAffiliate, tranferAmount, summaryCompensate } from '../../../utils/functions'
import credit_timestamps from '../../../model/creditTimestamps.model'
import users from '../../../model/users.model'
import { uniqueCode } from '../../../utils/constants'
import { creditTimeStamps } from './creditTimeStamps'
import { userService } from './users'
import moment from 'moment'


export const handleAPI = async (data, res) => {
  let response = null
  const time = moment().utcOffset(7).format('YYYYMMDDHHmm')
  const userId = 1 // fig userId
  let idMe = data.data.me_id
  let idUser = data.data.user_id
  let transactionIdUser = `${idUser}${time}`
  let transactionIdMe = `${idMe}${time}`
  const getUser = await users.findOne({ id: idUser })
  const getMe = await users.findOne({ id: userId })
  const checkTransaction = await creditTimeStamps().check(transactionIdUser)
  if (!checkTransaction) {
    try {
      await creditTimeStamps().save(idUser, getMe)
      await creditTimeStamps().save(idMe, getUser)
    } catch (err) {
      console.log('save err', err)
    }
  }
  if (data.method === 'initUserCredit') {
    const responseInit = initUserCredit(data.data.credit, getMe, getUser)
    await userService().update(responseInit.user.id, responseInit.user)
    await userService().update(responseInit.me.id, responseInit.me)
    response = responseInit.message
  }
  else if (data.method === 'updateUserCredit') {
    const responseUpdateUserCredit = updateUserCredit(data.data.credit, data.data.myLoginName, getMe, getUser)
    await userService().update(responseUpdateUserCredit.user.id, responseUpdateUserCredit.user)
    await userService().update(responseUpdateUserCredit.me.id, responseUpdateUserCredit.me)
    response = responseUpdateUserCredit.message
  }
  else if (data.method === 'tranferAffiliate') {
    const responseTranferAffiliate = tranferAffiliate(data.data.credit, getMe, getUser)
    await userService().update(responseTranferAffiliate.user.id, responseTranferAffiliate.user)
    await userService().update(responseTranferAffiliate.me.id, responseTranferAffiliate.me)
    response = responseTranferAffiliate.message
  }
  else if (data.method === 'tranferAmount') {
    const responseTranferAmount = tranferAmount(data.data.amount, getMe, getUser)
    await userService().update(responseTranferAmount.user.id, responseTranferAmount.user)
    await userService().update(responseTranferAmount.me.id, responseTranferAmount.me)
    response = responseTranferAmount.message
  }
  else if (data.method === 'summaryCompensate') {
    const responseSummaryCompensate = summaryCompensate(data.data.amount, getMe, getUser)
    await userService().update(responseSummaryCompensate.user.id, responseSummaryCompensate.user)
    await userService().update(responseSummaryCompensate.me.id, responseSummaryCompensate.me)
    response = responseSummaryCompensate.message
  }
  else if (data.method === 'getUser') {
    const getMe = await users.findOne({ id: idMe })
    console.log(getMe)
    response = getMe
  }
  else {
    response = {
      transaction_id: 123,
      data: {},
      statusCode: 200,
      successful: false,
      message: 'Missing method'
    }
  }
  if (response) {
    await creditTimeStamps().update(transactionIdUser)
    await creditTimeStamps().update(transactionIdMe)
    return response
  }
}
