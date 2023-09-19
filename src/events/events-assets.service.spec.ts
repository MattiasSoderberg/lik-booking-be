import { Test, TestingModule } from '@nestjs/testing';
import { EventsAssetsService } from './events-assets.service';

describe('EventsAssetsService', () => {
  let service: EventsAssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsAssetsService],
    }).compile();

    service = module.get<EventsAssetsService>(EventsAssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
