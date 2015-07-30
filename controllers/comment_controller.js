var models = require('../models/models.js');

//GET /quizes/:quizesId/comments/new
exports.new = function (req, res) {
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST quizes/:quizId/comments
exports.create = function (req, res) {
	var comment = models.Comment.build({
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});
	comment.validate().then(function (err) {
		if (err) {
			res.render('comments/new.ejs', {comment: comment, errors: err.errors});
		} else { //save: guarda en la BD el comentario
			comment.save().then(function() { 
				res.redirect('/quizes/'+req.params.quizId)
			}) //re.redirect: Redirección HTTP a la lista de preguntas
		}
	}).catch(function (error) { next(error) });
};