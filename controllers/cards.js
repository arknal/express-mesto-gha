const Card = require('../models/card');
const ApiError = require('../error/apiError');
const {
  okStatusCode,
  badRequestStatusCode,
  notFoundStatusCode,
  forbiddenStatusCode,
} = require('../utils/consts');

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
      switch (e.name) {
        case 'ValidationError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректные данные'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function getAllCards(req, res, next) {
  Card.find({})
    .populate('likes')
    .then((cards) => res.status(okStatusCode).send({ cards }))
    .catch((e) => next(e));
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(new ApiError(notFoundStatusCode, 'Ошибка. Карточка не найдена'))
    .then((card) => {
      if (!(card._doc.owner.toString() === req.user._id)) {
        throw new ApiError(forbiddenStatusCode, 'Доступ запрещен');
      }
      return card.remove();
    })
    .then(() => {
      res.status(okStatusCode).send({ message: 'Карточка успешно удалена' });
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id карточки'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function addLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate('likes')
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id карточки'));
          break;
        case 'DocumentNotFoundError':
          next(new ApiError(notFoundStatusCode, 'Ошибка. Карточка не найдена'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function removeLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate('likes')
    .then((card) => res.status(okStatusCode).send({ card }))
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id карточки'));
          break;
        case 'DocumentNotFoundError':
          next(new ApiError(notFoundStatusCode, 'Ошибка. Карточка не найдена'));
          break;
        default:
          next(e);
          break;
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
