const users = new Map();

export const userRepository = {
  async create(user) {
    users.set(user.id, user);

    return user;
  },

  async findById(id) {
    return users.get(id) || null;
  },
};
