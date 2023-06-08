const { nanoid } = require("nanoid");
const Razorpay = require("razorpay");
const { Op } = require("sequelize-cockroachdb");

const createTxn = async (req, res) => {
  try {
    //get package info from the backend
    const _package = await req.db.package.findByPk(req.body.packageId);
    if (!_package) {
      return res.sendStatus(400).json({ message: "Invalid package" });
    }

    const reference_id = nanoid();
    const metaData = {
      reference_id,
      amount: _package.amount * 100,
      callback_method: "get",
      callback_url: process.env.CALLBACK_URL,
      currency: "INR",
      description: _package.name,
      options: {
        checkout: {
          name: "Algo Phoenix",
        },
      },
      notes: {
        packageId: _package.id,
      },
    };

    const resp = await req.razorpayInstance.paymentLink.create(metaData);
    const paymentURL = resp.short_url;
    //save in db
    //get user info from the token or whatever

    await req.db.payment.create({
      metaData,
      userId: 1,
      referenceId: reference_id,
      paymentURL,
      pgId: resp.id,
      amount: resp.amount,
    });
    return res.json({ paymentURL });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const getTxnStatus = async (req, res) => {
  try {
    const getpaymentStatus = await req.razorpayInstance.paymentLink.fetch(
      req.query.pgId
    );

    if (getpaymentStatus?.status === "paid") {
      //update in the db
      await req.db.payment.update(
        {
          status: "paid",
        },
        {
          where: {
            referenceId: getpaymentStatus.reference_id,
            pgId: getpaymentStatus.id,
            status: {
              [Op.not]: "paid",
            },
          },
        }
      );
    }

    return res.json({ status: getpaymentStatus?.status });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const handleWebhook = async (req, res) => {
  try {
    if (req.body?.event !== "payment_link.paid") {
      return res.sendStatus(400);
    }

    let { rawBody, headers, body } = req;

    const isValidSignature = Razorpay.validateWebhookSignature(
      rawBody,
      headers["x-razorpay-signature"],
      process.env.WEBHOOK_SECRET
    );

    if (!isValidSignature) {
      return res.sendStatus(400);
    }

    await req.db.payment.update(
      {
        status: body.payload.payment_link.entity.status,
        metaData: req.body,
      },
      {
        where: {
          pgId: body.payload.payment_link.entity.id,
          status: {
            [Op.not]: "paid",
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
  } finally {
    return res.sendStatus(200);
  }
};

module.exports = {
  createTxn,
  getTxnStatus,
  handleWebhook,
};
