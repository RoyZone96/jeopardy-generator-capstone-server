const BoardsService = {
    getBoards(db) {
        return db
            .from('users')
            .select(
                'boards.id',
                'boards.user_id',
                'boards.board_title',
                'boards.date_created',
                'boards.date_updated'
            )
    },
    getBoardsById(db, boards_id ){
        return db
            .from('users')
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
    insertBoards(db, newBoards) {
        return db
            .insert(newBoards)
            .into('boards')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteBoards(db, boards_id) {
        return db('boards')
            .where({ 'id': boards_id })
            .delete()
    },
    updateBoads(db, boards_id, newBoards) {
        return db('boards')
            .where({ id: boards_id })
            .update(newBoards, returning = true)
            .returning('*')
    }

}

module.exports = BoardsService