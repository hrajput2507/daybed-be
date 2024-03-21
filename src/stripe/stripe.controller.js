require('dotenv').config()
const helper = require("../../util/helper");
const stripe = require('stripe')("sk_test_51JmtgaSCDtmHA3xfza1Eu4Ifc33pGgVUJHHgsElSNNDXushvc8YZPPe6RFhLFlyMwA1OrF7L86y3Gz01GCk1evZe00qXCHYiMh");
// sk_test_51JmtgaSCDtmHA3xfza1Eu4Ifc33pGgVUJHHgsElSNNDXushvc8YZPPe6RFhLFlyMwA1OrF7L86y3Gz01GCk1evZe00qXCHYiMh
// sk_test_51O4HP9IltrPbSQX995wocG5W5W6xQ4JYGx5ZejTfDchdVOUgH7Hgf0py5xuurs8WbstRCmZIBAM4i0TUa6QsRAzG00e5CaNKPa
const { StripeCurrency } = require("../../util/constants")
const DB = require('../../sequelize/db-wrappers')


async function createPaymentIntent(req, res) {
  console.log("🚀 ~ file: stripe.controller.js:11 ~ createPaymentIntent ~ req:", req.body)
  try {
    if (req.body?.amount < 1) {
      return helper.sendResponse(
        {
          hasError: true,
          status: 400,
          message: 'Invalid amount The payment intent could not be created',
        },
        res
      );
    }

    const order = await stripe.paymentIntents.create({
      amount: req.body?.amount,
      currency: StripeCurrency.USD,
      description: 'hey this is a dummy',
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
      automatic_payment_methods: { enabled: true },
      // metadata: { orderId: orderId },
    });

    console.log("🚀 ~ file: stripe.controller.js:31 ~ createPaymentIntent ~ order:", order);
    const paymentData = {
      base_price: req.body?.amount,
      created_by: req.userInfo?.id,
      payment_id: order.id,
      // payment_status : "Created"
      total_amount: req.body?.amount
    }
    // save Payment Intent in db
    await DB.payments.createPayment({
      ...paymentData,
      // reservation_id: reservation.id
    })
    return helper.sendResponse({ clientSecret: order.client_secret }, res);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    // Print out the specific error details
    console.error("Stripe error details:", error.stripe && error.stripe.error);
    return helper.sendResponse(
      {
        hasError: true,
        status: 500,
        message: 'Internal server error',
      },
      res
    );
  }
}

async function verifyPaymentStripe(req, res) {
  const { id } = req.body;

  try {
    // Retrieve the payment intent to verify its status
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    const getPayment = await DB.payments.getPaymentById({ payment_id: id, created_by: req.userInfo.id })
    console.log("🚀 ~ file: stripe.controller.js:78 ~ verifyPaymentStripe ~ getPayment:", getPayment)

    getPayment.payment_status = paymentIntent.status
    await getPayment.save(getPayment)

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment verification failed');
    }

    // If the payment intent status is 'succeeded', the payment has been verified
    res.json({ message: 'Payment verified successfully', id: paymentIntent.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Payment verification failed');
  }
}


module.exports = { createPaymentIntent, verifyPaymentStripe };
