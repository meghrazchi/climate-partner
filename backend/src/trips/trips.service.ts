import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { EMISSION_FACTORS } from './emissions';

@Injectable()
export class TripsService {
  constructor(@InjectRepository(Trip) private repo: Repository<Trip>) {}

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateTripDto) {
    const factor = EMISSION_FACTORS[dto.mode];
    const emissionsKg = Number((dto.distanceKm * factor).toFixed(3));
    const trip = this.repo.create({ ...dto, emissionsKg });
    return this.repo.save(trip);
  }

  async stats() {
  // total (may return undefined if there are no rows)
  const totalRow = await this.repo
    .createQueryBuilder('t')
    .select('COALESCE(SUM(t.emissionsKg), 0)', 'total')
    .getRawOne<{ total: string } | undefined>();

  const totalKg = Number(totalRow?.total ?? 0);

  // by mode (0 if no rows for a mode)
  const byModeRows = await this.repo
    .createQueryBuilder('t')
    .select('t.mode', 'mode')
    .addSelect('COALESCE(SUM(t.emissionsKg), 0)', 'kg')
    .groupBy('t.mode')
    .orderBy('mode', 'ASC')
    .getRawMany<{ mode: 'FLIGHT' | 'TRAIN' | 'CAR'; kg: string }>();

  return {
    totalKg,
    byMode: byModeRows.map(r => ({
      mode: r.mode,
      _sum: { emissionsKg: Number(r.kg ?? 0) },
    })),
  };
}

}
