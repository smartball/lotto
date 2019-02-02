import mongoose, { Schema } from "mongoose"

const credit_timestamps = new Schema({
    transaction_id: Number,
    user_id: Number,
    init_credit: Number,
    remaining_credit: Number,
    child_credit: Number,
    bet: Number,
    own_amount: Number,
    recieve_amount: Number,
    send_amount: Number,
    created_at: String,
    updated_at: String,
    transaction_success: Boolean
})

module.exports = mongoose.model('credit_timestamps', credit_timestamps)