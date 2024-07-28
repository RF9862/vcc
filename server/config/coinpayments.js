import Coinpayments from "coinpayments";

import { COINPAYMENT_PRIVATE_KEY, COINPAYMENT_PUBLIC_KEY } from "./index.js";

const client = new Coinpayments({
  key: COINPAYMENT_PUBLIC_KEY,
  secret: COINPAYMENT_PRIVATE_KEY,
});

export default client;
