const { Router } = require("express");
const handlers = require("../handlers");

const router = Router();

router.post("/rzp", handlers.payments.handleWebhook);
router.post("/", handlers.payments.createTxn);
router.get("/", handlers.payments.getTxnStatus);

module.exports = router;
