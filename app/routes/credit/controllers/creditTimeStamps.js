import moment from 'moment'
import credit_timestamps from '../../../model/creditTimestamps.model'
import { uniqueCode } from '../../../utils/constants'

export const creditTimeStamps = () => {
  return {
    save: async (userId, getUser) => {
      const time = moment().utcOffset(7).format('YYYYMMDDHHmm')
      let transactionId = `${userId}${time}`
      let res = ''
      const saveCreditTimeStamp = new credit_timestamps({
        transaction_id: transactionId,
        user_id: userId,
        init_credit: getUser.init_credit,
        remaining_credit: getUser.remaining_credit,
        child_credit: getUser.child_credit,
        bet: getUser.bet,
        own_amount: getUser.own_amount,
        recieve_amount: getUser.recieve_amount,
        send_amount: getUser.send_amount,
        created_at: moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss'),
        transaction_success: false
      })
      await saveCreditTimeStamp.save().then((product) => {
        res = product
      })
      return res.transaction_id
    },
    update: async (idUser) => {
      // console.log(id)
      await credit_timestamps.update({ transaction_id: idUser }, { $set: { transaction_success: true } })
    },
    check: async (id) => {
      const getCreditTimeStamp = await credit_timestamps.findOne({ transaction_id: id })
      return getCreditTimeStamp
    }
  }
}