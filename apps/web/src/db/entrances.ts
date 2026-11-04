export function searchEntrances(q: string): Entrance[] {
  // q travels as a bound parameter: data, never part of the SQL text
  return db
    .query<EntranceRow, [string]>(
      `${SELECT_ENTRANCES} WHERE e.address LIKE ? ORDER BY e.id`
    )
    .all(`%${q}%`)
    .map(toEntrance);
}