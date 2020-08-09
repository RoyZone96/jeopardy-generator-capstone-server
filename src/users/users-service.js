const UsersService = {
    getUsers(db) {
        return db
            .from('users')
            .select("*")
    },
    getUsersById(db, users_id ){
        return db
            .from('users')
            .select("*")
            .where('users.id', users_id)
            .first()
    },
    postUser(newUsers) {
         return fetch(`${config.API_ENDPOINT}/users`, {
           method: 'POST',
           headers: {
             'content-type': 'application/json',
           },
           body: JSON.stringify(),
         })
           .then(res =>
             (!res.ok)
               ? res.json().then(e => Promise.reject(e))
               : res.json()
           )
       },
    insertUsers(db, newUsers) {
        return db
            .insert(newUsers)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteUsers(db, users_id) {
        return db('users')
            .where({ 'id': users_id })
            .delete()
    },
    updateUsers(db, users_id, newUsers) {
        return db('users')
            .where({ id: users_id })
            .update(newUsers, returning = true)
            .returning('*')
    }

}

module.exports = UsersService