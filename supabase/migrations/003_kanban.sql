-- ── 003_kanban.sql ───────────────────────────────────────────────────────────
-- Production Kanban Board
-- Adds two tables: kanban_columns and kanban_cards
-- Each project gets its own board; columns can optionally map to a VSM step
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Kanban Columns ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kanban_columns (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id     UUID        REFERENCES steps(id) ON DELETE SET NULL,  -- optional VSM link
  title       TEXT        NOT NULL,
  color       TEXT        NOT NULL DEFAULT '#28285C',
  wip_limit   INTEGER,                                               -- NULL = unlimited
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kanban_columns_project_id_idx ON kanban_columns(project_id);
CREATE INDEX IF NOT EXISTS kanban_columns_position_idx   ON kanban_columns(project_id, position);

-- ── Kanban Cards ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kanban_cards (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  column_id      UUID        NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id        UUID        REFERENCES steps(id) ON DELETE SET NULL,  -- optional VSM step link
  title          TEXT        NOT NULL,
  description    TEXT,
  priority       TEXT        NOT NULL DEFAULT 'normal'    -- critical | high | normal | low
                             CHECK (priority IN ('critical','high','normal','low')),
  assignee       TEXT,
  due_date       DATE,
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  blocked_reason TEXT,
  position       INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS kanban_cards_project_id_idx  ON kanban_cards(project_id);
CREATE INDEX IF NOT EXISTS kanban_cards_column_id_idx   ON kanban_cards(column_id);
CREATE INDEX IF NOT EXISTS kanban_cards_position_idx    ON kanban_cards(column_id, position);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards   ENABLE ROW LEVEL SECURITY;

-- Users can only see their own columns
CREATE POLICY "Users manage own kanban_columns"
  ON kanban_columns FOR ALL
  USING (auth.uid() = user_id);

-- Users can only see their own cards
CREATE POLICY "Users manage own kanban_cards"
  ON kanban_cards FOR ALL
  USING (auth.uid() = user_id);

-- ── Updated_at trigger (reuse or create) ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_updated_at_kanban_columns
  BEFORE UPDATE ON kanban_columns
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_kanban_cards
  BEFORE UPDATE ON kanban_cards
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
