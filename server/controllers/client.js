import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithStatsArray = await ProductStat.find(
      {
        productId: {
          $in: products.map((product) => product._id),
        },
      },
      "productId yearlySalesTotal yearlyTotalSoldUnits"
    );

    const productStatsMap = new Map();
    productsWithStatsArray.forEach((productStat) => {
      productStatsMap.set(productStat.productId, productStat);
    });

    const productsWithStats = products.map((product) => {
      const productStats =
        productStatsMap.get(product._doc._id.toString()) || {};
      return {
        ...product._doc,
        stat: {
          ...productStats._doc,
        },
      };
    });
    res.status(200).json(productsWithStats);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort type: { field: String, sort: ['asc','desc'] }
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // sort type for mongo DB { userId: -1 } for asc
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      return {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };
    };
    const sortObject = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortObject)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      userId: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();
    const mappedLocation = users.reduce((geoObject, user) => {
      const countryISO3 = getCountryIso3(user.country);
      if (!geoObject[countryISO3]) {
        geoObject[countryISO3] = 0;
      }
      geoObject[countryISO3]++;
      return geoObject;
    }, {});
    const geoMapData = Object.entries(mappedLocation).map(([code, value]) => ({
      id: code,
      value,
    }));
    res.status(200).json(geoMapData);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
