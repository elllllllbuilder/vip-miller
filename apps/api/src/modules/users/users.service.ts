import { UsersRepository } from './users.repo';

export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async ensureUserExists(telegramUser: {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
  }) {
    return this.usersRepo.upsert({
      telegram_user_id: telegramUser.id.toString(),
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
    });
  }

  async getUserByTelegramId(telegramUserId: string) {
    return this.usersRepo.findByTelegramId(telegramUserId);
  }

  async listUsers(limit?: number, offset?: number) {
    return this.usersRepo.findAll(limit, offset);
  }
}
