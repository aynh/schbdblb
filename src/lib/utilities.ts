import type { Periode } from './types';

/** Apakah periode belum dilewati? */
export const periodeIsFuture = (
	{ mulai: { jam, menit = 0 } }: Pick<Periode, 'mulai'>,
	jam_: number,
	menit_: number,
) => {
	return jam_ < jam || (jam_ === jam && menit_ < menit);
};

/** Apakah periode sudah dilewati? */
export const periodeIsPast = (
	{ selesai: { jam, menit = 0 } }: Pick<Periode, 'selesai'>,
	jam_: number,
	menit_: number,
) => {
	return jam_ > jam || (jam_ === jam && menit_ > menit);
};

/** Apakah periode sedang berlangsung? */
export const periodeIsActive = (periode: Periode, jam: number, menit: number) => {
	return !periodeIsPast(periode, jam, menit) && !periodeIsFuture(periode, jam, menit);
};

if (import.meta.vitest) {
	const { describe, expect, it } = import.meta.vitest;

	describe('periode is active', () => {
		type Args = Parameters<typeof periodeIsActive>;

		describe.each<Args>([
			[{ mulai: { jam: 8 }, selesai: { jam: 10 } }, 8, 0],
			[{ mulai: { jam: 8 }, selesai: { jam: 10 } }, 10, 0],
			[{ mulai: { jam: 8, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 8, 20],
			[{ mulai: { jam: 8, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 10, 40],
		])('exactly at mulai and selesai', (...args) => {
			it('should match', () => {
				expect(periodeIsActive(...args)).toBe(true);
			});
		});

		describe.each<Args>([
			[{ mulai: { jam: 9 }, selesai: { jam: 10 } }, 9, 20],
			[{ mulai: { jam: 9 }, selesai: { jam: 10 } }, 9, 40],
			[{ mulai: { jam: 9, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 9, 40],
			[{ mulai: { jam: 9, menit: 20 }, selesai: { jam: 10, menit: 40 } }, 10, 20],
		])('in range', (...args) => {
			it('should match', () => {
				expect(periodeIsActive(...args)).toBe(true);
			});
		});
	});
}
