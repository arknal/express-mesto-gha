const Card = require('../models/card');

const { okStatusCode } = require('../utils/consts');

const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');
const BadRequestError = require('../error/BadRequestError');
const User = require('../models/user');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({
    name,
    link,
    owner: id,
  })
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Ошибка. Некорректные данные'));
      } else {
        next(e);
      }
    });
}

function getAllCards(req, res, next) {
  Card.find({})
    .populate('likes')
    .then((cards) => res.status(okStatusCode).send({ cards }))
    .catch(next);
}

function getUserCards(req, res, next) {
  Card.find({ owner: req.user._id })
    .populate('likes')
    .then((cards) => res.status(okStatusCode).send({ cards }))
    .catch(next);
}

function getSubscribeCards(req, res, next) {
  User.findById(req.user._id)
    .then((user) => user.subscribe)
    .then(async (subs) => {
      const cardArr = [];
      // eslint-disable-next-line
      for (let sub of subs) {
        // eslint-disable-next-line
        const query = await Card.find({ owner: sub });
        cardArr.push(...query);
      }
      res.status(okStatusCode).send({ cards: cardArr });
    }).catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Ошибка. Карточка не найдена'))
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        throw new ForbiddenError('Доступ запрещен');
      }
      return card.remove();
    })
    .then(() => {
      res.status(okStatusCode).send({ message: 'Карточка успешно удалена' });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректный id карточки'));
      } else {
        next(e);
      }
    });
}

function addLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Ошибка. Карточка не найдена'))
    .populate('likes')
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректный id карточки'));
      } else {
        next(e);
      }
    });
}

function removeLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Ошибка. Карточка не найдена'))
    .populate('likes')
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректный id карточки'));
      } else {
        next(e);
      }
    });
}
function addComment(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { comments: { user: req.user._id, message: req.body.message } } },
    { new: true },
  )
    .orFail(new NotFoundError('Ошибка. Карточка не найдена'))
    .populate('likes')
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректный id карточки'));
      } else {
        next(e);
      }
    });
}

function deleteComment(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { comments: { _id: req.params.commentId } } },
    { new: true },
  )
    .orFail(new NotFoundError('Ошибка. Карточка не найдена'))
    .populate('likes')
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректный id карточки'));
      } else {
        next(e);
      }
    });
}
module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  addLike,
  removeLike,
  addComment,
  deleteComment,
  getSubscribeCards,
  getUserCards,
};
