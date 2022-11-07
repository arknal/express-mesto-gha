const apiError = require('../error/ApiError');

module.exports.checkType = (item, type) => {
  // item: { 'name': someName, 'value': someValue }, type: string

  const { name, value } = item;

  const valueType = typeof value;

  if (!(valueType === type)) {
    throw apiError.badRequest(`Ошибка. Тип данных ${name} ${valueType}, ожидалось ${type}`);
  }
};
