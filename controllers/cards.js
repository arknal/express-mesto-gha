const Card = require('../models/card');

const { okStatusCode } = require('../utils/consts');

const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');
const BadRequestError = require('../error/BadRequestError');

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
module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  addLike,
  removeLike,
};
