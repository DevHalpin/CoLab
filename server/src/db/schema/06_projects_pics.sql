DROP TABLE IF EXISTS projects_pics CASCADE;

CREATE TABLE projects_pics (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  picture_path VARCHAR NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_cover_photo BOOL DEFAULT FALSE
);