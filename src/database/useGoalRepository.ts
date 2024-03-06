import { useSQLiteContext } from 'expo-sqlite/next'

export type GoalCreateDatabase = {
  name: string;
  total: number;
}

export type GoalResponseDatabase = {
  id: string;
  name: string;
  total: number;
  current: number;
}

export function useGoalRepository() {
  const database = useSQLiteContext();

  function create(goal: GoalCreateDatabase) {
    const statement = database.prepareSync(
      "INSERT INTO goals (name, total) VALUES ($name, $total)"
    )

    statement.executeSync({
      $name: goal.name,
      $total: goal.total
    })

  }

  function all() {
    return database.getAllSync<GoalResponseDatabase>(`
        SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
        FROM goals AS g
        LEFT JOIN transactions t ON t.goal_id = g.id
        GROUP BY g.id, g.name, g.total
      `)
  }

  return {
    create,
    all,
  }
}
