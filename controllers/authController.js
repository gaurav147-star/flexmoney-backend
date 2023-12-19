const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1d" });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" }); // Send error response and return to avoid further execution
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword }); // Use 'User.create' to create a new user
    if (!user) {
      return res.status(500).json({ error: "User creation failed" }); // Handle user creation failure
    }
    const token = generateToken(user._id);
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

const updateDetails = async (req, res) => {
  try {
    const { userId, gender, age, currentBatch, startDates } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (age < 18 || age > 65) {
      return res.status(400).json({ error: "Age should be between 18 and 65" });
    }
    if (!user.gender || !user.age || !user.currentBatch || !user.startDates) {
      if (!user.gender) {
        user.gender = gender;
      }
      if (!user.age) {
        user.age = age;
      }
      if (!user.currentBatch) {
        user.currentBatch = currentBatch;
      }
      if (!user.startDates) {
        user.startDates = new Date();
      }
      user.batchOfUpdates.push({
        batch: currentBatch,
        date: new Date(),
      });
      await user.save(); // Save the updated user details

      res.json({ success: true, user });
    } else {
      if (currentBatch !== user.currentBatch) {
        const availableBatches = ["6AM-7AM", "7AM-8AM", "8AM-9AM", "5PM-6PM"];
        if (!availableBatches.includes(currentBatch)) {
          return res.status(400).json({ error: "Invalid batch selection" });
        }

        const dateString = user.startDates;
        const dateObject1 = new Date(dateString);
        const dateObject2 = new Date();

        const diffInMonths =
          (dateObject2.getFullYear() - dateObject1.getFullYear()) * 12 +
          (dateObject2.getMonth() - dateObject1.getMonth());

        if (diffInMonths > 0) {
          user.startDates = new Date();
          user.currentBatch = currentBatch;
          user.batchOfUpdates.push({
            batch: currentBatch,
            date: new Date(),
          });
          await user.save();
          res.json({
            message: "User details updated successfully",
            user,
          });
        } else {
          res.json({ message: "Not one month completed" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update user details" });
  }
};

module.exports = { register, login, updateDetails };
