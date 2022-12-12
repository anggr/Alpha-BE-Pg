const { User, Detail } = require('../models');
const bcrypt = require('bcryptjs');

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users) {
      res.status(404).json({
        result: 'failed',
        message: 'no user registered yet',
      });
    }

    return res.status(200).json({
      result: 'success',
      message: 'successfully retrive data',
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      result: 'failed',
      message: 'failed retrive data',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      username,
    } = req.body;

    const id = req.user.id;
    const hashPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10),
      null
    );

    const user = await User.update(
      {
        first_name,
        last_name,
        email,
        username,
        password: hashPassword,
      },
      { where: { id }, returning: true }
    );

    if (!user) {
      return res.status(404).json({
        result: 'failed',
        message: ' User Not Found',
      });
    }
    return res.status(200).json({
      result: 'success',
      message: 'Congratulations, your account has been successfully updated.',
      data: user[1][0],
    });
  } catch (err) {
    return res.status(400).json({
      result: 'faileds',
      message: 'Oops! Something went wrong',
      error: err.message,
    });
  }
};

const findOne = (req, res) => {
  User.findOne({
    attributes: [
      'id',
      'first_name',
      'last_name',
      'email',
      'username',
      'total_score',
      'createdAt',
      'updatedAt',
    ],
    where: {
      username: req.params.username,
    },
  })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          result: 'failed',
          message: 'user not registered',
        });
      }
      res.status(200).json({
        result: 'success',
        message: 'successfully retrieve data',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: 'failed',
        message: 'some error occured while retrieving game',
        error: err.message,
      });
    });
};

const getLeaderboard = (req, res) => {
  User.findAll({
    order: [['total_score', 'DESC']],
  })
    .then((data) => {
      res.status(200).json({
        result: 'success',
        message: 'successfully retrieve data',
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: 'failed',
        message: 'some error occured while retrieving game',
        error: err.message,
      });
    });
};

const updateScore = async (req, res) => {
  let user = await Detail.findOne({
    attributes: ['score'],
    where: {
      userId: req.user.id,
      gameId: req.body.gameId,
    },
  });
  if (!user) {
    return Detail.create({
      userId: req.user.id,
      gameId: req.body.gameId,
      score: req.body.score,
    })
      .then((data) => {
        res.status(201).json({
          result: 'success',
          message: 'score player has been successfully added',
          data: {
            score: data.score,
          },
        });
      })
      .catch((err) => {
        res.status(501).json({
          result: 'failed',
          message: 'some error occured while adding score',
          error: err.message,
        });
      });
  }

  Detail.update(
    {
      score: parseInt(req.body.score) + user['score'],
    },
    {
      where: {
        userId: req.user.id,
        gameId: req.body.gameId,
      },
      returning: true,
    }
  )
    .then((data) => {
      res.status(200).json({
        result: 'success',
        message: 'score player has been successfully updated',
        data: {
          score: data[1][0].score,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        result: 'failed',
        message: 'some error occured while updating score',
        error: err.message,
      });
    });
};

const getPlayedGame = (req, res) => {
  Detail.findAll({
    attributes: ['gameId'],
    where: {
      userId: req.user.id,
    },
  })
  .then((game) => {
    res.status(200).json({
      result: 'success',
      message: 'successfully retriving data',
      data: game,
    });
  })
  .catch((err) => {
    res.status(500).json({
      result: 'failed',
      message: 'some error occured while retriving data',
      error: err.message,
    });
  });
};

module.exports = {
  findOne,
  getLeaderboard,
  getAllUser,
  updateUser,
  updateScore,
  getPlayedGame,
};
