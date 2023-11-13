const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    alive: req.body.alive,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, alive: newDomo.alive });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age alive').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const updateDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || req.body.alive === undefined) {
    return res.status(400).json({ error: 'Name, age, and alive status are required!' });
  }

  const updateData = {
    name: req.body.name,
    age: req.body.age,
    alive: req.body.alive,
  };

  try {
    const filter = { _id: req.body.id, owner: req.session.account._id };
    const options = { new: true };

    const updatedDomo = await Domo.findOneAndUpdate(filter, updateData, options);

    if (!updatedDomo) {
      return res.status(400).json({ error: 'No Domo found to update!' });
    }

    const response = {
      name: updatedDomo.name,
      age: updatedDomo.age,
      alive: updatedDomo.alive,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while updating the Domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  updateDomo,
};
