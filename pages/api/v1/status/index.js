import database from "infra/database.js";

async function status(request, response) {
  const postgresVersion = (await database.query("SHOW server_version;")).rows[0]
    .server_version;

  const postgresMaxConnections = +(
    await database.query("SHOW max_connections;")
  ).rows[0].max_connections;

  const postgresOpenedConnections = (
    await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [process.env.POSTGRES_DB],
    })
  ).rows[0].count;

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: postgresMaxConnections,
        opened_connections: postgresOpenedConnections,
      },
    },
  });
}

export default status;
