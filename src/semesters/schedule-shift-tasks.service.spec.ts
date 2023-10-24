import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleShiftTasksService } from './schedule-shift-tasks.service';

describe('ScheduleShiftTasksService', () => {
  let service: ScheduleShiftTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleShiftTasksService],
    }).compile();

    service = module.get<ScheduleShiftTasksService>(ScheduleShiftTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
