const QuestionsService = {
    getQuestions(db) {
        return db
            .from('questions')
            .select("*")
    },
    getQuestionsById(db, questions_id ){
        return db
            .from('questions')
            .select("*")
            .where('questions.id', questions_id)
            .first()
    },
    getQuestionsByBoardId(db, board_id ){
        return db
            .from('questions')
            .select("*")
            .where('questions.board_id', board_id)
            .orderBy('questions.question_points', 'asc')
            .orderBy('questions.question_category', 'asc')
    },
    insertQuestions(db, newQuestions) {
        return db
            .insert(newQuestions)
            .into('questions')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteQuestions(db, questions_id) {
        return db('questions')
            .where({ 'id': questions_id })
            .delete()
    },
    updateQuestions(db, questions_id, newQuestions) {
        return db('questions')
            .where({ id: questions_id })
            .update(newQuestions, returning = true)
            .returning('*')
    }

}

module.exports = QuestionsService