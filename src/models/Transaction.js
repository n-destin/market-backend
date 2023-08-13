import mongoose, {Schema} from "mongoose";

const transactionCases = {
    BUY : 'BUY',
    RENT : 'RENT',
}

export const paymentStatus = {
    PAYMENT_INITIATED : 'PAYMENT_INITIATED',
    PAYMENT_FAILED : 'PAYMENT_FAILED',
    PAID_PRODUCT_NOT_RECIEVED : 'PAID_BUT_NOT_RECIEVED',
    PAID_AND_RECIEVED : 'PAID_AND_RECIEVED',
}

const transactionSchema = new Schema(
    {
        TransactionType: {
            type: String,
            enum: transactionCases,
        },
        Product : Schema.Types.ObjectId,
        Buyer : Schema.Types.ObjectId, // also stands for someone who rent something from the seller who also act as someone who rent our something
        Seller : Schema.Types.ObjectId,
        TransactionTime : Date,
        TransactionAmount :  Schema.Types.Decimal128, // don't need to get the transcationn from the product since there might some much more money involved, maybe 
        paymentStatus : {type: String, enum: paymentStatus, default : paymentStatus.PAID_PRODUCT_NOT_RECIEVED}
    },
    {
        toJSON : {virtuals : true},
        toObject : {virtuals : true}
    }
)

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;