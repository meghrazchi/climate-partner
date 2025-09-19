import { Body, Controller, Get, Post } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly trips: TripsService) {}

  @Get() list() { return this.trips.list(); }

  @Post() create(@Body() dto: CreateTripDto) { return this.trips.create(dto); }

  @Get('stats') stats() { return this.trips.stats(); }
}
