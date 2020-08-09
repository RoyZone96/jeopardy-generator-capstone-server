const SupportsService = {
    getSupports(db) {
        return db
            .from('supports')
            .select("*")
    },
    getSupportsById(db, supports_id ){
        return db
            .from('supports')
            .select("*")
            .where('supports.id', supports_id)
            .first()
    },
    insertSupports(db, newSupports) {
        return db
            .insert(newSupports)
            .into('supports')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteSupports(db, supports_id) {
        return db('supports')
            .where({ 'id': supports_id })
            .delete()
    },
    updateSupports(db, supports_id, newSupports) {
        return db('supports')
            .where({ id: supports_id })
            .update(newSupports, returning = true)
            .returning('*')
    }

}

module.exports = SupportsService