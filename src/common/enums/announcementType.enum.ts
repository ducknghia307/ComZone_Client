export enum AnnouncementType {
  ORDER_NEW = "ORDER_NEW",
  ORDER_CONFIRMED = "ORDER_CONFIRMED",
  ORDER_DELIVERY = "ORDER_DELIVERY",
  ORDER_FAILED = "ORDER_FAILED",
  AUCTION = "AUCTION",
  EXCHANGE_NEW_REQUEST = "EXCHANGE_NEW_REQUEST",
  EXCHANGE_APPROVED = "EXCHANGE_APPROVED",
  EXCHANGE_REJECTED = "EXCHANGE_REJECTED",
  EXCHANGE_NEW_DEAL = "EXCHANGE_NEW_DEAL",
  EXCHANGE_PAY_AVAILABLE = "EXCHANGE_PAY_AVAILABLE",
  EXCHANGE_DELIVERY = "EXCHANGE_DELIVERY",
  EXCHANGE_SUCCESSFUL = "EXCHANGE_SUCCESSFUL",
  EXCHANGE_FAILED = "EXCHANGE_FAILED",
  DELIVERY_PICKING = "DELIVERY_PICKING",
  DELIVERY_ONGOING = "DELIVERY_ONGOING",
  DELIVERY_FINISHED_SEND = "DELIVERY_FINISHED_SEND",
  DELIVERY_FINISHED_RECEIVE = "DELIVERY_FINISHED_RECEIVE",
  DELIVERY_FAILED_SEND = "DELIVERY_FAILED_SEND",
  DELIVERY_FAILED_RECEIVE = "DELIVERY_FAILED_RECEIVE",
  DELIVERY_RETURN = "DELIVERY_RETURN",
  TRANSACTION_SUBTRACT = "TRANSACTION_SUBTRACT",
  TRANSACTION_ADD = "TRANSACTION_ADD",
}
