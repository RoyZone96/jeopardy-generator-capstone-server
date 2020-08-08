const BoardsService = {
    getBoards(db) {
        return db
            .from('boards')
            .select("*")
    },
    getBoardsById(db, boards_id ){
        return db
            .from('boards')
            .select("*")
            .where('boards.id', boards_id)
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
    updateBoards(db, boards_id, newBoards) {
        return db('boards')
            .where({ id: boards_id })
            .update(newBoards, returning = true)
            .returning('*')
    }

}

module.exports = BoardsService