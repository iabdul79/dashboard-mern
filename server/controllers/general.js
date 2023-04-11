import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transactions from "../models/Transaction.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const currentMonth = "November";
    const currentYear = 2021;
    const currentDay = "2021-11-15";

    const transactions = await Transactions.find()
      .limit(50)
      .sort({ createdOn: -1 });
    const overallStat = await OverallStat.find({ year: currentYear });
    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];
    const thisMonthStats = overallStat[0].monthlyData.find(
      ({ month }) => month === currentMonth
    );
    const todayStats = overallStat[0].dailyData.find(
      ({ date }) => date === currentDay
    );

    res.status(200).json({
      totalCustomers,
      yearlySalesTotal,
      yearlyTotalSoldUnits,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};
