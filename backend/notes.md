### Compose postgres container

```bash
docker compose up -d postgres
```

### Initialize db

```bash
docker compose exec -T postgres psql -U artist -d art < schema.sql
```

### Useful Requests

Load `.env` first; endpoints requiring auth will need `ADMIN_API_KEY`

```bash
source .env
```

#### GET `projects`

```bash
curl http://localhost:3000/projects
```

#### GET `project` by `id`

```bash
curl http://localhost:3000/projects/1
```

#### CREATE `project`

```bash
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "first project",
    "category": "art"
  }'
```

#### PATCH `project`

```bash
curl -X PATCH http://localhost:3000/projects/1 \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Updated Project" }'
```

#### DELETE `project`

```bash
curl -X DELETE http://localhost:3000/projects/1 -H "Authorization: Bearer $ADMIN_API_KEY"
```
