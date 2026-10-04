### Compose postgres container

```bash
docker compose up -d postgres
```

### Initialize db

```bash
docker compose exec -T postgres psql -U artist -d art < schema.sql
```

### Useful Requests

List `projects`

```bash
curl http://localhost:3000/projects
```

Create `project`

```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "first project",
    "type": "art"
  }'
```
