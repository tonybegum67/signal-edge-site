-- Four more session prep questions (from the Casey Lesher questionnaire), replacing a separate Google Form.
-- Run this BEFORE merging the pull request that adds them to the form. Safe to run twice.

alter table public.prep_responses
  add column if not exists files_location text
    check (files_location in ('google', 'dropbox', 'onedrive', 'computer', 'mix')),
  add column if not exists crm text,
  add column if not exists ai_comfort smallint check (ai_comfort between 1 and 5),
  add column if not exists remember text;
