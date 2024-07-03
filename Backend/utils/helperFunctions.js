const { Op } = require("sequelize");

exports.dateForFileName = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `D-${day}-${month}-${year}-T-${hours}:${minutes}:${seconds}`;
};

exports.getPagination = (page, pageSize) => {
  const limit = pageSize ? parseInt(pageSize) : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.getSorting = (sortBy, sortOrder) => {
  const validSortOrder = ["ASC", "DESC"];
  const order = validSortOrder.includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";
  return [[sortBy || "createdAt", order]];
};

exports.getSearching = (search) => {
  if (!search) return {};
  console.log(search)
  return {
    [Op.or]: [
      { category: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ],
  };
};
