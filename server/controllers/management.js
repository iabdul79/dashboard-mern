import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const userWithStat = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);
    const salesTransactions = await Promise.all(
      userWithStat[0].affiliateStats.affiliateSales.map((id) =>
        Transaction.findById(id)
      )
    );
    const refinedTransactions = salesTransactions.filter(
      (transaction) => transaction !== null
    );
    res.status(200).json({ user: userWithStat[0], sales: refinedTransactions });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};
