const Card = require('../models/card');
const ApiError = require('../error/apiError');

class CardController {
  static createCard(req, res, next) {
    const { name, link } = req.body;
    const id = req.user._id;

    if (name && link && id) {
      Card.create({
        name,
        link,
        owner: id,
      })
        .then((card) => res.send({ card }))
        .catch((e) => next(e));
    } else {
      next(ApiError.badRequest('Некорректные данные'));
    }
  }

  static getAllCards(req, res, next) {
    Card.find({})
      .populate('likes')
      .then((cards) => res.send({ cards }))
      .catch((e) => next(e));
  }

  static deleteCard(req, res, next) {
    Card.findByIdAndRemove(req.params.cardId)
      .then(() => res.sendStatus(200))
      .catch((e) => next(e));
  }

  static addLike(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('likes')
      .then((card) => res.status(200).send({ card }))
      .catch((e) => next(e));
  }

  static removeLike(req, res, next) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('likes')
      .then((card) => res.status(200).send({ card }))
      .catch(() => next(ApiError.internal('Произошла ошибка')));
  }
}
module.exports = CardController;
