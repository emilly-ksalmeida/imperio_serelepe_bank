export default function calculateOrderTotal(list) {
  let total = 0;
  list.forEach((item) => {
    const result = item.quantity * item.unitPriceOrdered;
    total = total + result;
  });
  return total;
}
