import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleShiftsService } from './schedule-shifts.service';

describe('ScheduleShiftService', () => {
  let service: ScheduleShiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleShiftsService],
    }).compile();

    service = module.get<ScheduleShiftsService>(ScheduleShiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
