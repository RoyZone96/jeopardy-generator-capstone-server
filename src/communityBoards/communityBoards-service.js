const CommunityBoardsService = {
    getCommunityBoards(db) {
        return db
            .from('boards')
            .select("*")
    },
    getCommunityBoardsById(db, boards_id ){
        return db
            .from('boards')
            .select("*")
            .where('boards.id', boards_id)
            .first()
    },
    insertCommunityBoards(db, newCommunityBoards) {
        return db
            .insert(newCommunityBoards)
            .into('boards')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteCommunityBoards(db, boards_id) {
        return db('boards')
            .where({'id': boards_id})
            .delete()
    },
    updateCommunityBoards(db, boards_id, newCommunityBoards) {
        return db('boards')
            .where({ id: boards_id })
            .update(newCommunityBoards, returning = true)
            .returning('*')
    }
}

module.exports = CommunityBoardsService