const CommunityBoardsService = {
    getCommunityBoards(db) {
        return db
            .from('communityBoards')
            .select("*")
            .orderBy('communityBoards.id', 'asc')
    },
    getSortedCommunityBoardsByNames(db) {
        return db
            .from('communityBoards')
            .select("*")
            .orderBy('communityBoards.board_title', 'asc')
    },
    getSortedCommunityBoardsByDates(db) {
        return db
            .from('communityBoards')
            .select("*")
            .orderBy('communityBoards.date_created', 'desc')
    },
    getSortedCommunityBoardsByLikes(db) {
        return db
            .from('communityBoards')
            .select("*")
            .orderBy('communityBoards.likes', 'desc')
    },
    getCommunityBoardsById(db, communityBoards_id) {
        return db
            .from('communityBoards')
            .select("*")
            .where('communityBoards.id', communityBoards_id)
            .first()
    },
    insertCommunityBoards(db, newCommunityBoards) {
        return db
            .insert(newCommunityBoards)
            .into('communityBoards')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteCommunityBoards(db, communityBoards_id) {
        return db('communityBoards')
            .where({ 'id': communityBoards_id })
            .delete()
    },
    updateCommunityBoards(db, communityBoards_id, newCommunityBoards) {
        return db('communityBoards')
            .where({ id: communityBoards_id })
            .update(newCommunityBoards, returning = true)
            .returning('*')
    }
}

module.exports = CommunityBoardsService