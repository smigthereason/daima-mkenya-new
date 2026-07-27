// sanity/schemaTypes/deliveryDetails.ts
export default {
  name: "deliveryDetails",
  title: "Delivery Details",
  type: "object",
  fields: [
    {
      name: "method",
      title: "Delivery Method",
      type: "string",
      options: {
        list: [
          { title: "Home Delivery / Drop-Off", value: "shipping" },
          { title: "Pickup Station", value: "pickup" },
        ],
      },
    },
    { name: "city", title: "City/County", type: "string" },
    { name: "pickupStationName", title: "Pickup Station Name", type: "string" },
    { name: "pickupStationId", title: "Pickup Station ID", type: "string" },
    {
      name: "shippingAddress",
      title: "Street Address/Building/Floor",
      type: "string",
    },
    { name: "additionalInfo", title: "Additional Info", type: "text" },
  ],
};
