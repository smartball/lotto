import users from '../../../model/users.model'

export const userService = () => {
  return {
    update: async (idUser, data) => {
      await users.update({ id: idUser }, { $set: data })
    }
  }
}