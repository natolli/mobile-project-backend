const { Car, User, Sequelize } = require("../models");
const { Op } = Sequelize;

const findAllAndCount = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    make,
    model,
    minPrice,
    maxPrice,
    year,
    bodyType,
    sortBy = "createdAt",
    sortOrder = "DESC",
  } = queryParams;

  const offset = (page - 1) * limit;
  const where = {};

  if (make) where.make = { [Op.iLike]: `%${make}%` };
  if (model) where.model = { [Op.iLike]: `%${model}%` };
  if (year) where.year = year;
  if (bodyType) where.bodyType = bodyType;

  if (minPrice && maxPrice) {
    where.price = { [Op.between]: [minPrice, maxPrice] };
  } else if (minPrice) {
    where.price = { [Op.gte]: minPrice };
  } else if (maxPrice) {
    where.price = { [Op.lte]: maxPrice };
  }

  const order = [[sortBy, sortOrder.toUpperCase()]];

  return Car.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order,
    include: {
      model: User,
      as: "owner",
      attributes: ["id", "firstName"],
    },
  });
};

const findById = (id, options = {}) => {
  return Car.findByPk(id, options);
};

const create = (carData) => {
  return Car.create(carData);
};

const update = async (id, updateData) => {
  await Car.update(updateData, { where: { id } });
  return findById(id);
};

const deleteById = (id) => {
  return Car.destroy({ where: { id } });
};

const search = (query) => {
  const searchQuery = {
    [Op.or]: [
      { make: { [Op.iLike]: `%${query}%` } },
      { model: { [Op.iLike]: `%${query}%` } },
      { description: { [Op.iLike]: `%${query}%` } },
    ],
  };
  return Car.findAll({ where: searchQuery });
};

module.exports = {
  findAllAndCount,
  findById,
  create,
  update,
  deleteById,
  search,
};
