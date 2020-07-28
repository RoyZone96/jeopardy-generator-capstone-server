const QuestionsService = {
    getQuestions(db) {
        return db
            .from('questions')
            .select(
                'question.id',
                'boards.user_id',
                'boards.board_title',
                'boards.date_created',
                'boards.date_updated'
            )
    },
    getQuestionsById(db, questions_id ){
        return db
            .from('questions')
            .select(
                'boards.id',
                'boards.user_id',
                'boards.board_title',
                'boards.date_created',
                'boards.date_updated'
            )
            .where('users.id', users_id)
            .first()
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
        return db('boards')
            .where({ id: questions_id })
            .update(newQuestions, returning = true)
            .returning('*')
    }

}

module.exports = QuestionsService