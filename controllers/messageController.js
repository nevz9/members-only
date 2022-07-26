const Message = require('../models/message');
const { catchAsync } = require('../utils/catchAsync');
const { paginate } = require('../utils/paginate');

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const skip = paginate(req.query.page || 1);
  const messages = await Message.find()
    .populate({ path: 'user', select: '-password -email' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(10)
    .exec();

  res.render('index', { messages, info: req.flash('info')[0] });
});

exports.getMessage = (req, res) => res.render('new-message');

exports.postMessage = catchAsync(async (req, res, next) => {
  await Message.create({
    user: req.user,
    title: req.body.title,
    message: req.body.message
  });

  res.redirect('/');
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.messageId);

  req.flash('info', 'Successfully deleted the message');
  res.redirect('/');
});
