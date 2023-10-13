import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleShiftService } from './schedule-shift.service';

describe('ScheduleShiftService', () => {
  let service: ScheduleShiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleShiftService],
    }).compile();

    service = module.get<ScheduleShiftService>(ScheduleShiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
