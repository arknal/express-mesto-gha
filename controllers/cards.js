const Card = require('../models/card');
const ApiError = require('../error/apiError');

function handleError(error, next) {
  switch (error.name) {
    case 'CastError':
      next(new ApiError(400, 'Ошибка. Некорректный id карточки'));
      break;
    case 'ValidationError':
      next(new ApiError(400, 'Ошибка. Некорректные данные'));
      break;
    default:
      next(error);
      break;
  }
}
function checkCard(card) {
  if (!card) {
    throw new ApiError(404, 'Ошибка. Карточка с таким id не найдена');
  }
}
function createCard(req, res, next) {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({
    name,
    link,
    owner: id,
  })
    .then((card) => res.status(201).send({ card }))
    .catch((e) => next(e));
}

function getAllCards(req, res, next) {
  Card.find({})
    .populate('likes')
    .then((cards) => res.status(200).send({ cards }))
    .catch((e) => next(e));
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      checkCard(card);
    })
    .then(() => {
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((e) => handleError(e, next));
}

function addLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      checkCard(card);
      return card;
    })
    .then((card) => res.status(200).send({ card }))
    .catch((e) => handleError(e, next));
}

function removeLike(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      checkCard(card);
      return card;
    })
    .then((card) => res.send({ card }))
    .catch((e) => handleError(e, next));
}
module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  addLike,
  removeLike,
};
