import { Test, TestingModule } from '@nestjs/testing';
import { UsersClientsService } from './users-clients.service';

describe('UsersClientsService', () => {
  let service: UsersClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersClientsService],
    }).compile();

    service = module.get<UsersClientsService>(UsersClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
