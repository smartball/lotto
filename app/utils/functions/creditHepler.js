import moment from 'moment'
export const initUserCredit = (credit, me, user) => {
  const res = {
    transaction_id: 123,
    data: {},
    statusCode: 200,
    successful: true,
    message: 'โอนเงินสำเร็จ'
  }
  if (me.remaining_credit < credit) {
    credit = me.remaining_credit;
  }

  me.remaining_credit -= credit;
  me.child_credit += credit;
  me.updated_at = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss')

  user.init_credit = credit;
  user.remaining_credit = credit;
  user.child_credit = 0;
  user.bet = 0;
  user.updated_at = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
  const reData = { message: res, me, user }
  // console.log(reData)
  return reData
}

export const updateUserCredit = (credit, myLoginName, me, user) => {
  let res = {}
  if (credit > 0) {
    if (myLoginName === 'manual.config') {
      if (me.remaining_credit < credit) {
        return {
          message: {
            transaction_id: 123,
            data: {},
            statusCode: 200,
            successful: false,
            error_code: 1,
            message: 'วงเงินของคุณไม่พอสำหรับโอนเงินให้สมาชิกที่อยู่ภายใต้คุณ'
          },
          me, user
        }
      }
      me.remaining_credit -= credit
      me.child_credit += credit
    }
    user.init_credit += credit
    user.remaining_credit += credit
  } else {
    const pCredit = (-1) * credit
    if (user.remaining_credit < pCredit) {
      return {
        message: {
          transaction_id: 123,
          data: {},
          statusCode: 200,
          successful: false,
          error_code: 2,
          message: 'ไม่สามารถถอนเกินวงเงินของสมาชิกได้'
        },
        me, user
      }
    }
    if (myLoginName === 'manual.config') {
      me.remaining_credit -= pCredit
      me.child_credit += pCredit
    }
    user.init_credit += pCredit
    user.remaining_credit += pCredit
  }
  me.updated_at = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
  user.updated_at = moment().utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
  const reData = {
    message: {
      transaction_id: 123,
      data: {},
      statusCode: 200,
      successful: true,
      message: 'โอนเงินสำเร็จ'
    },
    me, user
  }
  return reData
}

export const addTicket = (user, amount) => {
  let res = {}
  if (user.remaining_credit < amount) {
    res = {
      successful: false,
      error_code: 1,
      message: 'เครดิตไม่พอ'
    }
  } else {
    user.remaining_credit -= amount
    user.bet += amount
    res = {
      successful: true,
      message: 'หักเครดิตสมบูรณ์',
      uncommited_object: user
    }
  }
  // เหลือต่อกับ db
  return res
}

export const ticketCompensate = (user, ticket) => {
  user.send_amount += (ticket.arrearage - ticket.bet)
  user.own_amount = (user.recieve_amount - user.send_amount)

  /// arrearage = ผลตอบแทนรวมต้น
  user.remaining_credit += ticket.arrearage
  user.bet -= ticket.bet
  const res = {
    transaction_id: 123,
    successful: true,
    message: 'หักเครดิตสมบูรณ์'
  }
  return res
}

export const summaryCompensate = (user, summary) => {
  user.recieve_amount += (-1) * summary.receive_amount
  user.own_amount += (-1) * summary.own_amount
  user.send_amount += (-1) * summary.send_amount
  user.remaining_credit += (-1) * summary.send_amount

  // เหลือต่อกับ db
  const res = {
    transaction_id: 123,
    successful: true,
    message: 'หักเครดิตสมบูรณ์'
  }
  return res
}

export const tranferAmount = (amount, me, user) => {
  let res = {}
  if (user.remaining_credit < amount) {
    return {
      message: {
        transaction_id: 123,
        successful: false,
        error_code: 2,
        message: 'เครดิตไม่พอ'
      }, me, user
    }
  }
  me.recieve_amount -= amount
  user.send_amount -= amount
  user.remaining_credit -= amount

  me.own_amount = me.recieve_amount - me.send_amount
  user.own_amount = user.recieve_amount - user.send_amount
  // เหลือต่อกับ db

  return {
    message: {
      transaction_id: 123,
      successful: true,
      message: 'หักเครดิตสมบูรณ์'
    }, me, user
  }
}

export const tranferAffiliate = (credit, me, user) => {
  const send_amount = user.send_amount
  let res = {
    transaction_id: 123,
    successful: true,
    message: 'โอนเงินสำเร็จ'
  }
  if (me.remaining_credit < send_amount) {
    return {
      message: {
        transaction_id: 123,
        successful: false,
        error_code: 1,
        message: 'วงเงินของคุณไม่พอสำหรับโอนเงินให้สมาชิกที่อยู่ภายใต้คุณ'
      }, me, user
    }
  }
  if (me.remaining_credit < 0) {
    return {
      message: {
        transaction_id: 123,
        successful: false,
        error_code: 2,
        message: 'วงเงินของคุณไม่พอสำหรับโอนเงินให้สมาชิกที่อยู่ภายใต้คุณ'
      }, me, user
    }
  }
  me.remaining_credit -= send_amount
  me.child_credit += send_amount
  user.init_credit += send_amount

  me.recieve_amount -= send_amount
  user.send_amount -= send_amount

  me.own_amount = me.recieve_amount - me.send_amount
  user.own_amount = user.recieve_amount - user.send_amount

  // Update Credit

  if (credit >= 0) {
    ///user deposit
    if (me.remaining_credit < credit) {
      return {
        message: {
          transaction_id: 123,
          successful: false,
          error_code: 3,
          message: 'วงเงินของคุณไม่พอสำหรับโอนเงินให้สมาชิกที่อยู่ภายใต้คุณ'
        }, me, user
      }
    }
    me.remaining_credit -= credit;
    me.child_credit += credit;

    user.init_credit += credit;
    user.remaining_credit += credit;
  } else {
    const pCredit = (-1) * credit
    if (user.remaining_credit < pCredit) {
      return {
        message: {
          transaction_id: 123,
          successful: false,
          error_code: 4,
          message: 'ไม่สามารถถอนเกินวงเงินของสมาชิกได้'
        }, me, user
      }
    }
    me.remaining_credit += pCredit;
    me.child_credit -= pCredit;

    user.init_credit -= pCredit;
    user.remaining_credit -= pCredit;
  }
  // เหลือต่อกับ db
  return { message: res, me, user }
}