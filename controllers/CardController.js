const Card = require('../models/card');
const ApiError = require('../error/apiError');

class CardController {
  static createCard(req, res, next) {
    const { name, link } = req.body;
    const id = req.user._id;

    if (name.length > 30 || name.length < 2) {
      throw ApiError.badRequest('Ошибка. Длина name должна быть от 2 до 30 символов');
    }

    Card.create({
      name,
      link,
      owner: id,
    })
      .then((card) => res.status(201).send({ card }))
      .catch((e) => next(e));
  }

  static getAllCards(req, res, next) {
    Card.find({})
      .populate('likes')
      .then((cards) => res.status(200).send({ cards }))
      .catch((e) => next(e));
  }

  static deleteCard(req, res, next) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw ApiError.notFound('Ошибка. Карточка с таким id не найдена');
        }
      })
      .then(() => {
        res.status(200).send({ message: 'Карточка успешно удалена' });
      })
      .catch((e) => CardController.handleError(e, next));
  }

  static addLike(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('likes')
      .then((card) => {
        if (!card) {
          throw ApiError.notFound('Ошибка. Карточка с таким id не найдена');
        }
        return card;
      })
      .then((card) => res.status(200).send({ card }))
      .catch((e) => CardController.handleError(e, next));
  }

  static removeLike(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('likes')
      .then((card) => {
        if (!card) {
          throw ApiError.notFound('Ошибка. Карточка с таким id не найдена');
        }
        return card;
      })
      .then((card) => res.send({ card }))
      .catch((e) => CardController.handleError(e, next));
  }

  static handleError(error, next) {
    switch (error.name) {
      case 'CastError':
        next(ApiError.badRequest('Ошибка. Некорректный id карточки'));
        break;
      default:
        next(error);
        break;
    }
  }
}
module.exports = CardController;
