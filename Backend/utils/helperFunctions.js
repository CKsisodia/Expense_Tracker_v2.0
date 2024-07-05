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
exports.dateOnly = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

exports.getPagination = (page, pageSize) => {
  const limit = pageSize ? parseInt(pageSize) : 10;
  const offset = page ? parseInt(page) * limit : 0;
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
  return {
    [Op.or]: [
      { category: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ],
  };
};

exports.viewFilter = (view) => {
  if (!view) return {};
  let startDate, endDate;

  switch (view) {
    case "daily":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "weekly":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      // startDate = new Date();
      // startDate.setDate(startDate.getDate() - 29);
      // startDate.setHours(0, 0, 0, 0);
      // endDate = new Date();
      // endDate.setHours(23, 59, 59, 999);
      // Get the current date
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth()-1,
        1,
        0,
        0,
        0,
        0
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
        0,
        0,
        0,
        0
      );
      break;
    default:
      return {};
  }

  console.log(startDate, endDate, "ckckckkc");

  return {
    createdAt: {
      [Op.between]: [startDate, endDate],
    },
  };
};
